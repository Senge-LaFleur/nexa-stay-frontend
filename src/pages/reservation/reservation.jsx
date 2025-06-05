import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar/sidebar.jsx'
import Navbar2 from '../../components/navbar2/navbar2.jsx';
import './reservation.css';
import { getUserReservations, getAllReservations } from '../../api/reservationApi';
import { format } from 'date-fns';

function Reservation() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);

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
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            let data;

            if (user?.role === 'ADMIN') {
                data = await getAllReservations();
            } else if (user?.id) {
                data = await getUserReservations(user.id);
            } else {
                throw new Error('Unauthorized access');
            }

            setReservations(data || []);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setError(error.message || 'Error fetching reservations');
        } finally {
            setLoading(false);
        }
    };

    const filteredReservations = reservations.filter(reservation =>
        reservation.roomId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(reservation.checkInDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(reservation.checkOutDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="reservation" id="reservation">
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div
                className={`container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
                style={{
                    marginLeft: !isMobile && isSidebarExpanded ?
                        '280px' : !isMobile && !isSidebarExpanded ?
                            '100px' : '100px',
                    transition: 'margin-left 0.3s ease-in-out'
                }}
            >
                <main>
                    <Navbar2 />
                    <h2 className="section-header">Reservations</h2>

                    <div className="date">
                        <input type="date" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Reservations</h3>
                                <div className="table-actions">
                                    <span onClick={() => setShowSearch(!showSearch)}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </span>
                                </div>
                            </div>

                            {showSearch && (
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search reservations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}

                            {loading ? (
                                <div className="loading-message">Loading reservations...</div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Reserved On</th>
                                            <th>Check In</th>
                                            <th>Check Out</th>
                                            <th>Guests</th>
                                            <th>Total Price</th>
                                            <th>Status</th>
                                            {JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN' && (
                                                <>
                                                    <th>User ID</th>
                                                    <th>Room ID</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReservations.length === 0 ? (
                                            <tr>
                                                <td colSpan={JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN' ? 8 : 6} className="empty-message">
                                                    No reservations found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredReservations.map(reservation => (
                                                <tr key={reservation.id}>
                                                    <td>{format(new Date(reservation.createdAt), 'MMM dd, yyyy')}</td>
                                                    <td>{format(new Date(reservation.checkInDate), 'MMM dd, yyyy')}</td>
                                                    <td>{format(new Date(reservation.checkOutDate), 'MMM dd, yyyy')}</td>
                                                    <td>{reservation.numberOfGuests}</td>
                                                    <td>${reservation.totalPrice}</td>
                                                    <td>
                                                        <span className={`status ${reservation.status.toLowerCase()}`}>
                                                            {reservation.status}
                                                        </span>
                                                    </td>
                                                    {JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN' && (
                                                        <>
                                                            <td>{reservation.userId}</td>
                                                            <td>{reservation.roomId}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Reservation;
