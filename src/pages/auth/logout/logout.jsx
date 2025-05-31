import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './logout.css'

const Logout = () => {
    

    return (
        <div class="logout-form-container">
            <div class="logout-container">
                <h2 class="section-header logout-form-header">Log Out</h2>
                <Link to="/dashboard" title="Cancel">
                    <span><FontAwesomeIcon icon={['fas','fa-times']} /></span>
                </Link>
                <div class="logout-content">
                    <h3 class="section-subheader">Are you sure you want to log out?</h3>
                    <div class="buttons">
                        <Link to="/" class="link btn">Yes</Link>
                        <Link to="/dashboard" class="link btn">No</Link>
                    </div>
                </div>
            </div>

        </div>


  )
} 


export default Logout;

