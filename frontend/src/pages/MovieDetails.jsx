import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import { TrailerModal } from '../components/TrailerModal';

const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  // Generate next 5 calendar dates
  const calendarDates = Array.from({ length: 5 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      dateString: formatDate(d),
      dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const [selectedDate, setSelectedDate] = useState(calendarDates[0].dateString);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchShows(selectedDate);
    }
  }, [movie, selectedDate]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await movieService.getMovieById(id);
      if (data.success) {
        setMovie(data.movie);
      }
    } catch (err) {
      console.error('Failed to load movie details:', err);
      setError('Could not load movie information.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async (date) => {
    try {
      setShowsLoading(true);
      const data = await showService.getShows({ movieId: id, showDate: date });
      if (data.success) {
        setShows(data.shows);
      }
    } catch (err) {
      console.error('Failed to load shows:', err);
    } finally {
      setShowsLoading(false);
    }
  };

  // Group shows by Theatre
  const showsByTheatre = shows.reduce((acc, show) => {
    const theatreId = show.theatreId?._id || 'unknown';
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatreId,
        shows: [],
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="danger" />
        <p className="text-secondary mt-3">Loading movie information...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="cinema-card border-danger text-light py-4">
          <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2 text-danger"></i>
          <h4>Movie Not Found</h4>
          <p className="text-secondary mb-3">{error || 'The requested movie does not exist.'}</p>
          <Button as={Link} to="/" className="btn-cinema">
            Back to Movies
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="movie-details-page pb-5">
      {/* Backdrop Header */}
      <div
        className="position-relative py-5"
        style={{
          backgroundImage: `url(${movie.banner || movie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="position-absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.98) 100%)',
          }}
        ></div>

        <Container className="position-relative z-2">
          <Link to="/" className="btn-cinema-outline btn-sm mb-4 d-inline-flex align-items-center gap-1 text-decoration-none">
            <i className="bi bi-arrow-left"></i> Back to Movies
          </Link>

          <Row className="gy-4 align-items-center">
            {/* Poster */}
            <Col md={4} lg={3} className="text-center text-md-start">
              <div className="rounded-3 overflow-hidden shadow-lg border border-secondary d-inline-block">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="img-fluid"
                  style={{ maxHeight: 380, objectFit: 'cover' }}
                />
              </div>
            </Col>

            {/* Details */}
            <Col md={8} lg={9}>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-2 py-1">
                  {movie.status === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
                </span>
                <span className="badge bg-dark border border-secondary text-light">
                  {movie.certification || 'UA 16+'}
                </span>
                <span className="text-warning fw-bold small">
                  ★ {movie.rating?.toFixed(1) || '8.5'}/10 ({movie.votes || 1200}+ votes)
                </span>
              </div>

              <h1 className="display-5 fw-bold text-white mb-2 brand-font">
                {movie.title}
              </h1>

              <div className="text-secondary small mb-3 d-flex flex-wrap align-items-center gap-2">
                <span><i className="bi bi-clock me-1"></i> {movie.duration} mins</span>
                <span>•</span>
                <span><i className="bi bi-translate me-1"></i> {movie.language?.join(', ')}</span>
                <span>•</span>
                <span><i className="bi bi-calendar3 me-1"></i> {new Date(movie.releaseDate).toLocaleDateString()}</span>
              </div>

              {/* Genre chips */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre?.map((g, idx) => (
                  <span key={idx} className="badge-genre">
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-light opacity-75 mb-4 leading-relaxed" style={{ maxWidth: 750 }}>
                {movie.description}
              </p>

              {/* Action buttons */}
              <div className="d-flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <Button
                    variant="outline-light"
                    className="btn-cinema-outline d-flex align-items-center gap-2"
                    onClick={() => setShowTrailer(true)}
                  >
                    <i className="bi bi-play-circle-fill text-danger fs-5"></i>
                    <span>Watch Trailer</span>
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Showtimes & Booking Section */}
      <Container className="pt-5">
        <h3 className="text-white fw-bold brand-font mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-calendar2-week text-danger"></i> Select Date & Cinemas
        </h3>

        {/* Date Selector Ribbon */}
        <div className="d-flex gap-3 overflow-auto pb-3 mb-5">
          {calendarDates.map((item) => (
            <div
              key={item.dateString}
              className={`date-pill ${selectedDate === item.dateString ? 'active' : ''}`}
              onClick={() => setSelectedDate(item.dateString)}
            >
              <div className="small fw-semibold">{item.dayName}</div>
              <div className="fs-4 fw-bold">{item.dayNumber}</div>
              <div className="text-uppercase" style={{ fontSize: '0.7rem' }}>{item.monthName}</div>
            </div>
          ))}
        </div>

        {/* Available Theatres and Showtimes */}
        {showsLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" size="sm" />
            <p className="text-secondary small mt-2">Checking available cinema showtimes...</p>
          </div>
        ) : Object.keys(showsByTheatre).length > 0 ? (
          <div className="d-flex flex-column gap-4">
            {Object.values(showsByTheatre).map(({ theatre, shows: tShows }) => (
              <div key={theatre?._id || Math.random()} className="cinema-card p-4">
                <Row className="align-items-md-center gy-3">
                  <Col lg={4} md={5}>
                    <h5 className="text-white fw-bold mb-1">
                      <i className="bi bi-building me-2 text-danger"></i>
                      {theatre?.name || 'Multiplex Cinema'}
                    </h5>
                    <p className="text-secondary small mb-2">
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      {theatre?.location || 'City Center'}
                    </p>
                    <div className="d-flex flex-wrap gap-1">
                      {theatre?.facilities?.map((f, idx) => (
                        <span key={idx} className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.68rem' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </Col>

                  <Col lg={8} md={7}>
                    <div className="d-flex flex-wrap gap-3">
                      {tShows.map((show) => (
                        <div
                          key={show._id}
                          className="showtime-pill"
                          onClick={() => navigate(`/book/${show._id}`)}
                          role="button"
                          tabIndex={0}
                        >
                          <span className="fs-6 fw-bold">{show.showTime}</span>
                          <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
                            {show.screen}
                          </span>
                          <span className="text-success fw-semibold mt-1" style={{ fontSize: '0.75rem' }}>
                            ₹{show.ticketPrice}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        ) : (
          <div className="cinema-card text-center py-5 p-4">
            <i className="bi bi-calendar-x text-secondary fs-1 d-block mb-3"></i>
            <h5 className="text-white fw-bold mb-2">No Showtimes Available for this Date</h5>
            <p className="text-secondary small mb-0">
              Please choose a different date from the calendar ribbon above to explore available cinema slots.
            </p>
          </div>
        )}
      </Container>

      {/* Trailer Modal */}
      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};
