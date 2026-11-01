import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TrailerModal } from './TrailerModal';

export const HeroBanner = ({ featuredMovies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  return (
    <div className="position-relative mb-5">
      <div
        className="hero-backdrop shadow-lg"
        style={{
          backgroundImage: `url(${currentMovie.banner || currentMovie.poster})`,
        }}
      >
        <div className="hero-overlay"></div>

        <Container className="position-relative py-5 z-2">
          <Row className="align-items-center">
            <Col lg={7} md={9}>
              {/* Badges */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge bg-danger text-uppercase px-3 py-2 fw-bold tracking-wide">
                  <i className="bi bi-star-fill me-1"></i> Featured Premiere
                </span>
                <span className="badge bg-dark border border-secondary text-light px-3 py-2">
                  {currentMovie.certification || 'UA 16+'}
                </span>
                <span className="badge bg-dark border border-secondary text-warning px-3 py-2 fw-semibold">
                  ★ {currentMovie.rating?.toFixed(1) || '8.5'}/10
                </span>
                <span className="text-secondary small">
                  <i className="bi bi-clock me-1"></i> {currentMovie.duration} mins
                </span>
              </div>

              {/* Title */}
              <h1 className="display-4 fw-black text-white mb-3 brand-font">
                {currentMovie.title}
              </h1>

              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {currentMovie.genre?.map((g, idx) => (
                  <span key={idx} className="badge-genre">
                    {g}
                  </span>
                ))}
                {currentMovie.language?.map((lang, idx) => (
                  <span key={`lang-${idx}`} className="badge bg-dark text-info border border-secondary">
                    {lang}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-light opacity-75 mb-4 pe-lg-5 fs-6 leading-relaxed line-clamp-3" style={{ maxWidth: 650 }}>
                {currentMovie.description}
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <Button
                  as={Link}
                  to={`/movie/${currentMovie._id}`}
                  className="btn-cinema px-4 py-3 fs-6 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-ticket-perforated-fill fs-5"></i>
                  <span>Book Tickets</span>
                </Button>

                {currentMovie.trailerUrl && (
                  <Button
                    variant="outline-light"
                    className="btn-cinema-outline px-4 py-3 fs-6 d-flex align-items-center gap-2"
                    onClick={() => setShowTrailer(true)}
                  >
                    <i className="bi bi-play-circle-fill fs-5 text-danger"></i>
                    <span>Watch Trailer</span>
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>

        {/* Carousel controls if multiple featured movies */}
        {featuredMovies.length > 1 && (
          <div className="position-absolute bottom-0 end-0 m-4 d-flex align-items-center gap-2 z-3">
            <Button
              variant="dark"
              size="sm"
              onClick={handlePrev}
              className="rounded-circle border-secondary text-white"
              style={{ width: 40, height: 40 }}
            >
              <i className="bi bi-chevron-left"></i>
            </Button>
            <span className="text-secondary small px-2">
              {currentIndex + 1} / {featuredMovies.length}
            </span>
            <Button
              variant="dark"
              size="sm"
              onClick={handleNext}
              className="rounded-circle border-secondary text-white"
              style={{ width: 40, height: 40 }}
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={currentMovie.trailerUrl}
        movieTitle={currentMovie.title}
      />
    </div>
  );
};
