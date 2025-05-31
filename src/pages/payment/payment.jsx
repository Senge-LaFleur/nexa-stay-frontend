import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/navbar.jsx'
import Footer from '../../components/footer/footer.jsx'
import './payment.css'

function Payment() {

    return (
        <div class="payment">

            {/* <Navbar /> */}

            <section class="payment-container-form">

                <form action="">
                    <div class="row">
                        <Link to="/" title="Cancel" class="close-payment">
                            <span><FontAwesomeIcon icon={['fas','fa-times']} /></span>
                        </Link>
                        <div class="column">
                            <h3 class="title">Billing Address</h3>
                            <div class="input-box">
                                <span>Full Name :</span>
                                <input type="text" placeholder="Jacob Aiden" />
                            </div>
                            <div class="input-box">
                                <span>Email :</span>
                                <input type="email" placeholder="example@example.com" />
                            </div>
                            <div class="input-box">
                                <span>Address :</span>
                                <input type="text" placeholder="Street - Locality" />
                            </div>
                            <div class="input-box">
                                <span>City :</span>
                                <input type="text" placeholder="Yaounde" />
                            </div>

                            <div class="flex">
                                <div class="input-box">
                                    <span>State :</span>
                                    <input type="text" placeholder="Cameroon" />
                                </div>
                                <div class="input-box">
                                    <span>Zip Code :</span>
                                    <input type="number" placeholder="0000" />
                                </div>
                            </div>
                        </div>

                        <div class="column">
                            <h3 class="title">Payment</h3>
                            <div class="input-box">
                                <span>Cards Accepted :</span>
                                <img src="imgcards.png" alt="" />
                            </div>
                            <div class="input-box">
                                <span>Name On Card :</span>
                                <input type="text" placeholder="Mr. Jacob Aiden" />
                            </div>
                            <div class="input-box">
                                <span>Credit Card Number :</span>
                                <input type="number" placeholder="1111 2222 3333 4444" />
                            </div>
                            <div class="input-box">
                                <span>Exp. Month :</span>
                                <input type="text" placeholder="August" />
                            </div>
                        
                            <div class="flex">
                                <div class="input-box">
                                    <span>Exp. Year :</span>
                                    <input type="number" placeholder="2025" />
                                </div>
                                <div class="input-box">
                                    <span>CVV :</span>
                                    <input type="number" placeholder="123" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="buttons">
                        <button type="submit" class="btn">Submit</button>
                        <Link to="/" class="btn">Cancel</Link>
                    </div>
                </form>

            </section>

            {/* <Footer /> */}

        </div>
    )
}

export default Payment;