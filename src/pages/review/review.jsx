import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '../../components/sidebar/sidebar.jsx'
import Navbar2 from '../../components/navbar2/navbar2.jsx';
import axios from 'axios';
import './review.css'
import { useNavigate } from 'react-router-dom';

function Reviews() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:9090/api/reviews/latest', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data) {
                setReviews(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
            if (err.response?.status === 401) {
                setError('Please log in to view reviews');
                navigate('/login', { state: { from: '/reviews' } });
            } else {
                setError('Failed to load reviews');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reviews" id="reviews">
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
                    <h2 className="section-header">Reviews</h2>

                    <div className="date">
                        <input type="date" onChange={(e) => console.log(e.target.value)} />
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Ratings and Reviews</h3>
                                <span><FontAwesomeIcon icon={['fas', 'fa-search']} /></span>
                                <span><FontAwesomeIcon icon={['fas', 'fa-filter']} /></span>
                            </div>
                            {loading ? (
                                <p>Loading reviews...</p>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Profile</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.map((review) => (
                                            <tr key={review.id}>
                                                <td>
                                                    <img src={review.photo} alt="User" />
                                                </td>
                                                <td>
                                                    <div className="star">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FontAwesomeIcon
                                                                key={i}
                                                                icon={['fas', i < review.rating ? 'fa-star' : 'fa-star-o']}
                                                                style={{ color: 'var(--yellow)' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{review.comment}</td>
                                                <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
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

export default Reviews;
