import {IoPerson} from "react-icons/io5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {RiLockPasswordFill} from "react-icons/ri";
import {MdEmail} from "react-icons/md";
import './login.css'

const Login = () => {

    return (
        <div class="login-form-container">
            <form action="">
                <h2 class="section-header login-form-header">Login</h2>
                <div class="login-content">
                    <div class="box-container">
                        <MdEmail class="icon" />
                        <input type="email" class="box" placeholder="Enter your Email" />
                    </div>
                    <div class="box-container">
                        <RiLockPasswordFill class="icon" />
                        <input type="password" class="box" placeholder="Enter your Password" />
                    </div>
                    <div class="buttons">
                        <button class="btn">Login</button>
                        <button class="btn">Cancel</button>
                    </div>
                    <div class="form-links">
                        <p>Forgot password? <span>Click Here</span></p>
                        <p>Do not have an account? <span>Sign up</span></p>
                    </div>
                </div>
            </form>

        </div>


  )
} 


export default Login

