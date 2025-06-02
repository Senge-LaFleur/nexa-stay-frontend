import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/navbar/navbar.jsx';
import './rooms.css';
import { getAllRooms } from '../../api/roomApi';

function Rooms() {
    const [filters, setFilters] = useState({
        type: '',
        priceRange: '',
        beds: ''
    });
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    // Apply filters whenever filters or rooms change
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
                setFilteredRooms(response.data || []); // Initialize filtered rooms with all rooms
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

        // Filter by room type
        if (filters.type) {
            result = result.filter(room => room.type === filters.type);
        }

        // Filter by price range
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            result = result.filter(room => {
                const price = Number(room.price);
                if (max) {
                    return price >= min && price <= max;
                } else {
                    // Handle cases like "400" (400 and above)
                    return price >= min;
                }
            });
        }

        // Filter by number of beds
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
                <form action="/" className="booking-form">
                    <div className="input-group">
                        <span><FontAwesomeIcon icon={faCalendarAlt} /></span>
                        <div>
                            <label htmlFor="check-in">CHECK-IN</label>
                            <input type="date" id="check-in" placeholder="Check In" />
                        </div>
                    </div>
                    <div className="input-group">
                        <span><FontAwesomeIcon icon={faCalendarAlt} /></span>
                        <div>
                            <label htmlFor="check-out">CHECK-OUT</label>
                            <input type="date" id="check-out" placeholder="Check Out" />
                        </div>
                    </div>
                    <div className="input-group">
                        <span><FontAwesomeIcon icon={faUser} /></span>
                        <div>
                            <label htmlFor="guest">GUESTS</label>
                            <input type="number" id="guest" placeholder="Guests" min="1" />
                        </div>
                    </div>
                    <div className="input-group input-btn">
                        <button className="btn">CHECK AVAILABILITY</button>
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
                                    <img src={`http://localhost:8085${room.imageUrl}`} alt={room.name} />
                                </div>
                                <div className="room-card-details">
                                    <h4>{room.name}</h4>
                                    <p>{room.description}</p>
                                    <h5>Starting from <span>${room.price}/night</span></h5>
                                    <button className="btn">Book Now</button>
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