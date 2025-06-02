import { useState } from 'react';
import { login } from '../../../api/authApi.js';
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            console.log('Login response:', data); // Debug log

            // Store token
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('User role from response:', data.role); // Debug log

                // Role-based redirection
                const userRole = data.role;
                console.log('Checking role for redirection:', userRole); // Debug log

                if (userRole === 'ADMIN') {
                    console.log('Redirecting to dashboard (ADMIN)'); // Debug log
                    navigate('/dashboard');
                } else {
                    console.log('Redirecting to rooms (CLIENT)'); // Debug log
                    navigate('/rooms');
                }

                alert('Login successful!');
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
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

