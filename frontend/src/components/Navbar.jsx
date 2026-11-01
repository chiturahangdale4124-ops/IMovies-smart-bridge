import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Button, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

export const AppNavbar = () => {
  const { user, isAdmin, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleQuickDemoLogin = async (role) => {
    try {
      if (role === 'admin') {
        await login('admin@imovies.com', 'Admin@123');
        navigate('/admin');
      } else {
        await login('user@imovies.com', 'User@123');
        navigate('/my-bookings');
      }
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" sticky="top" className="py-3 cinema-navbar" style={{
      backgroundColor: 'rgba(8, 12, 20, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 1020,
    }}>
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 brand-font fs-3 text-white text-decoration-none">
          <span className="p-2 rounded-3 bg-danger d-flex align-items-center justify-content-center shadow-sm" style={{ width: 40, height: 40 }}>
            <i className="bi bi-film fs-5 text-white"></i>
          </span>
          <span className="fw-bold tracking-tight">
            I<span className="text-danger">MOVIES</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" className="border-secondary text-white" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto ms-lg-3 gap-lg-2">
            <Nav.Link as={Link} to="/" className={`text-white fw-medium ${location.pathname === '/' ? 'text-danger' : 'opacity-75'}`}>
              <i className="bi bi-house-door me-1"></i> Movies
            </Nav.Link>
            <Nav.Link as={Link} to="/?status=now_showing" className="text-white opacity-75 fw-medium">
              Now Showing
            </Nav.Link>
            <Nav.Link as={Link} to="/?status=upcoming" className="text-white opacity-75 fw-medium">
              Upcoming
            </Nav.Link>
          </Nav>

          {/* Search bar */}
          <Form onSubmit={handleSearchSubmit} className="d-flex my-2 my-lg-0 me-lg-3 flex-grow-1" style={{ maxWidth: 360 }}>
            <InputGroup>
              <InputGroup.Text className="bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search movies, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark border-secondary text-white shadow-none"
              />
            </InputGroup>
          </Form>

          {/* Right Auth / Profile Section */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  id="user-dropdown"
                  className="d-flex align-items-center gap-2 cinema-card px-3 py-2 border-secondary"
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                    style={{ width: 32, height: 32, fontSize: '0.9rem' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="fw-medium text-white d-none d-sm-inline">
                    {user.name.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.65rem' }}>
                      ADMIN
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark shadow-lg border-secondary mt-2">
                  <div className="px-3 py-2 border-bottom border-secondary mb-1">
                    <p className="mb-0 fw-semibold text-white">{user.name}</p>
                    <small className="text-secondary">{user.email}</small>
                  </div>

                  {isAdmin && (
                    <Dropdown.Item as={Link} to="/admin" className="py-2 text-warning fw-medium">
                      <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item as={Link} to="/my-bookings" className="py-2 text-white">
                    <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Bookings
                  </Dropdown.Item>

                  <Dropdown.Divider className="border-secondary" />

                  <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex align-items-center gap-2">
                {/* 1-Click Demo Login Helper Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="btn-cinema-outline text-white px-2 py-1">
                    <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Demo
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-dark border-secondary">
                    <Dropdown.Header className="text-secondary small">Instant Demo Credentials</Dropdown.Header>
                    <Dropdown.Item onClick={() => handleQuickDemoLogin('admin')} className="text-warning">
                      <i className="bi bi-shield-lock me-2"></i> Login as Admin
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleQuickDemoLogin('user')} className="text-white">
                      <i className="bi bi-person me-2"></i> Login as User
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Button as={Link} to="/login" variant="outline-light" className="btn-cinema-outline px-3 py-2">
                  Login
                </Button>
                <Button as={Link} to="/register" className="btn-cinema px-3 py-2">
                  Register
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
