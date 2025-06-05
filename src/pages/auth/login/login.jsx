import { useState } from 'react';
import { login } from '../../../api/authApi.js';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            console.log('Login response:', data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    role: data.role,
                    email: data.email
                }));

                // Check for pending booking
                const pendingBooking = localStorage.getItem('pendingBooking');
                if (pendingBooking) {
                    // Remove the pending booking from localStorage
                    localStorage.removeItem('pendingBooking');
                    // Redirect back to rooms page to complete the booking
                    navigate('/rooms');
                    return;
                }

                // Get the return path from state
                const returnPath = location.state?.from;

                // If user is ADMIN and there's no specific return path, go to dashboard
                if (data.role === 'ADMIN' && !returnPath) {
                    navigate('/dashboard');
                } else if (returnPath) {
                    // If there's a return path, use it
                    navigate(returnPath);
                } else {
                    // Default to home page for regular users
                    navigate('/');
                }

                alert('Login successful!');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Error during login');
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleLogin}>
                <h2 className="section-header login-form-header">Log In</h2>
                <div className="login-content">
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input className="box" type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email" required
                        />
                    </div>
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faLock} /></span>
                        <input className="box" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password" minLength="8" required
                        />
                    </div>
                    <div className="buttons">
                        <button className="btn" type="submit">Log in</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Link to="/" className="link btn">Cancel</Link>
                    </div>
                    <div className="form-links">
                        <Link to="/" className="link"><p>Forgot password? <span>Click Here</span></p></Link>
                        <Link to="/signUp" className="link"><p>Do not have an account? <span>Sign up</span></p></Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;

