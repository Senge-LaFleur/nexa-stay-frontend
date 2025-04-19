import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '../../components/navbar/navbar.jsx'
import room1 from '../../assets/images/bedroom1.jpg'
import room2 from '../../assets/images/bedroom2.jpg'
import room3 from '../../assets/images/bedroom3.jpg'
import room4 from '../../assets/images/bedroom4.jpg'
import './rooms.css'

function Rooms() {

    return (
        <div class="rooms">
            <section class="room-header">
                <Navbar />
                <div class="section-container room-header-container" id="room-header">
                    <p>Rest - Recharge - Repeat</p>
                    <h1>Nexa Stay Rooms</h1>
                </div>
            </section>

            <section class="section-container booking-container">
                <form action="/" class="booking-form">
                    <div class="input-group">
                        <span><FontAwesomeIcon icon={['fas', 'fa-calendar-alt']} /></span>
                        <div>
                            <label for="check-in">CHECK-IN</label>
                            <input type="text" placeholder="Check In" />
                        </div>
                    </div>
                    <div class="input-group">
                        <span><FontAwesomeIcon icon={['fas', 'fa-calendar-alt']} /></span>
                        <div>
                            <label for="check-out">CHECK-OUT</label>
                            <input type="text" placeholder="Check Out" />
                        </div>
                    </div>
                    <div class="input-group">
                        <span><FontAwesomeIcon icon={['fas', 'fa-user']} /></span>
                        <div>
                            <label for="guest">GUESTS</label>
                            <input type="text" placeholder="Guests" />
                        </div>
                    </div>
                    <div class="input-group input-btn">
                        <button class="btn">CHECK OUT</button>
                    </div>
                </form>
            </section>

            <section class="section-container room-container" id="room">
                <div class="intro">
                    <div class="title">
                        <p class="section-subheader">OUR BEDROOMS</p>
                        <h2 class="section-header">The Most Memorable Rest Time Starts Here.</h2>
                    </div>
                    <p class="section-description">
                        Relax in our spacious, business-friendly rooms designed with modern comforts. 
                        All rooms come with pillow-top mattresses, flat-screen TVs, ergonomic workspaces, 
                        and handicap-accessible options are available.
                    </p>
                </div>
                
                <div class="room-grid">
                    <div class="room-card">
                        <div class="room-card-image">
                            <img src={room4} alt="room" />
                        </div>
                        <div class="room-card-details">
                            <h4>Deluxe Ocean View</h4>
                            <p>
                                Bask in luxury with breathtaking ocean views from your suite.
                            </p>
                            <h5>Starting from <span>$399/night</span></h5>
                            <button class="btn">Book Now</button>
                        </div>
                    </div>
                    <div class="room-card">
                        <div class="room-card-image">
                            <img src={room1} alt="room" />
                        </div>
                        <div class="room-card-details">
                            <h4>Executive Cityscape Room</h4>
                            <p>
                                Experience urban elegance and modern comfort in the heart of the city.
                            </p>
                            <h5>Starting from <span>$199/night</span></h5>
                            <button class="btn">Book Now</button>
                        </div>
                    </div>
                    <div class="room-card">
                        <div class="room-card-image">
                            <img src={room2} alt="room" />
                        </div>
                        <div class="room-card-details">
                            <h4>Family Garden Retreat</h4>
                            <p>
                                Spacious and inviting, perfect for creating lavish cherished memories with loved ones.
                            </p>
                            <h5>Starting from <span>$249/night</span></h5>
                            <button class="btn">Book Now</button>
                        </div>
                    </div>
                    <div class="room-card">
                        <div class="room-card-image">
                            <img src={room3} alt="room" />
                        </div>
                        <div class="room-card-details">
                            <h4>Couple Room VIP</h4>
                            <p>
                                Enjoy luxury all while spending beautiful moments with your partner in our VIP classic suite.
                            </p>
                            <h5>Starting from <span>$299/night</span></h5>
                            <button class="btn">Book Now</button>
                        </div>
                    </div>
                    <div class="room-card">
                        <div class="room-card-image">
                            <img src={room4} alt="room" />
                        </div>
                        <div class="room-card-details">
                            <h4>Deluxe Ocean View</h4>
                            <p>
                                Bask in luxury with breathtaking ocean views from your suite.
                            </p>
                            <h5>Starting from <span>$399/night</span></h5>
                            <button class="btn">Book Now</button>
                        </div>
                    </div>
                    <div class="room-card">
                        <div class="room-card-image">
                            <img src={room1} alt="room" />
                        </div>
                        <div class="room-card-details">
                            <h4>Executive Cityscape Room</h4>
                            <p>
                                Experience urban elegance and modern comfort in the heart of the city.
                            </p>
                            <h5>Starting from <span>$199/night</span></h5>
                            <button class="btn">Book Now</button>
                        </div>
                    </div>
                </div>
            </section>          

        </div>
    )
}

export default Rooms;