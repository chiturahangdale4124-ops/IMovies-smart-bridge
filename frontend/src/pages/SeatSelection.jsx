import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { showService } from '../services/showService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
import { SeatPicker } from '../components/SeatPicker';
import { BookingSuccessModal } from '../components/BookingSuccessModal';

export const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await showService.getShowSeats(showId);
      if (data.success) {
        setShowData(data);
      }
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError('Unable to load seat layout. The showtime may have ended or been modified.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seatNumber) => {
    setBookingError('');
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  // Calculate pricing breakdown
  const selectedSeatObjects = showData?.seats?.filter((s) =>
    selectedSeats.includes(s.seatNumber)
  ) || [];

  const subTotal = selectedSeatObjects.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length * 25;
  const grandTotal = subTotal + convenienceFee;

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      setBookingError('Please select at least one seat to proceed.');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: `/book/${showId}` } });
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError('');

      const res = await bookingService.createBooking({
        showId,
        selectedSeats,
        paymentMethod: 'IMovies Instant Checkout',
      });

      if (res.success) {
        setConfirmedBooking(res.booking);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      const errMsg =
        err.response?.data?.message ||
        'Booking could not be completed. One or more seats might be booked by another user.';
      setBookingError(errMsg);
      // Refresh current seat status to reflect newly booked seats
      fetchSeats();
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="danger" />
        <p className="text-secondary mt-3">Loading cinema seat layout...</p>
      </div>
    );
  }

  if (error || !showData) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="cinema-card border-danger text-light py-4">
          <i className="bi bi-exclamation-triangle-fill fs-2 d-block mb-2 text-danger"></i>
          <h4>Unable to Load Show</h4>
          <p className="text-secondary mb-3">{error || 'Show not found'}</p>
          <Button as={Link} to="/" className="btn-cinema">
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="seat-selection-page py-4 pb-5">
      <Container>
        {/* Breadcrumb / Top Info Bar */}
        <div className="cinema-card p-3 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Button
                variant="outline-secondary"
                size="sm"
                className="btn-cinema-outline py-1 px-2 me-2"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i>
              </Button>
              <h4 className="text-white fw-bold mb-0 brand-font">
                {showData.movie?.title}
              </h4>
              <Badge bg="danger">{showData.movie?.certification || 'UA'}</Badge>
            </div>
            <p className="text-secondary small mb-0">
              <i className="bi bi-building me-1 text-danger"></i>
              {showData.theatre?.name} • {showData.theatre?.location}
            </p>
          </div>

          <div className="d-flex align-items-center gap-3 text-md-end">
            <div className="bg-dark p-2 px-3 rounded-2 border border-secondary">
              <span className="text-secondary small d-block">Screen</span>
              <strong className="text-info">{showData.screen}</strong>
            </div>
            <div className="bg-dark p-2 px-3 rounded-2 border border-secondary">
              <span className="text-secondary small d-block">Schedule</span>
              <strong className="text-white">{showData.showDate} • {showData.showTime}</strong>
            </div>
          </div>
        </div>

        {bookingError && (
          <Alert variant="danger" className="cinema-card border-danger text-light mb-4">
            <i className="bi bi-exclamation-octagon-fill me-2 text-danger"></i>
            {bookingError}
          </Alert>
        )}

        <Row className="gy-4">
          {/* Seat Layout View */}
          <Col lg={8}>
            <div className="cinema-card p-4 text-center">
              <SeatPicker
                seats={showData.seats}
                selectedSeats={selectedSeats}
                onToggleSeat={handleToggleSeat}
              />
            </div>
          </Col>

          {/* Booking Summary Sidebar */}
          <Col lg={4}>
            <div className="cinema-card p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="text-white fw-bold brand-font mb-3 border-bottom border-secondary pb-2">
                <i className="bi bi-receipt text-danger me-2"></i> Booking Summary
              </h5>

              <div className="mb-3">
                <small className="text-secondary d-block mb-1">Selected Seats ({selectedSeats.length}):</small>
                {selectedSeats.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedSeats.map((seatNum) => (
                      <Badge
                        key={seatNum}
                        bg="danger"
                        className="p-2 d-inline-flex align-items-center gap-1 cursor-pointer"
                        onClick={() => handleToggleSeat(seatNum)}
                        title="Click to remove"
                      >
                        {seatNum} <i className="bi bi-x"></i>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small fst-italic">No seats selected yet. Click any seat on the grid.</p>
                )}
              </div>

              {/* Price Breakdown */}
              {selectedSeats.length > 0 && (
                <div className="border-top border-secondary pt-3 mb-3">
                  <div className="d-flex justify-content-between text-secondary small mb-1">
                    <span>Tickets Subtotal ({selectedSeats.length}):</span>
                    <span className="text-white">₹{subTotal}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary small mb-2">
                    <span>Convenience Fee & Taxes:</span>
                    <span className="text-white">₹{convenienceFee}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary">
                    <span className="text-white fw-bold">Total Amount:</span>
                    <span className="fs-4 fw-black text-danger brand-font">₹{grandTotal}</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                className="btn-cinema w-100 py-3 mt-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                disabled={selectedSeats.length === 0 || bookingLoading}
                onClick={handleConfirmBooking}
              >
                {bookingLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Reserving Seats...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill"></i>
                    <span>Confirm & Book (₹{grandTotal})</span>
                  </>
                )}
              </Button>

              <small className="text-secondary text-center d-block mt-3 opacity-75" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-shield-check text-success me-1"></i>
                Guaranteed atomic reservation — no double booking
              </small>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Confirmation Receipt Modal */}
      <BookingSuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        booking={confirmedBooking}
      />
    </div>
  );
};
