import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar/sidebar.jsx'
import Navbar2 from '../../components/navbar2/navbar2.jsx';
import bedroom1 from '../../assets/images/bedroom1.jpg'
import './roomsTable.css'
import { createRoom, getAllRooms, getRoomsByType, getRoomsByPrice, getRoomsByCapacity, deleteRoom, updateRoom } from '../../api/roomApi';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);

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

    const handleEditClick = (room) => {
        setEditingRoom({
            ...room,
            image: null // Reset image since we don't want to send the URL as file
        });
        setEditImagePreview(room.imageUrl);
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value, type } = e.target;
        setEditingRoom(prev => ({
            ...prev,
            [name]: type === 'number' && name !== 'name' ? Number(value) : value
        }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                e.target.value = null;
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                e.target.value = null;
                return;
            }

            setEditingRoom(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!editingRoom.name.trim()) {
            alert('Room name is required');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', editingRoom.name);
            formData.append('type', editingRoom.type);
            formData.append('description', editingRoom.description);
            formData.append('price', editingRoom.price);
            formData.append('capacity', editingRoom.numberOfBeds);
            formData.append('status', editingRoom.status);

            if (editingRoom.image instanceof File) {
                formData.append('image', editingRoom.image);
            }

            const response = await updateRoom(editingRoom.id, formData);

            if (response.message === "Success") {
                await fetchRooms();
                setShowEditModal(false);
                setEditingRoom(null);
                alert('Room updated successfully! ✅');
            } else {
                throw new Error(response.message || 'Failed to update room');
            }
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="roomsTable" id="roomsTable">
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
                    <h2 className="section-header">Rooms</h2>
                    <div className="date">
                        <input type="date" />
                    </div>

                    {/* Room Creation Form */}
                    <div className="create-room-section">
                        <h3>Create A New Room</h3>
                        <form onSubmit={handleSubmit} className="create-room-form">
                            <div className="form-row">
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
                            <div className="form-row">
                                <input
                                    type="number"
                                    name="numberOfBeds"
                                    value={newRoom.numberOfBeds}
                                    onChange={handleInputChange}
                                    placeholder="Number of beds"
                                    min="1"
                                    required
                                />
                                <div className="image-upload-container">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required
                                        className="image-input"
                                    />
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Room preview" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
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
                            <button type="submit" className="btn">Create Room</button>
                        </form>
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>All NexaStay Rooms</h3>
                                <div className="table-actions">
                                    <span onClick={handleSearchClick}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </span>
                                    <span onClick={handleFilterClick}>
                                        <FontAwesomeIcon icon={faFilter} />
                                    </span>
                                </div>
                            </div>

                            {showSearch && (
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search rooms..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}

                            {showFilters && (
                                <div className="filter-section">
                                    <div className="filter-row">
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

                                        <button onClick={clearFilters} className="clear-filters">
                                            <FontAwesomeIcon icon={faTimes} /> Clear Filters
                                        </button>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="loading-message">Loading rooms...</div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
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
                                                <td colSpan="8" className="empty-message">
                                                    No rooms available. Use the form above to create a new room.
                                                </td>
                                            </tr>
                                        ) : filteredRooms.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="empty-message">
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
                                                                src={`http://localhost:8081${room.imageUrl}`}
                                                                alt={`Room ${room.name}`}
                                                                className="room-table-image"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEditClick(room)}
                                                            title="Edit Room"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
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

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Room</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingRoom.name}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type:</label>
                                <select
                                    name="type"
                                    value={editingRoom.type}
                                    onChange={handleEditInputChange}
                                >
                                    <option value="STANDARD">Standard</option>
                                    <option value="DELUXE">Deluxe</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={editingRoom.description}
                                    onChange={handleEditInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editingRoom.price}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Capacity:</label>
                                <input
                                    type="number"
                                    name="numberOfBeds"
                                    value={editingRoom.capacity}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status:</label>
                                <select
                                    name="status"
                                    value={editingRoom.status}
                                    onChange={handleEditInputChange}
                                >
                                    <option value="AVAILABLE">Available</option>
                                    <option value="OCCUPIED">Occupied</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                    <option value="CLEANING">Cleaning</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                />
                                {editImagePreview && (
                                    <img
                                        src={editImagePreview}
                                        alt="Room preview"
                                        className="image-preview"
                                        style={{ maxWidth: '200px', marginTop: '10px' }}
                                    />
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn btn">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn btn"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingRoom(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RoomsTable;
