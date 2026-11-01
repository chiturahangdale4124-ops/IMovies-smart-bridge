import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin' && redirectPath === '/') {
          navigate('/admin');
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('Admin@123');
    } else {
      setEmail('user@imovies.com');
      setPassword('User@123');
    }
  };

  return (
    <div className="login-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={5}>
            <div className="cinema-card p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="brand-font fs-2 text-white mb-2">
                  <span className="p-2 rounded-3 bg-danger d-inline-flex align-items-center justify-content-center me-2">
                    <i className="bi bi-film fs-5 text-white"></i>
                  </span>
                  I<span className="text-danger">MOVIES</span>
                </div>
                <h4 className="text-white fw-bold mb-1">Welcome Back</h4>
                <p className="text-secondary small">Sign in to reserve your favourite cinema seats</p>
              </div>

              {error && (
                <Alert variant="danger" className="cinema-card border-danger text-light py-2 small mb-4">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  {error}
                </Alert>
              )}

              {/* 1-Click Demo Buttons for Fast Evaluation */}
              <div className="bg-dark p-3 rounded-3 border border-secondary mb-4 text-center">
                <small className="text-secondary d-block mb-2 fw-semibold">Quick Demo Logins (1-Click Fill):</small>
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="flex-grow-1"
                    onClick={() => fillDemo('admin')}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Demo Admin
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="flex-grow-1"
                    onClick={() => fillDemo('user')}
                  >
                    <i className="bi bi-person me-1"></i> Demo User
                  </Button>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary small">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-secondary small">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-cinema w-100 py-2 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </Form>

              <div className="text-center border-top border-secondary pt-3 mt-4">
                <p className="text-secondary small mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-danger fw-bold text-decoration-none">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
