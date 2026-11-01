import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Crime', 'Comedy', 'Animation'];

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const statusParam = searchParams.get('status') || 'now_showing';

  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTab, setActiveTab] = useState(statusParam); // 'now_showing' or 'upcoming'

  useEffect(() => {
    setActiveTab(statusParam);
  }, [statusParam]);

  useEffect(() => {
    fetchMovies();
  }, [search, activeTab, selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};

      if (search) params.search = search;
      if (activeTab && activeTab !== 'all') params.status = activeTab;
      if (selectedGenre && selectedGenre !== 'All') params.genre = selectedGenre;

      const data = await movieService.getMovies(params);
      if (data.success) {
        setMovies(data.movies);

        // If featured movies haven't been populated yet, fetch or extract them
        if (featuredMovies.length === 0) {
          const featured = data.movies.filter((m) => m.featured || m.rating >= 8.5);
          setFeaturedMovies(featured.length > 0 ? featured.slice(0, 4) : data.movies.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
      setError('Unable to load movies at this time. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('status', tab);
      return next;
    });
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="home-page pb-5">
      {/* Featured Blockbuster Hero Section (shown when no search filter active) */}
      {!search && featuredMovies.length > 0 && (
        <Container className="pt-4">
          <HeroBanner featuredMovies={featuredMovies} />
        </Container>
      )}

      <Container className={search ? 'pt-4' : ''}>
        {/* Navigation & Filter Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          {/* Status Tabs: Now Showing vs Upcoming */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant={activeTab === 'now_showing' ? 'danger' : 'dark'}
              className={activeTab === 'now_showing' ? 'btn-cinema px-4 py-2' : 'btn-cinema-outline px-4 py-2'}
              onClick={() => handleTabChange('now_showing')}
            >
              <i className="bi bi-play-circle-fill me-2"></i> Now Showing
            </Button>
            <Button
              variant={activeTab === 'upcoming' ? 'danger' : 'dark'}
              className={activeTab === 'upcoming' ? 'btn-cinema px-4 py-2' : 'btn-cinema-outline px-4 py-2'}
              onClick={() => handleTabChange('upcoming')}
            >
              <i className="bi bi-calendar-event me-2"></i> Upcoming
            </Button>
          </div>

          {/* Search Indicator */}
          {search && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small">
                Showing results for: <strong className="text-white">"{search}"</strong>
              </span>
              <Button variant="outline-secondary" size="sm" onClick={clearSearch}>
                <i className="bi bi-x-circle me-1"></i> Clear
              </Button>
            </div>
          )}
        </div>

        {/* Genre Filter Ribbon */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4" style={{ whiteSpace: 'nowrap' }}>
          {GENRES.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? 'danger' : 'dark'}
              size="sm"
              className={selectedGenre === genre ? 'btn-cinema px-3 py-1 rounded-pill' : 'btn-cinema-outline px-3 py-1 rounded-pill'}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="cinema-card border-danger text-light">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </Alert>
        )}

        {/* Movies Grid */}
        {loading ? (
          <div className="text-center py-5 my-5">
            <Spinner animation="border" variant="danger" />
            <p className="text-secondary mt-3">Loading cinematic blockbusters...</p>
          </div>
        ) : movies.length > 0 ? (
          <Row className="g-4">
            {movies.map((movie) => (
              <Col key={movie._id} xs={6} md={4} lg={3} className="animate-fade-in">
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="cinema-card text-center py-5 my-4 p-4">
            <i className="bi bi-camera-reels text-secondary display-3 d-block mb-3"></i>
            <h4 className="text-white fw-bold mb-2">No Movies Found</h4>
            <p className="text-secondary mb-3">
              We couldn't find any movies matching your current filters or search query.
            </p>
            <Button className="btn-cinema" onClick={() => { setSelectedGenre('All'); clearSearch(); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};
