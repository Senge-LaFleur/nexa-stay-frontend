import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ScrollReveal from 'scrollreveal';
import about from '../../assets/images/about.jpg';
import lobby2 from '../../assets/images/lobby2.jpg';
import lobby4 from '../../assets/images/lobby4.jpg';
import lobby5 from '../../assets/images/lobby5.jpg';
import lobby6 from '../../assets/images/lobby6.jpg';
import 'swiper/css';
import 'swiper/css/autoplay';
import ImageSlider from '../../components/imageSlider/imageSlider.jsx';
import './home.css'
import { useAuth } from '../../context/AuthContext';
import { submitReview, getLatestReviews } from '../../api/reviewApi';

function Home() {
    const [showMessage, setShowMessage] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photo, setPhoto] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMessage = () => {
        setShowMessage(!showMessage)
    };

    const images = [lobby2, lobby5, lobby4, about, lobby6];

    useEffect(() => {
        fetchReviews();

        // Check for pending review when component mounts or auth state changes
        const checkPendingReview = async () => {
            const pendingReview = sessionStorage.getItem('pendingReview');
            const shouldProcessReview = location.state?.processPendingReview;

            console.log('Checking for pending review:', {
                isAuthenticated,
                hasUser: !!user,
                userId: user?.id,
                hasPendingReview: !!pendingReview,
                shouldProcessReview,
                locationState: location.state
            });

            if (pendingReview && isAuthenticated && user?.id && shouldProcessReview) {
                try {
                    const reviewData = JSON.parse(pendingReview);
                    console.log('Found pending review to process:', reviewData);

                    // Clear the pending review before processing to prevent loops
                    sessionStorage.removeItem('pendingReview');

                    // Submit the review
                    await submitPendingReview({
                        ...reviewData,
                        userId: user.id
                    });

                    // Clear the location state
                    window.history.replaceState({}, document.title);
                } catch (error) {
                    console.error('Error processing pending review:', error);
                    if (error.response?.status === 401) {
                        // If unauthorized, save review data again
                        sessionStorage.setItem('pendingReview', pendingReview);
                        navigate('/login', {
                            state: {
                                from: '/',
                                scrollToReviews: true
                            }
                        });
                    } else {
                        alert('Error submitting review. Please try again.');
                    }
                }
            }
        };

        checkPendingReview();
    }, [isAuthenticated, user, location.state?.processPendingReview]);

    const fetchReviews = async () => {
        try {
            const reviewsData = await getLatestReviews();
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            if (error.response?.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token');
                navigate('/login', { state: { from: '/' } });
            }
        }
    };

    const submitPendingReview = async (reviewData) => {
        try {
            setIsLoading(true);
            console.log('Submitting pending review:', {
                reviewData,
                user,
                isAuthenticated
            });

            const response = await submitReview(reviewData);
            console.log('Review submission successful:', response);

            // Reset form
            setRating(0);
            setComment('');
            setPhoto(null);

            // Show success message
            alert('Review submitted successfully!');

            // Refresh reviews
            await fetchReviews();

            // Scroll to reviews section
            const reviewSection = document.querySelector('.review');
            if (reviewSection) {
                reviewSection.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error submitting pending review:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        console.log('Starting review submission process:', {
            isAuthenticated,
            user,
            hasToken: !!localStorage.getItem('token'),
            token: localStorage.getItem('token'),
            rating,
            hasPhoto: !!photo,
            photoSize: photo ? photo.length : 0
        });

        if (!isAuthenticated || !user || !user.id) {
            console.log('User not properly authenticated:', { isAuthenticated, user });
            // Save review data to sessionStorage before redirecting
            const reviewData = {
                roomId: 1,
                rating,
                comment,
                photo
            };
            sessionStorage.setItem('pendingReview', JSON.stringify(reviewData));
            console.log('Saved review data to sessionStorage:', reviewData);

            alert('Please log in to submit a review');
            navigate('/login', {
                state: {
                    from: '/',
                    scrollToReviews: true
                }
            });
            return;
        }

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!photo) {
            alert('Please upload a photo');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Preparing to submit review with data:', {
                userId: user.id,
                userEmail: user.email,
                isAuthenticated,
                rating,
                commentLength: comment?.length || 0,
                photoSize: photo.length
            });

            const reviewData = {
                userId: user.id,
                roomId: 1,
                rating,
                comment,
                photo
            };

            console.log('Making API request with headers:', {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            });

            await submitReview(reviewData);
            console.log('Review submitted successfully');

            // Reset form
            setRating(0);
            setComment('');
            setPhoto(null);

            // Show success message
            alert('Review submitted successfully!');

            // Refresh reviews
            await fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                userId: user?.id,
                isAuthenticated,
                errorMessage: error.message
            });

            if (error.response?.status === 401) {
                // Save review data and clear auth state
                const reviewData = {
                    roomId: 1,
                    rating,
                    comment,
                    photo
                };
                sessionStorage.setItem('pendingReview', JSON.stringify(reviewData));
                console.log('Saved review data before logout:', reviewData);

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                alert('Please log in again to submit your review.');
                navigate('/login', {
                    state: {
                        from: '/',
                        scrollToReviews: true
                    }
                });
            } else {
                alert('Error submitting review. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Image size should be less than 5MB');
                e.target.value = null;
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                e.target.value = null;
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Create an image element to get dimensions
                const img = new Image();
                img.onload = () => {
                    // Create a canvas to resize the image if needed
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Maximum dimensions
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress image
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setPhoto(compressedBase64);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        // Scroll to reviews section if coming back from login
        if (location.state?.scrollToReviews) {
            const reviewSection = document.querySelector('.review');
            if (reviewSection) {
                reviewSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

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

                    {/* Review Form */}
                    <div className="review-form">
                        <h3>Share Your Experience</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="form-group">
                                <label>Your Photo (Required)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    required
                                />
                                {photo && (
                                    <img
                                        src={photo}
                                        alt="Preview"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            marginTop: '10px',
                                            borderRadius: '50%'
                                        }}
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Rating (Required)</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesomeIcon
                                            key={star}
                                            icon={['fas', (hoverRating || rating) >= star ? 'star' : 'star']}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{
                                                cursor: 'pointer',
                                                color: (hoverRating || rating) >= star ? 'var(--yellow)' : '#e4e5e9',
                                                fontSize: '2rem',
                                                marginRight: '0.5rem',
                                                transition: 'color 200ms'
                                            }}
                                        />
                                    ))}
                                    <span style={{ marginLeft: '1rem', color: 'var(--black)' }}>
                                        {rating ? `${rating} out of 5` : 'Select a rating'}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Comment (Optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    rows="4"
                                />
                            </div>
                            <button
                                type="submit"
                                id="submit-review"
                                className="btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>

                    <div className="review-grid">
                        {reviews.map((review, index) => (
                            <div className="review-card" key={review.id || index}>
                                <img src={review.photo} alt="review-profile" />
                                <div className="star">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon
                                            key={i}
                                            icon={['fas', i < review.rating ? 'fa-star' : 'fa-star-o']}
                                            style={{ color: 'var(--yellow)' }}
                                        />
                                    ))}
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home;