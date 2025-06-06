import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/navbar/navbar.jsx';
import './rooms.css';
import { getAllRooms } from '../../api/roomApi';
import { checkRoomAvailability, createReservation } from '../../api/reservationApi';
import { toast } from 'react-toastify';

function Rooms() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        type: '',
        priceRange: '',
        beds: ''
    });
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1
    });
    const [availableRooms, setAvailableRooms] = useState(new Set());

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        filterRooms();
    }, [filters, rooms]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllRooms();
            if (response.message === "Success") {
                setRooms(response.data || []);
                setFilteredRooms(response.data || []);
            } else {
                throw new Error(response.message || 'Failed to fetch rooms');
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setError(error.message || 'Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const filterRooms = () => {
        let result = [...rooms];

        if (filters.type) {
            result = result.filter(room => room.type === filters.type);
        }

        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            result = result.filter(room => {
                const price = Number(room.price);
                if (max) {
                    return price >= min && price <= max;
                } else {
                    return price >= min;
                }
            });
        }

        if (filters.beds) {
            result = result.filter(room => room.capacity === Number(filters.beds));
        }

        setFilteredRooms(result);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBookingDataChange = (e) => {
        const { id, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [id === 'guest' ? 'guests' : id === 'check-in' ? 'checkIn' : 'checkOut']: value
        }));
    };

    const handleCheckAvailability = async (e) => {
        e.preventDefault();

        if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.guests) {
            toast.error('Please fill in all booking details');
            return;
        }

        const checkInDate = new Date(bookingData.checkIn);
        const checkOutDate = new Date(bookingData.checkOut);

        if (checkInDate >= checkOutDate) {
            toast.error('Check-out date must be after check-in date');
            return;
        }

        setLoading(true);
        const availableRoomIds = new Set();

        try {
            await Promise.all(filteredRooms.map(async (room) => {
                try {
                    const response = await checkRoomAvailability(
                        room.id,
                        bookingData.checkIn,
                        bookingData.checkOut
                    );
                    if (response.available && room.capacity >= bookingData.guests) {
                        availableRoomIds.add(room.id);
                    }
                } catch (error) {
                    console.error(`Error checking availability for room ${room.id}:`, error);
                }
            }));

            setAvailableRooms(availableRoomIds);

            if (availableRoomIds.size > 0) {
                toast.success(`Found ${availableRoomIds.size} available rooms for your dates! 🎉`);
            } else {
                toast.info('No rooms available for the selected dates. Try different dates or adjust your search.');
            }
        } catch (error) {
            toast.error('Error checking room availability');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = async (roomId) => {
        // Check if dates are selected
        if (!bookingData.checkIn || !bookingData.checkOut) {
            toast.warning('Please select check-in and check-out dates first');
            return;
        }

        // Check if user is authenticated
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            // Save booking data to localStorage
            localStorage.setItem('pendingBooking', JSON.stringify({
                roomId,
                ...bookingData
            }));
            // Redirect to login
            navigate('/login');
            return;
        }

        try {
            // Check availability before proceeding with booking
            const availabilityResponse = await checkRoomAvailability(
                roomId,
                bookingData.checkIn,
                bookingData.checkOut
            );

            if (!availabilityResponse.available) {
                toast.error('Sorry, this room is no longer available for the selected dates');
                return;
            }

            const response = await createReservation({
                userId: user.id,
                roomId,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut,
                numberOfGuests: bookingData.guests
            });

            if (response) {
                toast.success('Booking successful! 🎉');
                // Clear booking data
                setBookingData({
                    checkIn: '',
                    checkOut: '',
                    guests: 1
                });
                setAvailableRooms(new Set());

                // Redirect to reservations page
                navigate('/reservation');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            toast.error(error.message || 'Error creating reservation');
        }
    };

    return (
        <div className="rooms">
            <section className="room-header">
                <Navbar />
                <div className="section-container room-header-container" id="room-header">
                    <p>Rest - Recharge - Repeat</p>
                    <h1>Nexa Stay Rooms</h1>
                </div>
            </section>

            <section className="section-container booking-container">
                <form onSubmit={handleCheckAvailability} className="booking-form">
                    <div className="input-group">
                        <span><FontAwesomeIcon icon={faCalendarAlt} /></span>
                        <div>
                            <label htmlFor="check-in">CHECK-IN</label>
                            <input
                                type="date"
                                id="check-in"
                                value={bookingData.checkIn}
                                onChange={handleBookingDataChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <span><FontAwesomeIcon icon={faCalendarAlt} /></span>
                        <div>
                            <label htmlFor="check-out">CHECK-OUT</label>
                            <input
                                type="date"
                                id="check-out"
                                value={bookingData.checkOut}
                                onChange={handleBookingDataChange}
                                min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <span><FontAwesomeIcon icon={faUser} /></span>
                        <div>
                            <label htmlFor="guest">GUESTS</label>
                            <input
                                type="number"
                                id="guest"
                                value={bookingData.guests}
                                onChange={handleBookingDataChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group input-btn">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Checking...' : 'CHECK AVAILABILITY'}
                        </button>
                    </div>
                </form>
            </section>

            <section className="section-container room-container" id="room">
                <div className="intro">
                    <div className="title">
                        <p className="section-subheader">OUR BEDROOMS</p>
                        <h2 className="section-header">The Most Memorable Rest Time Starts Here.</h2>
                    </div>
                    <p className="section-description">
                        Relax in our spacious, business-friendly rooms designed with modern comforts.
                        All rooms come with pillow-top mattresses, flat-screen TVs, ergonomic workspaces,
                        and handicap-accessible options are available.
                    </p>
                </div>

                <div className="filters">
                    <label htmlFor="options">Filter for a Better Selection</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">All Types</option>
                        <option value="STANDARD">Standard</option>
                        <option value="DELUXE">Deluxe</option>
                        <option value="VIP">VIP</option>
                    </select>
                    <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
                        <option value="">All Prices</option>
                        <option value="0-99">Under $100</option>
                        <option value="100-199">$100 - $199</option>
                        <option value="200-299">$200 - $299</option>
                        <option value="300-399">$300 - $399</option>
                        <option value="400">$400 and above</option>
                    </select>
                    <select name="beds" value={filters.beds} onChange={handleFilterChange}>
                        <option value="">All Beds</option>
                        <option value="1">1 Bed</option>
                        <option value="2">2 Beds</option>
                        <option value="3">3 Beds</option>
                    </select>
                </div>

                <div className="room-grid">
                    {loading ? (
                        <div className="loading-message">Loading rooms...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="empty-message">No rooms match your selected filters.</div>
                    ) : (
                        filteredRooms.map(room => (
                            <div className="room-card" key={room.id}>
                                <div className="room-card-image">
                                    <img src={`http://localhost:8081${room.imageUrl}`} alt={room.name} />
                                </div>
                                <div className="room-card-details">
                                    <h4>{room.name}</h4>
                                    <p>{room.description}</p>
                                    <h5>Starting from <span>${room.price}/night</span></h5>
                                    <button
                                        className="btn" id="book-now-btn"
                                        onClick={() => handleBookNow(room.id)}
                                        disabled={!bookingData.checkIn || !bookingData.checkOut}
                                    >
                                        {!bookingData.checkIn || !bookingData.checkOut ? 'Select Dates to Book' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Rooms;