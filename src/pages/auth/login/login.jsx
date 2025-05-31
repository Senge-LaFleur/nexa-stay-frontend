import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './login.css'

const Login = () => {

    return (
        <div class="login-form-container">
            <form action="">
                <h2 class="section-header login-form-header">Log In</h2>
                <div class="login-content">
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-envelope']} /></span>
                        <input type="email" class="box" placeholder="Enter your Email" required />
                    </div>
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-lock']} /></span>
                        <input type="password" class="box" placeholder="Enter your Password" minlength="8" required />
                    </div>
                    <div class="buttons">
                        <button class="btn">Log in</button>
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

