import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar/sidebar.jsx'
import Navbar2 from '../../components/navbar2/navbar2.jsx';
import bedroom1 from '../../assets/images/bedroom1.jpg'
import './roomsTable.css'
import { createRoom, getAllRooms, getRoomsByType, getRoomsByPrice, getRoomsByCapacity, deleteRoom } from '../../api/roomApi';

function RoomsTable() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        name: '',
        type: 'STANDARD',
        description: '',
        price: '',
        numberOfBeds: '',
        image: null,
        available: true
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        priceRange: '',
        numberOfBeds: '',
        status: ''
    });

    const toggleSidebar = () => {
        setIsSidebarExpanded(prev => !prev);
    };

    useEffect(() => {
        console.log('RoomsTable component mounted');
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
        fetchRooms();
    }, []);

    useEffect(() => {
        const applyFilters = async () => {
            const filtered = await filterRooms();
            setFilteredRooms(filtered);
        };
        applyFilters();
    }, [rooms, searchTerm, filters]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching rooms...');
            const response = await getAllRooms();
            console.log('Rooms response:', response);
            if (response.message === "Success") {
                setRooms(response.data || []);
                console.log('Rooms set:', response.data);
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

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: type === 'number' && name !== 'name' ? Number(value) : value
        }));
    };

    const handleImageChange = (e) => {
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

            setNewRoom(prev => ({
                ...prev,
                image: file
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newRoom.name.trim()) {
            alert('Room name is required');
            return;
        }

        if (!newRoom.image) {
            alert('Please select an image for the room');
            return;
        }

        try {
            setLoading(true);
            console.log('Submitting room data:', {
                name: newRoom.name,
                type: newRoom.type,
                description: newRoom.description,
                price: newRoom.price,
                numberOfBeds: newRoom.numberOfBeds,
                image: newRoom.image
            });

            const response = await createRoom({
                ...newRoom,
                status: 'AVAILABLE'
            });

            console.log('Response:', response);

            // Reset form and preview
            setNewRoom({
                name: '',
                type: 'STANDARD',
                description: '',
                price: '',
                numberOfBeds: '',
                image: null,
                available: true
            });
            setImagePreview(null);

            // Refresh the rooms list
            await fetchRooms();

            alert('Room created successfully! ✅');
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
        if (showFilters) setShowFilters(false);
    };

    const handleFilterClick = () => {
        setShowFilters(!showFilters);
        if (showSearch) setShowSearch(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            priceRange: '',
            numberOfBeds: '',
            status: ''
        });
    };

    const filterRooms = async () => {
        try {
            let filteredRooms = [...rooms]; // Create a copy of the rooms array

            // Apply search term filter
            if (searchTerm) {
                filteredRooms = filteredRooms.filter(room =>
                    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    room.type.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply type filter
            if (filters.type) {
                filteredRooms = filteredRooms.filter(room =>
                    room.type === filters.type
                );
            }

            // Apply price filter
            if (filters.priceRange) {
                const [min, max] = filters.priceRange.split('-').map(Number);
                filteredRooms = filteredRooms.filter(room =>
                    parseFloat(room.price) >= min &&
                    (max ? parseFloat(room.price) <= max : true)
                );
            }

            // Apply beds/capacity filter
            if (filters.numberOfBeds) {
                filteredRooms = filteredRooms.filter(room =>
                    room.capacity === parseInt(filters.numberOfBeds)
                );
            }

            // Apply status filter
            if (filters.status) {
                filteredRooms = filteredRooms.filter(room =>
                    filters.status === 'available'
                        ? room.status === 'AVAILABLE'
                        : room.status === 'UNAVAILABLE'
                );
            }

            return filteredRooms;
        } catch (error) {
            console.error('Error filtering rooms:', error);
            return [];
        }
    };

    const handleDeleteRoom = async (roomId, roomName) => {
        if (window.confirm(`Are you sure you want to delete room "${roomName}"?`)) {
            try {
                setLoading(true);
                await deleteRoom(roomId);
                await fetchRooms(); // Refresh the room list
                alert('Room deleted successfully');
            } catch (error) {
                console.error('Error deleting room:', error);
                alert('Failed to delete room. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div class="roomsTable" id="roomsTable">
            {/* ------------------------------ SIDEBAR ------------------------------- */}
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div
                class={`container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
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
                    <h2 class="section-header">Rooms</h2>
                    <div class="date">
                        <input type="date" />
                    </div>

                    {/* Room Creation Form */}
                    <div class="create-room-section">
                        <h3>Create A New Room</h3>
                        <form onSubmit={handleSubmit} class="create-room-form">
                            <div class="form-row">
                                <input
                                    type="text"
                                    name="name"
                                    value={newRoom.name}
                                    onChange={handleInputChange}
                                    placeholder="Room Name (e.g. Deluxe Suite 101)"
                                    required
                                />
                                <select
                                    name="type"
                                    value={newRoom.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="STANDARD">Standard</option>
                                    <option value="DELUXE">Deluxe</option>
                                    <option value="VIP">VIP</option>
                                </select>
                                <input
                                    type="number"
                                    name="price"
                                    value={newRoom.price}
                                    onChange={handleInputChange}
                                    placeholder="Price per night"
                                    min="0"
                                    required
                                />
                            </div>
                            <div class="form-row">
                                <input
                                    type="number"
                                    name="numberOfBeds"
                                    value={newRoom.numberOfBeds}
                                    onChange={handleInputChange}
                                    placeholder="Number of beds"
                                    min="1"
                                    required
                                />
                                <div class="image-upload-container">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required
                                        class="image-input"
                                    />
                                    {imagePreview && (
                                        <div class="image-preview">
                                            <img src={imagePreview} alt="Room preview" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div class="form-row">
                                <input
                                    type="text"
                                    name="description"
                                    value={newRoom.description}
                                    onChange={handleInputChange}
                                    placeholder="Room description"
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <button type="submit" class="btn">Create Room</button>
                        </form>
                    </div>

                    <div class="table-data">
                        <div class="order">
                            <div class="head">
                                <h3>All NexaStay Rooms</h3>
                                <div class="table-actions">
                                    <span onClick={handleSearchClick}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </span>
                                    <span onClick={handleFilterClick}>
                                        <FontAwesomeIcon icon={faFilter} />
                                    </span>
                                </div>
                            </div>

                            {showSearch && (
                                <div class="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search rooms..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}

                            {showFilters && (
                                <div class="filter-section">
                                    <div class="filter-row">
                                        <select
                                            name="type"
                                            value={filters.type}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Types</option>
                                            <option value="STANDARD">Standard</option>
                                            <option value="DELUXE">Deluxe</option>
                                            <option value="VIP">VIP</option>
                                        </select>

                                        <select
                                            name="priceRange"
                                            value={filters.priceRange}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Prices</option>
                                            <option value="0-99">Under $99</option>
                                            <option value="100-199">$100 - $199</option>
                                            <option value="200-299">$200 - $299</option>
                                            <option value="300-399">$300 - $399</option>
                                            <option value="400">$400 and above</option>
                                        </select>

                                        <select
                                            name="numberOfBeds"
                                            value={filters.numberOfBeds}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Beds</option>
                                            <option value="1">1 Bed</option>
                                            <option value="2">2 Beds</option>
                                        </select>

                                        <select
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Status</option>
                                            <option value="available">Available</option>
                                            <option value="unavailable">Not Available</option>
                                        </select>

                                        <button onClick={clearFilters} class="clear-filters">
                                            <FontAwesomeIcon icon={faTimes} /> Clear Filters
                                        </button>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div class="loading-message">Loading rooms...</div>
                            ) : error ? (
                                <div class="error-message">{error}</div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Room Name</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Number of Beds</th>
                                            <th>Image</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.length === 0 ? (
                                            <tr>
                                                <td colspan="8" className="empty-message">
                                                    No rooms available. Use the form above to create a new room.
                                                </td>
                                            </tr>
                                        ) : filteredRooms.length === 0 ? (
                                            <tr>
                                                <td colspan="8" className="empty-message">
                                                    No rooms match the current filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRooms.map(room => (
                                                <tr key={room.id}>
                                                    <td>{room.name}</td>
                                                    <td>{room.type}</td>
                                                    <td>{room.description}</td>
                                                    <td>${room.price}</td>
                                                    <td>{room.status}</td>
                                                    <td>{room.capacity}</td>
                                                    <td>
                                                        <div className="room-image-container">
                                                            <img
                                                                src={`http://localhost:8085${room.imageUrl}`}
                                                                alt={`Room ${room.name}`}
                                                                className="room-table-image"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteRoom(room.id, room.name)}
                                                            title="Delete Room"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
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
    )
}

export default RoomsTable;
