import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page py-5">
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
                <h4 className="text-white fw-bold mb-1">Create an Account</h4>
                <p className="text-secondary small">Join IMovies to book cinema tickets in seconds</p>
              </div>

              {error && (
                <Alert variant="danger" className="cinema-card border-danger text-light py-2 small mb-4">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary small">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary small">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-secondary small">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Register Now</span>
                  )}
                </Button>
              </Form>

              <div className="text-center border-top border-secondary pt-3 mt-4">
                <p className="text-secondary small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-danger fw-bold text-decoration-none">
                    Sign In
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
