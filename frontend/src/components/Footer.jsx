import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto pt-5 pb-4 border-top" style={{
      backgroundColor: '#05080e',
      borderColor: 'rgba(255, 255, 255, 0.08)',
    }}>
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 brand-font fs-3 text-white mb-3">
              <span className="p-2 rounded-3 bg-danger d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <i className="bi bi-film fs-6 text-white"></i>
              </span>
              <span>I<span className="text-danger">MOVIES</span></span>
            </div>
            <p className="text-secondary small leading-relaxed pe-lg-4">
              IMovies makes movie ticket booking effortless. Browse blockbusters, pick the best cinema seats in real-time, and reserve tickets with zero hassle.
            </p>
            <div className="d-flex gap-2 mt-3">
              <span className="badge bg-dark border border-secondary text-light">MERN Stack</span>
              <span className="badge bg-dark border border-secondary text-light">Bootstrap 5</span>
              <span className="badge bg-dark border border-secondary text-light">JWT Auth</span>
            </div>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider">Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Now Showing</Link></li>
              <li><Link to="/?status=upcoming" className="text-secondary text-decoration-none hover-white">Upcoming Releases</Link></li>
              <li><Link to="/my-bookings" className="text-secondary text-decoration-none hover-white">My Bookings</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={3} sm={6}>
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider">Theatres</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><i className="bi bi-geo-alt me-2 text-danger"></i> PVR INOX Palladium</li>
              <li><i className="bi bi-geo-alt me-2 text-danger"></i> Cinepolis Viviana Mall</li>
              <li><i className="bi bi-geo-alt me-2 text-danger"></i> INOX Megaplex Inorbit</li>
            </ul>
          </Col>

          <Col lg={3} md={12}>
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider">Features</h6>
            <div className="d-flex flex-column gap-2 small text-secondary">
              <div><i className="bi bi-shield-check text-success me-2"></i> Atomic Concurrency Booking</div>
              <div><i className="bi bi-display text-info me-2"></i> Interactive Seat Grid Layout</div>
              <div><i className="bi bi-qr-code text-warning me-2"></i> Digital Printable E-Ticket</div>
              <div><i className="bi bi-person-badge text-danger me-2"></i> Admin CRUD & Stats Hub</div>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <p className="mb-0">
            © {new Date().getFullYear()} <span className="text-white fw-semibold">IMovies</span>. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <Link to="/admin" className="text-secondary text-decoration-none">Admin Portal</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
