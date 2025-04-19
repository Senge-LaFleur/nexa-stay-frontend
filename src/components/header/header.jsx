import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '../navbar/navbar.jsx';
import ScrollReveal from 'scrollreveal';
import './header.css'

function header(){
    
    useEffect(() => {
        const scrollRevealOption = {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
        }
        
        //Header Container Scroll Reveal
        ScrollReveal().reveal(".header-container p", {
            ...scrollRevealOption
        })
        ScrollReveal().reveal(".header-container h1", {
            ...scrollRevealOption,
            delay: 500,
        })
        ScrollReveal().reveal(".header-container .book-link", {
            ...scrollRevealOption,
            delay: 1000,
        })

        //About Container Scroll Reveal
        ScrollReveal().reveal(".about-image img", {
            ...scrollRevealOption,
            origin: "left",
        })
        ScrollReveal().reveal(".about-content .section-subheader", {
            ...scrollRevealOption,
            delay: 500,
        })
        ScrollReveal().reveal(".about-content .section-header", {
            ...scrollRevealOption,
            delay: 1000,
        })
        ScrollReveal().reveal(".about-content .section-description", {
            ...scrollRevealOption,
            delay: 1500,
        })
        ScrollReveal().reveal(".about-btn", {
            ...scrollRevealOption,
            delay: 2000,
        })

        //Room Container Scroll Reveal
        ScrollReveal().reveal(".room-card", {
            ...scrollRevealOption,
            interval: 500,
        })

        //Service Container Scroll Reveal
        ScrollReveal().reveal(".service-list li", {
            ...scrollRevealOption,
            interval: 500,
            origin: "right",
        })
    }, [])

    return (
        <div>
            <header class="header">
                <Navbar />
                <div class="section-container header-container" id="welcome">
                    <p>Simple - Unique - Friendly</p>
                    <h1>Make Yourself At Home<br />In Our <span>Hotel</span>.</h1>
                    <Link to="/rooms">
                        <span class="book-link">Book A Room &nbsp;
                            <FontAwesomeIcon icon={['fas', 'fa-arrow-right']} />
                        </span>
                    </Link>
                </div>

                
            </header>
        </div>
    );
}

export default header;