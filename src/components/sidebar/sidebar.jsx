import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './sidebar.css';

function Sidebar({ isExpanded, toggleSidebar, isMobile }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className={`aside ${isMobile ? 'mobile' : 'desktop'}`}>
            <div className="container">
                <aside className={`sidebar-component ${isExpanded ? 'expanded' : 'collapsed'}`} >
                    <div className="top">
                        <div className="logo">
                            <FontAwesomeIcon icon={['fas', 'fa-hotel']} />
                            {isExpanded && (!isMobile || (isMobile && isExpanded)) && <span>NexaStay</span>}
                        </div>
                        <div className="toggle-btn" id="toggle-btn" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={['fas', isExpanded ? 'fa-angle-left' : 'fa-angle-right']} title={isExpanded ? 'Hide Sidebar' : 'Show Sidebar'} />
                        </div>
                    </div>

                    <div className="sidebar">
                        <ul id="side-links" className="side-links">
                            {isAdmin && (
                                <li className="side-list">
                                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                        <span><FontAwesomeIcon icon={['fas', 'fa-table-cells']} /></span>
                                        {isExpanded && <h3>Dashboard</h3>}
                                    </NavLink>
                                </li>
                            )}
                            <li className="side-list">
                                <NavLink to="/" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                    <span><FontAwesomeIcon icon={['fas', 'fa-home']} /></span>
                                    {isExpanded && <h3>Home</h3>}
                                </NavLink>
                            </li>
                            <li className="side-list">
                                <NavLink to="/rooms" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                    <span><FontAwesomeIcon icon={['fas', 'fa-bed']} /></span>
                                    {isExpanded && <h3>Rooms</h3>}
                                </NavLink>
                            </li>
                            {isAdmin && (
                                <li className="side-list">
                                    <NavLink to="/roomsTable" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                        <span><FontAwesomeIcon icon={['fas', 'fa-window-maximize']} /></span>
                                        {isExpanded && <h3>Rooms Management</h3>}
                                    </NavLink>
                                </li>
                            )}
                            {isAdmin && (
                                <li className="side-list">
                                    <NavLink to="/client" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                        <span><FontAwesomeIcon icon={['fas', 'fa-user-friends']} /></span>
                                        {isExpanded && <h3>Clients</h3>}
                                    </NavLink>
                                </li>
                            )}
                            <li className="side-list">
                                <NavLink to="/reservation" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                    <span><FontAwesomeIcon icon={['fas', 'fa-calendar-check']} /></span>
                                    {isExpanded && <h3>Reservations</h3>}
                                </NavLink>
                            </li>
                            {isAdmin && (
                                <li className="side-list">
                                    <NavLink to="/payments" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                        <span><FontAwesomeIcon icon={['fas', 'fa-dollar']} /></span>
                                        {isExpanded && <h3>Payments</h3>}
                                    </NavLink>
                                </li>
                            )}
                            {isAdmin && (
                                <li className="side-list">
                                    <NavLink to="/reviews" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                        <span><FontAwesomeIcon icon={['fas', 'fa-star']} /></span>
                                        {isExpanded && <h3>Reviews</h3>}
                                    </NavLink>
                                </li>
                            )}
                            {isAdmin && (
                                <li className="side-list">
                                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                        <span><FontAwesomeIcon icon={['fas', 'fa-envelope']} /></span>
                                        {isExpanded && <h3>Inbox</h3>}
                                        {isExpanded && <p className="message-count" id="message-count">99+</p>}
                                    </NavLink>
                                </li>
                            )}
                            <li className="side-list bottom" id="settings">
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                    <span><FontAwesomeIcon icon={['fas', 'fa-cog']} /></span>
                                    {isExpanded && <h3>Settings</h3>}
                                </NavLink>
                            </li>
                            <li className="side-list bottom">
                                <NavLink to="/logout" className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}>
                                    <span id="log-out"><FontAwesomeIcon icon={['fas', 'fa-sign-out-alt']} /></span>
                                    {isExpanded && <h3 id="log-out">Log Out</h3>}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Sidebar;
