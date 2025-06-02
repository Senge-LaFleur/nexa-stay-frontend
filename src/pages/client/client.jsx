import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '../../components/sidebar/sidebar.jsx'
import Navbar2 from '../../components/navbar2/navbar2.jsx';
import profile1 from '../../assets/images/profile1.jpg'
import './client.css'
import { API_CONFIG } from '../../config/apiConfig';
import apiClient from '../../api/apiClient';

const ClientPage = () => {
    const [adminUsers, setAdminUsers] = useState([]);
    const [clientUsers, setClientUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prev => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarExpanded(false);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const [adminResponse, clientResponse] = await Promise.all([
                    apiClient.get(`${API_CONFIG.AUTH_SERVICE}/users/by-role/ADMIN`),
                    apiClient.get(`${API_CONFIG.AUTH_SERVICE}/users/by-role/CLIENT`)
                ]);
                setAdminUsers(adminResponse.data);
                setClientUsers(clientResponse.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="client" id="client">


            {/* ------------------------------ SIDEBAR ------------------------------- */}

            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div
                className={`container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
                style={
                    {
                        marginLeft: !isMobile && isSidebarExpanded ?
                            '280px' : !isMobile && !isSidebarExpanded ?
                                '100px' : '100px', transition: 'margin-left 0.3s ease-in-out'
                    }
                }
            >




                {/* ------------------------------ MAIN SECTION ------------------------------- */}

                <main>

                    <Navbar2 />

                    <h2 className="section-header">Admins and Clients</h2>

                    <div className="date">
                        <input type="date" />
                    </div>


                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>All Users Registered In The Platform</h3>
                                <span><FontAwesomeIcon icon={['fas', 'fa-search']} /></span>
                                <span><FontAwesomeIcon icon={['fas', 'fa-filter']} /></span>
                            </div>

                            <h4 className="section-subheader">Administrators</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.nom}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <br /><br /><br />        
                            <h4 className="section-subheader">Clients</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.nom}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
};

export default ClientPage;
