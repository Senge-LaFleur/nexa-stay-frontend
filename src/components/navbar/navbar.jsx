import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './navbar.css'

function navbar(){
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }
    
    const closeMenu = () => {
        setIsOpen(false);
    }

    return (
        <div>
            
            <nav>
                <div class="navbar">
                    <div class="logo">
                        <h3><span>Nexa</span>Stay</h3>
                    </div>
                    <div class="menu-bar" id="menu-bar" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={isOpen ? ['fas', 'fa-times'] : ['fas', 'fa-bars']} />
                    </div>
                </div>
                <ul id="nav-links" class={`nav-links ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/rooms">Rooms</Link></li>
                    <li><Link to="/login">Log In</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </ul>
                <Link to="/rooms" class="btn nav-btn">Book Now</Link>
            </nav>    
            
        </div>
    );
}

export default navbar;