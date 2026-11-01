import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

export const MovieCard = ({ movie }) => {
  const isUpcoming = movie.status === 'upcoming';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_POSTER;
  };

  return (
    <Card className="movie-card h-100 text-white">
      <div className="poster-wrapper">
        <img
          src={movie.poster || FALLBACK_POSTER}
          alt={movie.title}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="rating-badge">
          <i className="bi bi-star-fill text-warning"></i>
          <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
        </div>

        {/* Certification */}
        {movie.certification && (
          <div className="cert-badge">
            {movie.certification}
          </div>
        )}

        {/* Status Tag for Upcoming */}
        {isUpcoming && (
          <div className="position-absolute bottom-0 start-0 end-0 p-2 text-center" style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
          }}>
            <span className="badge bg-warning text-dark fw-bold text-uppercase px-2 py-1">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <h5 className="card-title text-truncate fw-bold mb-1" title={movie.title}>
          {movie.title}
        </h5>

        <div className="text-secondary small mb-2 d-flex align-items-center gap-2">
          <span>{movie.language?.join(', ') || 'English'}</span>
          <span>•</span>
          <span>{movie.duration}m</span>
        </div>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {movie.genre?.slice(0, 2).map((g, idx) => (
            <span key={idx} className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.72rem' }}>
              {g}
            </span>
          ))}
          {movie.genre?.length > 2 && (
            <span className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.72rem' }}>
              +{movie.genre.length - 2}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <Button
            as={Link}
            to={`/movie/${movie._id}`}
            className={isUpcoming ? 'btn-cinema-outline w-100 py-2' : 'btn-cinema w-100 py-2'}
          >
            {isUpcoming ? 'View Details' : 'Book Tickets'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
