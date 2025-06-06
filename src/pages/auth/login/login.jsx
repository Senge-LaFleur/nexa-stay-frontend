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
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(email, password);
            console.log('Login response:', data);

            // Small delay to ensure state updates are processed
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get the return path from state or use default based on role
            const returnPath = location.state?.from || (data.role === 'ADMIN' ? '/dashboard' : '/rooms');

            // Navigate to the appropriate page
            navigate(returnPath, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Error during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleLogin}>
                <h2 className="section-header login-form-header">Log In</h2>
                <div className="login-content">
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input
                            className="box"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faLock} /></span>
                        <input
                            className="box"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            minLength="8"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="buttons">
                        <button className="btn" type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>
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

