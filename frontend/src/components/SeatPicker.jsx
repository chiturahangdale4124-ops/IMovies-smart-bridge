import React from 'react';
import { Card, Badge, Alert } from 'react-bootstrap';

export const SeatPicker = ({
  seats = [],
  selectedSeats = [],
  onToggleSeat,
  maxSeats = 8,
}) => {
  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsByRow = rows.reduce((acc, row) => {
    acc[row] = seats.filter((s) => s.row === row).sort((a, b) => a.column - b.column);
    return acc;
  }, {});

  const getSeatClass = (seat) => {
    if (seat.isBooked) return 'seat-btn booked';
    if (selectedSeats.includes(seat.seatNumber)) return 'seat-btn selected';

    switch (seat.category) {
      case 'VIP':
        return 'seat-btn available-vip';
      case 'Silver':
        return 'seat-btn available-silver';
      case 'Gold':
      default:
        return 'seat-btn available-gold';
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (!selectedSeats.includes(seat.seatNumber) && selectedSeats.length >= maxSeats) {
      alert(`You can select a maximum of ${maxSeats} seats per booking.`);
      return;
    }

    onToggleSeat(seat.seatNumber);
  };

  return (
    <div className="seat-picker-container py-3">
      {/* Cinema Screen Indicator */}
      <div className="cinema-screen-container">
        <div className="cinema-screen">
          <i className="bi bi-display me-2"></i> SCREEN THIS WAY
        </div>
        <small className="text-secondary opacity-75">All eyes towards the front</small>
      </div>

      {/* Legend */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 gap-md-4 mb-4 py-3 px-3 rounded-3 cinema-card">
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn available-silver" style={{ width: 22, height: 22 }}></span>
          <span className="small text-secondary">Silver</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn available-gold" style={{ width: 22, height: 22 }}></span>
          <span className="small text-secondary">Gold</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn available-vip" style={{ width: 22, height: 22 }}></span>
          <span className="small text-secondary">VIP Recliner</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn selected" style={{ width: 22, height: 22 }}></span>
          <span className="small text-white fw-bold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn booked" style={{ width: 22, height: 22 }}></span>
          <span className="small text-secondary">Sold Out</span>
        </div>
      </div>

      {/* Seats Layout Matrix */}
      <div className="seat-matrix overflow-auto py-2">
        {rows.map((rowLetter) => {
          const rowSeats = seatsByRow[rowLetter] || [];
          const category = rowSeats[0]?.category || 'Standard';
          const price = rowSeats[0]?.price || 250;

          // Render category separator header
          const isCategoryHeader =
            rowLetter === 'A' || rowLetter === 'C' || rowLetter === 'G';

          return (
            <React.Fragment key={rowLetter}>
              {isCategoryHeader && (
                <div className="w-100 text-center my-2">
                  <span className="badge bg-dark border border-secondary text-secondary px-3 py-1 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                    {category} — ₹{price}
                  </span>
                </div>
              )}

              <div className="seat-row">
                <span className="row-label">{rowLetter}</span>

                <div className="d-flex gap-2">
                  {rowSeats.slice(0, 4).map((seat) => (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      className={getSeatClass(seat)}
                      disabled={seat.isBooked}
                      onClick={() => handleSeatClick(seat)}
                      title={`${seat.seatNumber} (${seat.category} - ₹${seat.price}) ${seat.isBooked ? '- Sold Out' : ''}`}
                    >
                      {seat.column}
                    </button>
                  ))}
                </div>

                {/* Aisle space */}
                <div style={{ width: 24 }}></div>

                <div className="d-flex gap-2">
                  {rowSeats.slice(4, 8).map((seat) => (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      className={getSeatClass(seat)}
                      disabled={seat.isBooked}
                      onClick={() => handleSeatClick(seat)}
                      title={`${seat.seatNumber} (${seat.category} - ₹${seat.price}) ${seat.isBooked ? '- Sold Out' : ''}`}
                    >
                      {seat.column}
                    </button>
                  ))}
                </div>

                <span className="row-label">{rowLetter}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
