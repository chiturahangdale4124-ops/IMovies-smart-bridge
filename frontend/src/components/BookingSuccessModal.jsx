import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const BookingSuccessModal = ({ show, onHide, booking }) => {
  const navigate = useNavigate();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToBookings = () => {
    onHide();
    navigate('/my-bookings');
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="modal-content border-danger"
    >
      <Modal.Header className="border-0 pb-0 text-center flex-column">
        <div
          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg"
          style={{ width: 64, height: 64 }}
        >
          <i className="bi bi-check-lg fs-1"></i>
        </div>
        <Modal.Title className="fs-4 text-white fw-bold">
          Booking Confirmed!
        </Modal.Title>
        <p className="text-secondary small mb-0">
          Your tickets are reserved and ready. Enjoy the show!
        </p>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Ticket Card */}
        <div className="cinema-card p-3 border-secondary mb-3">
          <div className="d-flex align-items-center justify-content-between pb-3 border-bottom border-secondary mb-3">
            <div>
              <span className="text-secondary small d-block">Booking Reference</span>
              <span className="fs-5 fw-bold text-danger brand-font tracking-wide">
                {booking.bookingReference}
              </span>
            </div>
            <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
              CONFIRMED
            </span>
          </div>

          <div className="d-flex gap-3 mb-3">
            {booking.movieId?.poster && (
              <img
                src={booking.movieId.poster}
                alt={booking.movieId.title}
                className="rounded-2 object-fit-cover"
                style={{ width: 65, height: 95 }}
              />
            )}
            <div>
              <h5 className="text-white fw-bold mb-1">
                {booking.movieId?.title || 'Movie'}
              </h5>
              <p className="text-secondary small mb-1">
                <i className="bi bi-geo-alt text-danger me-1"></i>
                {booking.theatreId?.name || 'Cinema Theatre'}
              </p>
              <p className="text-info small mb-0">
                <i className="bi bi-display me-1"></i>
                {booking.showId?.screen || 'Screen 1'}
              </p>
            </div>
          </div>

          <div className="row g-2 text-center py-2 bg-dark rounded-2 mb-3">
            <div className="col-4 border-end border-secondary">
              <small className="text-secondary d-block">Date</small>
              <span className="text-white fw-semibold small">{booking.showId?.showDate}</span>
            </div>
            <div className="col-4 border-end border-secondary">
              <small className="text-secondary d-block">Time</small>
              <span className="text-white fw-semibold small">{booking.showId?.showTime}</span>
            </div>
            <div className="col-4">
              <small className="text-secondary d-block">Seats ({booking.selectedSeats?.length})</small>
              <span className="text-danger fw-bold small">{booking.selectedSeats?.join(', ')}</span>
            </div>
          </div>

          {/* QR Code / Barcode Simulation */}
          <div className="p-3 bg-white text-dark rounded-3 text-center my-2">
            <div className="font-monospace fw-bold fs-6 mb-1">
              ||| | |||| | ||| || |||| ||| || | ||
            </div>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              Scan at cinema turnstile: {booking.bookingReference}
            </small>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
            <span className="text-secondary">Total Paid:</span>
            <span className="fs-5 fw-bold text-white">₹{booking.totalAmount}</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 d-flex gap-2">
        <Button variant="outline-secondary" className="btn-cinema-outline flex-grow-1" onClick={handlePrint}>
          <i className="bi bi-printer me-1"></i> Print Ticket
        </Button>
        <Button className="btn-cinema flex-grow-1" onClick={handleGoToBookings}>
          <i className="bi bi-ticket-perforated me-1"></i> My Bookings
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
