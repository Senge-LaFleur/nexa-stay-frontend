import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'
import ScrollReveal from 'scrollreveal';
import about from '../../assets/images/about.jpg';
import lobby2 from '../../assets/images/lobby2.jpg';
import lobby4 from '../../assets/images/lobby4.jpg';
import lobby5 from '../../assets/images/lobby5.jpg';
import lobby6 from '../../assets/images/lobby6.jpg';
import profile1 from '../../assets/images/profile1.jpg';
import profile2 from '../../assets/images/profile2.jpg';
import profile3 from '../../assets/images/profile3.jpg';
import profile4 from '../../assets/images/profile4.jpg';
import profile5 from '../../assets/images/profile5.jpg';
import profile6 from '../../assets/images/profile6.jpg';
import 'swiper/css';
import 'swiper/css/autoplay';
import './home.css'
import ImageSlider from '../../components/imageSlider/imageSlider.jsx';

function Home() {
    const [showMessage, setShowMessage] = useState(false);

    const toggleMessage = () => {
        setShowMessage(!showMessage)
    };

    const images = [lobby2, lobby5, lobby4, about, lobby6];


    return (
        <div class="home">

            <section class="section-container about-container" id="about">
                <div class="about-image">
                    <img src={about} alt="about" />
                </div>
                <div class="about-content">
                    <p class="section-subheader">ABOUT US</p>
                    <h2 class="section-header">The Best Holidays Start Here !</h2>
                    <p class="section-description">
                        Discover your perfect stay with our hotel booking website! Easily browse, compare, and 
                        book hotels based on location, price, and amenities. With real-time availability and secure 
                        payment options, planning your next getaway has never been easier. Book now and enjoy 
                        a seamless travel experience!
                    </p>
                    {showMessage && (
                        <p class="section-description" id="hidden">
                            Nexa Stay offers a comfortable and modern lodging experience with services
                             designed to meet the needs of both leisure and business travelers. Guests 
                             can enjoy high-speed Wi-Fi, secure car parking, pet-friendly accommodations, 
                             and a 24/7 front desk for personalized assistance. The hotel also features clean, 
                             stylish rooms, daily housekeeping, and convenient access to local attractions, making 
                             every stay relaxed, connected, and hassle-free.
                        </p>
                    )}
                    <button class="btn about-btn" onClick={toggleMessage}>{showMessage ? 'Hide' : 'Learn More'}</button>
                </div>
            </section>

            <section class="section-container benefit-container">
                <div class="benefit-content">
                    <p class="section-subheader">FIRST OF ALL</p>
                    <h2 class="section-header">Why Stay With Us</h2>
                    <div class="benefit-grid">
                        <div class="benefit-card">
                            <span class="icons"><FontAwesomeIcon icon={['fas', 'fa-wifi']} /></span>
                            <h3>FREE WIFI</h3>
                        </div>
                        <div class="benefit-card">
                            <span class="icons"><FontAwesomeIcon icon={['fas', 'fa-paw']} /></span>
                            <h3>PET FRIENDLY ROOMS</h3>
                        </div>
                        <div class="benefit-card">
                            <span class="icons"><FontAwesomeIcon icon={['fas', 'fa-square-parking']} /></span>
                            <h3>PARKING AVAILABLE</h3>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section-container homeroom-container" id="homeroom">
                <div class="homeroom-content">
                    <p class="section-subheader">OUR ROOMS</p>
                    <h2 class="section-header">Relax In Style.</h2>
                    <p class="section-description">
                        Relax in our spacious, business-friendly rooms designed with modern comforts. 
                        All rooms come with pillow-top mattresses, flat-screen TVs, ergonomic workspaces, 
                        and handicap-accessible options are available.
                    </p>
                    <button class="btn">Visit Our Rooms</button>
                </div>
            </section>

            <section class="section-container banner-container">
                <div class="banner-content">
                    <div class="banner-card">
                        <h4>25+</h4><p>Properties Available</p>
                    </div>
                    <div class="banner-card">
                        <h4>350+</h4><p>Bookings Completed</p>
                    </div>
                    <div class="banner-card">
                        <h4>600+</h4><p>Happy Customers</p>
                    </div>
                </div>
            </section>

            <section class="service" id="service">
                <div class="section-container service-container">
                    <div class="service-content">
                        <p class="section-subheader">SERVICES</p>
                        <h2 class="section-header">Strive Only For The Best.</h2>
                        <ul class="service-list">
                            <li>
                                <span><FontAwesomeIcon icon={['fas', 'fa-shield-alt']} /></span>
                                High Class Security
                            </li>
                            <li>
                                <span><FontAwesomeIcon icon={['fas', 'fa-clock']} /></span>
                                24 Hours Room Service
                            </li>
                            <li>
                                <span><FontAwesomeIcon icon={['fas', 'fa-headphones']} /></span>
                                Conference Room
                            </li>
                            <li>
                                <span><FontAwesomeIcon icon={['fas', 'fa-map']} /></span>
                                Tourist Guide Support
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="explore" id="explore">
                <p class="section-subheader">EXPLORE</p>
                <h2 class="section-header">Visit Our Gallery</h2>
                <ImageSlider images={images} />
                <div class="more">
                    <Link to="/">
                        <h3>View More <FontAwesomeIcon icon={['fas', 'fa-arrow-right']} /></h3>
                    </Link>
                </div>
                
            </section>

            <section class="review">
                <div class="section-container review-container">
                    <p class="section-subheader">OUR REVIEWS</p>
                    <h2 class="section-header">What our Clients Say</h2>
                    <div class="review-grid">
                        <div class="review-card">
                            <img src={profile1} alt="review-profile" />
                            <div class="star">
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star-half-alt']} id="half-star" />
                            </div>
                            <p>The booking process was seamless, and the confirmation was instant.
                                I highly recommend NexaStay for hassle-free hotel bookings.
                            </p>
                        </div>
                        <div class="review-card">
                            <img src={profile2} alt="review-profile" />
                            <div class="star">
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star-half-alt']} id="half-star" />
                            </div>
                            <p>The booking process was seamless, and the confirmation was instant.
                                I highly recommend NexaStay for hassle-free hotel bookings.
                            </p>
                        </div>
                        <div class="review-card">
                            <img src={profile3} alt="review-profile" />
                            <div class="star">
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star-half-alt']} id="half-star" />
                            </div>
                            <p>The booking process was seamless, and the confirmation was instant.
                                I highly recommend NexaStay for hassle-free hotel bookings.
                            </p>
                        </div>
                        <div class="review-card">
                            <img src={profile4} alt="review-profile" />
                            <div class="star">
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star-half-alt']} id="half-star" />
                            </div>
                            <p>The booking process was seamless, and the confirmation was instant.
                                I highly recommend NexaStay for hassle-free hotel bookings.
                            </p>
                        </div>
                        <div class="review-card">
                            <img src={profile5} alt="review-profile" />
                            <div class="star">
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star-half-alt']} id="half-star" />
                            </div>
                            <p>The booking process was seamless, and the confirmation was instant.
                                I highly recommend NexaStay for hassle-free hotel bookings.
                            </p>
                        </div>
                        <div class="review-card">
                            <img src={profile6} alt="review-profile" />
                            <div class="star">
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star']} />
                                <FontAwesomeIcon icon={['fas','fa-star-half-alt']} id="half-star" />
                            </div>
                            <p>The booking process was seamless, and the confirmation was instant.
                                I highly recommend NexaStay for hassle-free hotel bookings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>            

        </div>
    )
}

export default Home;