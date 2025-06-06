import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            console.log('Login response:', data);

            // Check for pending review before navigation
            const pendingReview = sessionStorage.getItem('pendingReview');
            console.log('Checking for pending review after login:', {
                hasPendingReview: !!pendingReview,
                pendingReviewData: pendingReview ? JSON.parse(pendingReview) : null
            });

            // Small delay to ensure state updates are processed
            await new Promise(resolve => setTimeout(resolve, 500));

            if (pendingReview) {
                console.log('Found pending review, navigating to home with processPendingReview flag');
                // Navigate back to home with a flag to process the review
                navigate('/', {
                    state: {
                        processPendingReview: true,
                        scrollToReviews: true
                    },
                    replace: true
                });
                return;
            }

            // Get the return path from state
            const returnPath = location.state?.from;
            console.log('Navigation state:', {
                returnPath,
                locationState: location.state
            });

            // Handle navigation based on role and return path
            if (data.role === 'ADMIN' && !returnPath) {
                navigate('/dashboard', { replace: true });
            } else if (returnPath) {
                navigate(returnPath, {
                    state: {
                        scrollToReviews: location.state?.scrollToReviews
                    },
                    replace: true
                });
            } else {
                navigate('/', { replace: true });
            }

            alert('Login successful!');
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

