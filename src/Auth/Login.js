import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../Reducer/authSlice';
import img1 from '../img/right.jpg';
import './Login.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCi8np-w6bC6OmX92p2J4JX-JF87puzk7Q',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message);
            }

            setError(null);
            const userData = await response.json();
            console.log(userData);
            dispatch(loginSuccess(userData));
            setEmail('');
            setPassword('');
            navigate('/welcome');
        } catch (error) {
            setError(error.message);
            dispatch(loginFailure(error.message));
        }
    };

    return (
        <div>
            <div className="wave">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#0099ff" fillOpacity="1" d="M0,96L60,122.7C120,149,240,203,360,202.7C480,203,600,149,720,106.7C840,64,960,32,1080,37.3C1200,43,1320,85,1380,106.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
                </svg>
            </div>
            <div className='login-container'>
                <Row className="login-row">
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                        <img src={img1} alt="Login" className="login-img" />
                    </Col>
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                        <Form className="login-form" onSubmit={handleSubmit}>
                            <h2 className="form-heading">Login</h2>
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
                            <p className="Forgot-Password">
                                <Link className='fp-link' to="/forgot-password">Forgot Password?</Link>
                            </p>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <p className="signup-message">
                                Don't have an account? <Link to="/signup">Signup</Link>
                            </p>

                            {error && <p className="error-message">{error}</p>}
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default LoginPage;
