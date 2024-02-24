import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import img1 from '../img/right.jpg';
import './Signup.css';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password || password !== confirmPassword) {
      setError('Please fill in all fields correctly.');
      return;
    }

    try {
      // Send request to Google Identity Toolkit API for login
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCi8np-w6bC6OmX92p2J4JX-JF87puzk7Q',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      // Login successful
      setError(null);
      // Clear input fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Redirect user to dashboard or perform other actions
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#0099ff" fillOpacity="1" d="M0,96L60,122.7C120,149,240,203,360,202.7C480,203,600,149,720,106.7C840,64,960,32,1080,37.3C1200,43,1320,85,1380,106.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
      <div className='signup-container'>
        <Row className="signup-row">
          <Col md={6} className="left-part">
            <img src={img1} alt="Signup" className="signup-img" />
          </Col>
          <Col md={6} className="right-part">
            <Form className="signup-form" onSubmit={handleSubmit}>
              <h2 className="form-heading">Signup</h2>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <p className="login-message">
                Already have an account? <Link to="/">Login</Link>
              </p>
              {error && <p className="error-message">{error}</p>}
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default SignupPage;
