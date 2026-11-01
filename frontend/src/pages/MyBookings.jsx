import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { BookingSuccessModal } from '../components/BookingSuccessModal';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookingService.getMyBookings();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      setCancelling(true);
      const res = await bookingService.cancelBooking(bookingToCancel._id);
      if (res.success) {
        setShowCancelModal(false);
        setBookingToCancel(null);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="my-bookings-page py-5 pb-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white fw-bold brand-font mb-1">
              <i className="bi bi-ticket-perforated-fill text-danger me-2"></i> My Bookings
            </h2>
            <p className="text-secondary small mb-0">
              View your active movie tickets and past booking history
            </p>
          </div>
          <Button as={Link} to="/" className="btn-cinema">
            <i className="bi bi-plus-circle me-1"></i> Book More Movies
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="cinema-card border-danger text-light mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5 my-5">
            <Spinner animation="border" variant="danger" />
            <p className="text-secondary mt-3">Loading your tickets...</p>
          </div>
        ) : bookings.length > 0 ? (
          <Row className="g-4">
            {bookings.map((booking) => {
              const isCancelled = booking.bookingStatus === 'cancelled';

              return (
                <Col key={booking._id} lg={6}>
                  <div className={`cinema-card p-4 h-100 position-relative ${isCancelled ? 'opacity-75' : ''}`}>
                    {/* Status Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="text-secondary small d-block">Booking Reference</span>
                        <span className="fw-bold fs-5 text-danger brand-font">
                          {booking.bookingReference}
                        </span>
                      </div>
                      <Badge bg={isCancelled ? 'secondary' : 'success'} className="px-3 py-2">
                        {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                      </Badge>
                    </div>

                    {/* Movie Info */}
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src={booking.movieId?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
                        alt={booking.movieId?.title}
                        className="rounded-2 object-fit-cover shadow-sm"
                        style={{ width: 70, height: 100 }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="text-white fw-bold mb-1">
                          {booking.movieId?.title || 'Movie'}
                        </h5>
                        <p className="text-secondary small mb-1">
                          <i className="bi bi-geo-alt text-danger me-1"></i>
                          {booking.theatreId?.name}
                        </p>
                        <p className="text-info small mb-1">
                          <i className="bi bi-display me-1"></i>
                          {booking.showId?.screen || 'Screen 1'}
                        </p>
                        <div className="text-white small fw-semibold">
                          <i className="bi bi-calendar-event me-1 text-danger"></i>
                          {booking.showId?.showDate} • {booking.showId?.showTime}
                        </div>
                      </div>
                    </div>

                    {/* Seats & Price */}
                    <div className="d-flex justify-content-between align-items-center bg-dark p-2 px-3 rounded-2 border border-secondary mb-3">
                      <div>
                        <small className="text-secondary d-block">Reserved Seats</small>
                        <span className="text-danger fw-bold">{booking.selectedSeats?.join(', ')}</span>
                      </div>
                      <div className="text-end">
                        <small className="text-secondary d-block">Total Paid</small>
                        <span className="text-white fw-bold fs-6">₹{booking.totalAmount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-light"
                        className="btn-cinema-outline flex-grow-1 py-2 btn-sm"
                        onClick={() => setSelectedTicket(booking)}
                      >
                        <i className="bi bi-qr-code me-1"></i> View E-Ticket
                      </Button>

                      {!isCancelled && (
                        <Button
                          variant="outline-danger"
                          className="btn-sm px-3"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="cinema-card text-center py-5 p-4">
            <i className="bi bi-ticket text-secondary display-3 d-block mb-3"></i>
            <h4 className="text-white fw-bold mb-2">No Bookings Yet</h4>
            <p className="text-secondary mb-3">
              You haven't booked any movie tickets yet. Explore today's blockbusters and grab your seats!
            </p>
            <Button as={Link} to="/" className="btn-cinema">
              Browse Movies Now
            </Button>
          </div>
        )}
      </Container>

      {/* Ticket QR Modal */}
      <BookingSuccessModal
        show={!!selectedTicket}
        onHide={() => setSelectedTicket(null)}
        booking={selectedTicket}
      />

      {/* Cancellation Confirmation Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
        contentClassName="modal-content border-danger"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white fw-bold">Cancel Ticket Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-secondary">
            Are you sure you want to cancel booking <strong className="text-white">{bookingToCancel?.bookingReference}</strong> for <strong className="text-white">{bookingToCancel?.movieId?.title}</strong>?
          </p>
          <p className="text-danger small mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Reserved seats will be immediately released back to the cinema pool and refunded.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowCancelModal(false)}>
            Keep Booking
          </Button>
          <Button variant="danger" disabled={cancelling} onClick={confirmCancelBooking}>
            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
