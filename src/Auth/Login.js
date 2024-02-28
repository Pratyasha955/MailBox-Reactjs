import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../Reducer/authSlice';
import './Login.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

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
        <div className='login-container'>
            <div className="box-container">
                <Form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="form-heading">Login</h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="form-label">Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="form-label">Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="submit-button">
                        Submit
                    </Button>
                    <p className="signup-message">
                        Don't have an account? <Link to="/signup">Signup</Link>
                    </p>

                    {error && <p className="error-message">{error}</p>}
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
