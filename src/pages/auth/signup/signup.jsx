import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signup } from '../../../api/authApi';
import './signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await signup(formData);
            setSuccess('Registration successful!');
            // If we got a token back, we're already logged in
            if (response.token) {
                navigate('/rooms');
            } else {
                // If no token, redirect to login
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Error during registration');
        }
    };

    return (
        <div className="client-form-container">
            <form onSubmit={handleSubmit}>
                <h2 className="section-header client-form-header">Sign Up</h2>
                <div className="client-content">
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-user']} /></span>
                        <input type="text" className="box"
                            name="username" value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter a Username" minLength="2" required
                        />
                    </div>
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-envelope']} /></span>
                        <input type="email" className="box"
                            name="email" value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your Email" required
                        />
                    </div>
                    <div className="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-lock']} /></span>
                        <input type="password" className="box"
                            name="password" value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter a Password" minLength="8" required
                        />
                    </div>
                    <div className="buttons">
                        <button className="btn" type="submit">Register</button>
                        {success && <p style={styles.success}>{success}</p>}
                        {error && <p style={styles.error}>{error}</p>}
                        <Link to="/" className="link btn">Cancel</Link>
                    </div>
                    <div className="form-links">
                        <Link to="/login" className="link">
                            <p>Already have an account? <span>Login</span></p>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

const styles = {
    success: {
        color: 'green',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        fontWeight: 'bold'
    }
};

export default Signup;

