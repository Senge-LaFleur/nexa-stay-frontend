import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './footer.css'

function footer(){

    return (
        <div>
            <footer class="footer" id="contact">
                <div class="section-container footer-container">
                    <div class="footer-col">
                        <div class="logo">
                            <a href="#home">
                                <span><FontAwesomeIcon icon={['fas', 'fa-hotel']} /></span><h4>NexaStay</h4>
                            </a>
                        </div>
                        <p class="section-description">
                            Discover your perfect stay with our hotel booking website! Easily browse, compare, and 
                            book hotels based on location, price, and amenities. With real-time availability and secure 
                            payment options, planning your next getaway has never been easier. Book now and enjoy 
                            a seamless travel experience!
                        </p>
                        <button class="btn">Book Now</button>
                    </div>
                    <div class="footer-col">
                        <h4>QUICK LINKS</h4>
                        <ul class="footer-links">
                            <li><a href="#">Browse Destinations</a></li>
                            <li><a href="#">Special Offers & Packages</a></li>
                            <li><a href="#">Room Types & Amenities</a></li>
                            <li><a href="#">Customer Reviews & Ratings</a></li>
                            <li><a href="#">Travel Tips & Guides</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>OUR SERVICES</h4>
                        <ul class="footer-links">
                            <li><a href="#">Concierge Assistance</a></li>
                            <li><a href="#">Flexible Booking Operations</a></li>
                            <li><a href="#">Airport Transfers</a></li>
                            <li><a href="#">Wellness And Recreation</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>CONTACT US</h4>
                        <ul class="footer-links">
                            <li><a href="#">nexastay@info.com</a></li>
                        </ul>
                        <div class="footer-socials">
                        <a href="#">
                            <FontAwesomeIcon icon={['fab', 'fa-facebook-f']} />
                        </a>
                        <a href="#">
                            <FontAwesomeIcon icon={['fab', 'fa-instagram']} />
                        </a>
                        <a href="#">
                            <FontAwesomeIcon icon={['fab', 'fa-twitter']} />
                        </a>
                        <a href="#">
                            <FontAwesomeIcon icon={['fab', 'fa-youtube']} />
                        </a>
                        </div>
                    </div>
                </div>
                <div class="footer-bar">
                    Copyright &copy; 2025 Team <span>Nexa Stay</span>. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}

export default footer;