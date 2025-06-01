import { useState } from 'react';
import { login } from '../../../api/authApi.js';
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            localStorage.setItem('token', data.token); // stocker le JWT
            alert('Connexion réussie !');
            navigate('/rooms');
        } catch (err) {
            setError(err.response?.data || 'Erreur lors de la connexion');
        }
    };

    return (
        <div class="login-form-container">
            <form action="" onSubmit={handleLogin}>
                <h2 class="section-header login-form-header">Log In</h2>
                <div class="login-content">
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-envelope']} /></span>
                        <input class="box" type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email" required
                        />
                    </div>
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-lock']} /></span>
                        <input class="box" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password" minlength="8" required
                        />
                    </div>
                    <div class="buttons">
                        <button class="btn" type="submit">Log in</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Link to="/" class="link btn">Cancel</Link>
                    </div>
                    <div class="form-links">
                        <Link to="/" class="link"><p>Forgot password? <span>Click Here</span></p></Link>
                        <Link to="/signUp" class="link"><p>Do not have an account? <span>Sign up</span></p></Link>
                    </div>
                </div>
            </form>

        </div>


  )
} 


export default Login;

