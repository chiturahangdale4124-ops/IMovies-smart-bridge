import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { movieService } from '../services/movieService';
import { theatreService } from '../services/theatreService';
import { showService } from '../services/showService';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Movie Modal state
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    description: '',
    poster: '',
    banner: '',
    genre: '',
    language: '',
    duration: 120,
    rating: 8.0,
    status: 'now_showing',
    certification: 'UA 16+',
    trailerUrl: '',
    featured: false,
  });

  // Theatre Modal state
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [theatreFormData, setTheatreFormData] = useState({
    name: '',
    location: '',
    city: 'Mumbai',
    facilities: 'Dolby Atmos, 4K Projection, Recliner Seats, Parking',
  });

  // Show Modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFormData, setShowFormData] = useState({
    movieId: '',
    theatreId: '',
    screen: 'Screen 1 - Dolby Atmos',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '06:30 PM',
    ticketPrice: 250,
  });

  // Seat Layout Viewer Modal state
  const [showSeatViewModal, setShowSeatViewModal] = useState(false);
  const [selectedShowSeats, setSelectedShowSeats] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      const [moviesRes, theatresRes, showsRes, bookingsRes, usersRes] = await Promise.all([
        movieService.getMovies(),
        theatreService.getTheatres(),
        showService.getShows(),
        bookingService.getAllBookings(),
        authService.getAllUsers(),
      ]);

      if (moviesRes.success) setMovies(moviesRes.movies);
      if (theatresRes.success) setTheatres(theatresRes.theatres);
      if (showsRes.success) setShows(showsRes.shows);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Could not load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- Movie Handlers ---
  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieFormData({
      title: '',
      description: '',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      genre: 'Action, Sci-Fi',
      language: 'English, Hindi',
      duration: 135,
      rating: 8.5,
      status: 'now_showing',
      certification: 'UA 16+',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      featured: false,
    });
    setShowMovieModal(true);
  };

  const handleOpenEditMovie = (m) => {
    setEditingMovieId(m._id);
    setMovieFormData({
      title: m.title,
      description: m.description,
      poster: m.poster,
      banner: m.banner || m.poster,
      genre: Array.isArray(m.genre) ? m.genre.join(', ') : m.genre,
      language: Array.isArray(m.language) ? m.language.join(', ') : m.language,
      duration: m.duration,
      rating: m.rating,
      status: m.status,
      certification: m.certification || 'UA 16+',
      trailerUrl: m.trailerUrl || '',
      featured: !!m.featured,
    });
    setShowMovieModal(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      if (editingMovieId) {
        const res = await movieService.updateMovie(editingMovieId, movieFormData);
        if (res.success) {
          notify(`Updated movie "${movieFormData.title}" successfully.`);
        }
      } else {
        const res = await movieService.createMovie(movieFormData);
        if (res.success) {
          notify(`Created new movie "${movieFormData.title}" successfully.`);
        }
      }
      setShowMovieModal(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save movie.');
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove scheduled shows.`)) {
      try {
        await movieService.deleteMovie(id);
        notify(`Deleted movie "${title}".`);
        fetchAllData();
      } catch (err) {
        alert('Failed to delete movie.');
      }
    }
  };

  // --- Theatre Handlers ---
  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    try {
      const parsedFacilities = theatreFormData.facilities
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await theatreService.createTheatre({
        ...theatreFormData,
        facilities: parsedFacilities,
      });

      if (res.success) {
        notify(`Created cinema theatre "${theatreFormData.name}".`);
        setShowTheatreModal(false);
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create theatre.');
    }
  };

  const handleDeleteTheatre = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await theatreService.deleteTheatre(id);
        notify(`Deleted theatre "${name}".`);
        fetchAllData();
      } catch (err) {
        alert('Failed to delete theatre.');
      }
    }
  };

  // --- Show Handlers ---
  const handleOpenScheduleModal = () => {
    if (movies.length === 0 || theatres.length === 0) {
      alert('Please ensure you have at least one movie and one theatre added before scheduling shows.');
      return;
    }
    setShowFormData({
      movieId: movies[0]._id,
      theatreId: theatres[0]._id,
      screen: theatres[0].screens?.[0]?.name || 'Screen 1 - Dolby Atmos',
      showDate: new Date().toISOString().split('T')[0],
      showTime: '06:30 PM',
      ticketPrice: 250,
    });
    setShowScheduleModal(true);
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    try {
      const res = await showService.createShow(showFormData);
      if (res.success) {
        notify('New showtime scheduled successfully with 64 generated cinema seats!');
        setShowScheduleModal(false);
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule show.');
    }
  };

  const handleDeleteShow = async (id) => {
    if (window.confirm('Are you sure you want to remove this showtime?')) {
      try {
        await showService.deleteShow(id);
        notify('Showtime deleted.');
        fetchAllData();
      } catch (err) {
        alert('Failed to delete show.');
      }
    }
  };

  const handleViewShowSeats = async (showId) => {
    try {
      const data = await showService.getShowSeats(showId);
      if (data.success) {
        setSelectedShowSeats(data);
        setShowSeatViewModal(true);
      }
    } catch (err) {
      alert('Failed to load show seat details.');
    }
  };

  // Calculations for overview stats
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.bookingStatus === 'confirmed' ? sum + b.totalAmount : sum),
    0
  );

  return (
    <div className="admin-dashboard-page py-4 pb-5">
      <Container>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-warning text-dark px-2 py-1 fw-bold">ADMIN PORTAL</span>
              <h2 className="text-white fw-bold brand-font mb-0">Management Dashboard</h2>
            </div>
            <p className="text-secondary small mb-0">
              Manage cinema movies, theatres, show schedules, live seat maps, and bookings
            </p>
          </div>
          <Button variant="outline-light" className="btn-cinema-outline btn-sm" onClick={fetchAllData}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
          </Button>
        </div>

        {successMsg && (
          <Alert variant="success" className="cinema-card border-success text-light mb-4 py-2">
            <i className="bi bi-check-circle-fill me-2 text-success"></i> {successMsg}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="cinema-card border-danger text-light mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i> {error}
          </Alert>
        )}

        {/* Quick Metrics Cards */}
        <Row className="g-3 mb-4">
          <Col xs={6} lg={3}>
            <div className="cinema-card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-secondary d-block">Total Movies</small>
                  <h3 className="text-white fw-bold mb-0">{movies.length}</h3>
                </div>
                <div className="p-3 rounded-3 bg-danger bg-opacity-25 text-danger">
                  <i className="bi bi-film fs-4"></i>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={6} lg={3}>
            <div className="cinema-card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-secondary d-block">Theatres</small>
                  <h3 className="text-white fw-bold mb-0">{theatres.length}</h3>
                </div>
                <div className="p-3 rounded-3 bg-info bg-opacity-25 text-info">
                  <i className="bi bi-building fs-4"></i>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={6} lg={3}>
            <div className="cinema-card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-secondary d-block">Scheduled Shows</small>
                  <h3 className="text-white fw-bold mb-0">{shows.length}</h3>
                </div>
                <div className="p-3 rounded-3 bg-warning bg-opacity-25 text-warning">
                  <i className="bi bi-calendar2-range fs-4"></i>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={6} lg={3}>
            <div className="cinema-card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-secondary d-block">Total Revenue</small>
                  <h3 className="text-success fw-bold mb-0">₹{totalRevenue}</h3>
                </div>
                <div className="p-3 rounded-3 bg-success bg-opacity-25 text-success">
                  <i className="bi bi-currency-rupee fs-4"></i>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tabbed Navigation */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="pills" className="cinema-card p-2 mb-4 d-flex gap-2 overflow-auto">
            <Nav.Item>
              <Nav.Link eventKey="overview" className="text-white fw-medium px-3 py-2">
                <i className="bi bi-grid-1x2-fill me-2 text-danger"></i> Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="movies" className="text-white fw-medium px-3 py-2">
                <i className="bi bi-film me-2 text-danger"></i> Movies ({movies.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="theatres" className="text-white fw-medium px-3 py-2">
                <i className="bi bi-building me-2 text-danger"></i> Theatres ({theatres.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="shows" className="text-white fw-medium px-3 py-2">
                <i className="bi bi-calendar-event me-2 text-danger"></i> Shows ({shows.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bookings" className="text-white fw-medium px-3 py-2">
                <i className="bi bi-ticket-perforated me-2 text-danger"></i> Bookings ({bookings.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="users" className="text-white fw-medium px-3 py-2">
                <i className="bi bi-people me-2 text-danger"></i> Users ({users.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* OVERVIEW TAB */}
            <Tab.Pane eventKey="overview">
              <Row className="gy-4">
                <Col lg={8}>
                  <div className="cinema-card p-4">
                    <h5 className="text-white fw-bold mb-3 border-bottom border-secondary pb-2">
                      Recent Bookings Across Platform
                    </h5>
                    {bookings.length > 0 ? (
                      <div className="table-responsive">
                        <Table hover variant="dark" className="align-middle mb-0">
                          <thead>
                            <tr className="text-secondary small">
                              <th>Ref</th>
                              <th>Movie</th>
                              <th>User</th>
                              <th>Seats</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 6).map((b) => (
                              <tr key={b._id}>
                                <td className="fw-bold text-danger font-monospace">{b.bookingReference}</td>
                                <td>{b.movieId?.title || 'Movie'}</td>
                                <td>{b.userId?.name || 'User'}</td>
                                <td><Badge bg="dark" className="border border-secondary">{b.selectedSeats?.join(', ')}</Badge></td>
                                <td className="text-success fw-bold">₹{b.totalAmount}</td>
                                <td>
                                  <Badge bg={b.bookingStatus === 'confirmed' ? 'success' : 'secondary'}>
                                    {b.bookingStatus}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-secondary mb-0">No bookings recorded yet.</p>
                    )}
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="cinema-card p-4">
                    <h5 className="text-white fw-bold mb-3 border-bottom border-secondary pb-2">
                      Quick Admin Actions
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      <Button className="btn-cinema text-start py-2" onClick={handleOpenAddMovie}>
                        <i className="bi bi-plus-circle me-2"></i> Add New Movie
                      </Button>
                      <Button variant="outline-light" className="btn-cinema-outline text-start py-2" onClick={() => setShowTheatreModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i> Add New Cinema Theatre
                      </Button>
                      <Button variant="outline-light" className="btn-cinema-outline text-start py-2" onClick={handleOpenScheduleModal}>
                        <i className="bi bi-calendar-plus me-2"></i> Schedule New Show
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>

            {/* MOVIES TAB */}
            <Tab.Pane eventKey="movies">
              <div className="cinema-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white fw-bold mb-0">All Movies</h5>
                  <Button className="btn-cinema btn-sm" onClick={handleOpenAddMovie}>
                    <i className="bi bi-plus-lg me-1"></i> Add Movie
                  </Button>
                </div>

                <div className="table-responsive">
                  <Table hover variant="dark" className="align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Duration</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map((m) => (
                        <tr key={m._id}>
                          <td>
                            <img
                              src={m.poster}
                              alt={m.title}
                              className="rounded-1 object-fit-cover"
                              style={{ width: 40, height: 55 }}
                            />
                          </td>
                          <td>
                            <strong className="text-white d-block">{m.title}</strong>
                            <small className="text-secondary">{m.certification || 'UA'}</small>
                          </td>
                          <td>
                            <small className="text-secondary">
                              {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                            </small>
                          </td>
                          <td>{m.duration}m</td>
                          <td>
                            <span className="text-warning fw-semibold">★ {m.rating}</span>
                          </td>
                          <td>
                            <Badge bg={m.status === 'now_showing' ? 'success' : 'warning'}>
                              {m.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleOpenEditMovie(m)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteMovie(m._id, m.title)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab.Pane>

            {/* THEATRES TAB */}
            <Tab.Pane eventKey="theatres">
              <div className="cinema-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white fw-bold mb-0">Cinema Theatres</h5>
                  <Button className="btn-cinema btn-sm" onClick={() => setShowTheatreModal(true)}>
                    <i className="bi bi-plus-lg me-1"></i> Add Theatre
                  </Button>
                </div>

                <div className="table-responsive">
                  <Table hover variant="dark" className="align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Theatre Name</th>
                        <th>Location</th>
                        <th>City</th>
                        <th>Screens</th>
                        <th>Facilities</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theatres.map((t) => (
                        <tr key={t._id}>
                          <td className="text-white fw-bold">{t.name}</td>
                          <td><small className="text-secondary">{t.location}</small></td>
                          <td>{t.city}</td>
                          <td>
                            <Badge bg="dark" className="border border-secondary">
                              {t.screens?.length || 1} Screen(s)
                            </Badge>
                          </td>
                          <td>
                            <small className="text-secondary">
                              {t.facilities?.slice(0, 3).join(', ')}
                            </small>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteTheatre(t._id, t.name)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab.Pane>

            {/* SHOWS TAB */}
            <Tab.Pane eventKey="shows">
              <div className="cinema-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white fw-bold mb-0">Scheduled Showtimes</h5>
                  <Button className="btn-cinema btn-sm" onClick={handleOpenScheduleModal}>
                    <i className="bi bi-calendar-plus me-1"></i> Schedule Show
                  </Button>
                </div>

                <div className="table-responsive">
                  <Table hover variant="dark" className="align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Movie</th>
                        <th>Theatre</th>
                        <th>Screen</th>
                        <th>Date & Time</th>
                        <th>Ticket Price</th>
                        <th>Seat Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shows.slice(0, 30).map((s) => {
                        const total = s.seats?.length || 64;
                        const booked = s.seats?.filter((seat) => seat.isBooked).length || 0;
                        const available = total - booked;

                        return (
                          <tr key={s._id}>
                            <td className="text-white fw-bold">{s.movieId?.title || 'Movie'}</td>
                            <td><small className="text-secondary">{s.theatreId?.name || 'Theatre'}</small></td>
                            <td><Badge bg="dark" className="border border-secondary">{s.screen}</Badge></td>
                            <td>
                              <span className="text-white fw-medium">{s.showDate}</span>
                              <small className="text-info d-block">{s.showTime}</small>
                            </td>
                            <td className="text-success fw-bold">₹{s.ticketPrice}</td>
                            <td>
                              <span className="small text-secondary">{available} / {total} left</span>
                              <Button
                                variant="outline-light"
                                size="sm"
                                className="btn-cinema-outline py-0 px-2 ms-2"
                                style={{ fontSize: '0.72rem' }}
                                onClick={() => handleViewShowSeats(s._id)}
                              >
                                View Grid
                              </Button>
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteShow(s._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab.Pane>

            {/* BOOKINGS TAB */}
            <Tab.Pane eventKey="bookings">
              <div className="cinema-card p-4">
                <h5 className="text-white fw-bold mb-4">All Customer Bookings ({bookings.length})</h5>
                <div className="table-responsive">
                  <Table hover variant="dark" className="align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Ref Code</th>
                        <th>Customer</th>
                        <th>Movie & Cinema</th>
                        <th>Showtime</th>
                        <th>Seats</th>
                        <th>Total Paid</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id}>
                          <td className="fw-bold text-danger font-monospace">{b.bookingReference}</td>
                          <td>
                            <strong className="text-white d-block">{b.userId?.name || 'User'}</strong>
                            <small className="text-secondary">{b.userId?.email}</small>
                          </td>
                          <td>
                            <span className="text-white fw-medium d-block">{b.movieId?.title}</span>
                            <small className="text-secondary">{b.theatreId?.name}</small>
                          </td>
                          <td>
                            <small className="text-white">{b.showId?.showDate}</small>
                            <small className="text-secondary d-block">{b.showId?.showTime}</small>
                          </td>
                          <td>
                            <Badge bg="dark" className="border border-secondary text-danger">
                              {b.selectedSeats?.join(', ')}
                            </Badge>
                          </td>
                          <td className="text-success fw-bold">₹{b.totalAmount}</td>
                          <td>
                            <Badge bg={b.bookingStatus === 'confirmed' ? 'success' : 'secondary'}>
                              {b.bookingStatus}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-secondary">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab.Pane>

            {/* USERS TAB */}
            <Tab.Pane eventKey="users">
              <div className="cinema-card p-4">
                <h5 className="text-white fw-bold mb-4">Registered Accounts ({users.length})</h5>
                <div className="table-responsive">
                  <Table hover variant="dark" className="align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="text-white fw-bold">{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <Badge bg={u.role === 'admin' ? 'warning' : 'primary'} className="text-uppercase">
                              {u.role}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-secondary">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>

      {/* ADD / EDIT MOVIE MODAL */}
      <Modal
        show={showMovieModal}
        onHide={() => setShowMovieModal(false)}
        size="lg"
        centered
        contentClassName="modal-content"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white fw-bold">
            {editingMovieId ? 'Edit Movie Details' : 'Add New Movie to Catalogue'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveMovie}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Movie Title *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={movieFormData.title}
                    onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Certification</Form.Label>
                  <Form.Select
                    value={movieFormData.certification}
                    onChange={(e) => setMovieFormData({ ...movieFormData, certification: e.target.value })}
                  >
                    <option value="U">U (Universal)</option>
                    <option value="UA">UA</option>
                    <option value="UA 13+">UA 13+</option>
                    <option value="UA 16+">UA 16+</option>
                    <option value="A">A (Adults Only)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Description / Synopsis *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    value={movieFormData.description}
                    onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Poster Image URL *</Form.Label>
                  <Form.Control
                    type="url"
                    required
                    value={movieFormData.poster}
                    onChange={(e) => setMovieFormData({ ...movieFormData, poster: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Banner Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={movieFormData.banner}
                    onChange={(e) => setMovieFormData({ ...movieFormData, banner: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Genres (comma-separated) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Action, Sci-Fi, Drama"
                    required
                    value={movieFormData.genre}
                    onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Languages (comma-separated) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="English, Hindi, Telugu"
                    required
                    value={movieFormData.language}
                    onChange={(e) => setMovieFormData({ ...movieFormData, language: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Duration (minutes) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="30"
                    required
                    value={movieFormData.duration}
                    onChange={(e) => setMovieFormData({ ...movieFormData, duration: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-secondary">IMDb / User Rating (0 - 10)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={movieFormData.rating}
                    onChange={(e) => setMovieFormData({ ...movieFormData, rating: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Release Status</Form.Label>
                  <Form.Select
                    value={movieFormData.status}
                    onChange={(e) => setMovieFormData({ ...movieFormData, status: e.target.value })}
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ended">Ended</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small text-secondary">YouTube Trailer URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={movieFormData.trailerUrl}
                    onChange={(e) => setMovieFormData({ ...movieFormData, trailerUrl: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4} className="d-flex align-items-center pt-4">
                <Form.Check
                  type="checkbox"
                  id="featured-check"
                  label="Featured Premiere on Hero"
                  checked={movieFormData.featured}
                  onChange={(e) => setMovieFormData({ ...movieFormData, featured: e.target.checked })}
                  className="text-white"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowMovieModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-cinema">
              {editingMovieId ? 'Update Movie' : 'Save Movie'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ADD THEATRE MODAL */}
      <Modal
        show={showTheatreModal}
        onHide={() => setShowTheatreModal(false)}
        centered
        contentClassName="modal-content"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white fw-bold">Add Cinema Theatre</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveTheatre}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Theatre Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. PVR INOX: Phoenix Palladium"
                required
                value={theatreFormData.name}
                onChange={(e) => setTheatreFormData({ ...theatreFormData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Address / Location *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lower Parel, Mumbai"
                required
                value={theatreFormData.location}
                onChange={(e) => setTheatreFormData({ ...theatreFormData, location: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">City</Form.Label>
              <Form.Control
                type="text"
                value={theatreFormData.city}
                onChange={(e) => setTheatreFormData({ ...theatreFormData, city: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Facilities (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={theatreFormData.facilities}
                onChange={(e) => setTheatreFormData({ ...theatreFormData, facilities: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowTheatreModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-cinema">
              Create Theatre
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* SCHEDULE SHOW MODAL */}
      <Modal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        centered
        contentClassName="modal-content"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white fw-bold">Schedule Movie Showtime</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveShow}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Select Movie *</Form.Label>
              <Form.Select
                value={showFormData.movieId}
                onChange={(e) => setShowFormData({ ...showFormData, movieId: e.target.value })}
                required
              >
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title} ({m.certification || 'UA'})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Select Theatre *</Form.Label>
              <Form.Select
                value={showFormData.theatreId}
                onChange={(e) => setShowFormData({ ...showFormData, theatreId: e.target.value })}
                required
              >
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Screen Name / Experience</Form.Label>
              <Form.Control
                type="text"
                value={showFormData.screen}
                onChange={(e) => setShowFormData({ ...showFormData, screen: e.target.value })}
              />
            </Form.Group>

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Show Date *</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={showFormData.showDate}
                    onChange={(e) => setShowFormData({ ...showFormData, showDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="small text-secondary">Show Time *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 06:30 PM"
                    required
                    value={showFormData.showTime}
                    onChange={(e) => setShowFormData({ ...showFormData, showTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label className="small text-secondary">Base Ticket Price (₹) *</Form.Label>
              <Form.Control
                type="number"
                min="100"
                step="10"
                required
                value={showFormData.ticketPrice}
                onChange={(e) => setShowFormData({ ...showFormData, ticketPrice: e.target.value })}
              />
              <small className="text-secondary d-block mt-1">
                A standard 64-seat layout (VIP, Gold, Silver) will be automatically generated.
              </small>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-cinema">
              Generate & Schedule Show
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* SEAT AVAILABILITY INSPECTOR MODAL */}
      <Modal
        show={showSeatViewModal}
        onHide={() => setShowSeatViewModal(false)}
        size="lg"
        centered
        contentClassName="modal-content"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white fw-bold">
            Seat Layout Inspector: {selectedShowSeats?.movie?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          {selectedShowSeats && (
            <div>
              <div className="d-flex justify-content-center gap-4 mb-3 text-secondary small">
                <span>Cinema: <strong className="text-white">{selectedShowSeats.theatre?.name}</strong></span>
                <span>Date: <strong className="text-white">{selectedShowSeats.showDate}</strong></span>
                <span>Time: <strong className="text-white">{selectedShowSeats.showTime}</strong></span>
                <span>Booked: <strong className="text-danger">{selectedShowSeats.bookedSeatsCount} / {selectedShowSeats.totalSeats}</strong></span>
              </div>

              <div className="seat-matrix py-3 bg-dark rounded-3 border border-secondary">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((row) => {
                  const rSeats = selectedShowSeats.seats?.filter((s) => s.row === row) || [];
                  return (
                    <div key={row} className="seat-row my-1">
                      <span className="row-label">{row}</span>
                      <div className="d-flex gap-1">
                        {rSeats.map((s) => (
                          <span
                            key={s.seatNumber}
                            className={`seat-btn ${s.isBooked ? 'booked' : 'available-gold'}`}
                            title={`${s.seatNumber}: ${s.isBooked ? 'Booked' : 'Available'}`}
                          >
                            {s.column}
                          </span>
                        ))}
                      </div>
                      <span className="row-label">{row}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowSeatViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
