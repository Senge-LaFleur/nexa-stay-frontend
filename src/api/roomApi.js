import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const createRoom = async (roomData) => {
    try {
        const formData = new FormData();

        // Required fields
        formData.append('name', roomData.name);
        formData.append('type', roomData.type);
        formData.append('description', roomData.description);
        formData.append('price', roomData.price);
        formData.append('capacity', roomData.numberOfBeds);
        formData.append('status', 'AVAILABLE');

        // Handle image file
        if (roomData.image instanceof File) {
            formData.append('image', roomData.image);
        }

        // Log the actual values being sent
        console.log('Sending room data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await apiClient.post(`${API_CONFIG.ROOM_SERVICE}/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const getAllRooms = async () => {
    try {
        const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/all`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching rooms' };
    }
};

export const getRoomById = async (id) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/room/${id}/room`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching room' };
    }
};

export const updateRoom = async (id, roomData) => {
    try {
        const response = await apiClient.put(`${API_CONFIG.ROOM_SERVICE}/room/${id}/update`, roomData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating room' };
    }
};

export const deleteRoom = async (id) => {
    try {
        const response = await apiClient.delete(`${API_CONFIG.ROOM_SERVICE}/room/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error.response?.data || { message: 'Error deleting room' };
    }
};

export const getRoomsByType = async (type) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/room/type/${type}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching rooms by type' };
    }
};

export const getRoomsByPrice = async (price) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/room/price/${price}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching rooms by price' };
    }
};

export const getRoomsByCapacity = async (capacity) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/room/capacity/${capacity}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching rooms by capacity' };
    }
};

export const searchRooms = async (searchParams) => {
    const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/search`, { params: searchParams });
    return response.data;
}; 