import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { register } from '../../../api/authApi';
import './signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CLIENT' // Default role
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            console.log('Form data being sent:', formData);
            const response = await register(formData);
            console.log('Registration response:', response);
            setSuccess('Registration successful!');

            if (response.token) {
                if (formData.role === 'CLIENT') {
                    navigate('/rooms');
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Error during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-form-container">
            <form onSubmit={handleSubmit}>
                <h2 className="section-header">Sign Up</h2>
                <div className="client-content">
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faUser} /></span>
                        <input
                            type="text"
                            className="box"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your Name"
                            minLength="2"
                            required
                        />
                    </div>
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input
                            type="email"
                            className="box"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your Email"
                            required
                        />
                    </div>
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={faLock} /></span>
                        <input
                            type="password"
                            className="box"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter a Password"
                            minLength="8"
                            required
                        />
                    </div>
                    <div className="buttons">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                        <Link to="/" className="link btn">Cancel</Link>
                    </div>
                    {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <div className="form-links">
                    <p><input type="checkbox" />&nbsp;&nbsp;Remember Me</p>
                        <Link to="/login" className="link">
                            <p>Already have an account? <span>Login</span></p>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Signup;

