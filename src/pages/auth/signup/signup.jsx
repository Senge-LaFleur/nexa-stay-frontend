import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './signup.css'

const Signup = () => {

    return (
        <div class="client-form-container">
            <form action="">
                <h2 class="section-header client-form-header">Sign Up</h2>
                <div class="client-content">
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-user']} /></span>
                        <input type="text" class="box" placeholder="Enter a Username" minlength="8" required />
                    </div>
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-envelope']} /></span>
                        <input type="email" class="box" placeholder="Enter your Email" required />
                    </div>
                    <div class="box-container">
                        <span><FontAwesomeIcon icon={['fas', 'fa-lock']} /></span>
                        <input type="password" class="box" placeholder="Enter a Password" minlength="8" required />
                    </div>
                    <div class="buttons">
                        <button class="btn">Register</button>
                        <Link to="/" class="link btn">Cancel</Link>
                    </div>
                    <div class="form-links">
                        <p><input type="checkbox" />&nbsp;&nbsp;Remember Me</p>
                        <Link to="/login" class="link"><p>Already have an account? <span>Login</span></p></Link>
                    </div>
                </div>
            </form>

        </div>


  )
} 


export default Signup;

