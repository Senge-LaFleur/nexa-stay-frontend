import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const createReservation = async (reservationData) => {
    try {
        const response = await apiClient.post(`${API_CONFIG.RESERVATION_SERVICE}/api/reservations`, reservationData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating reservation' };
    }
};

export const getUserReservations = async (userId) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.RESERVATION_SERVICE}/api/reservations/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching user reservations' };
    }
};

export const getAllReservations = async () => {
    try {
        const response = await apiClient.get(`${API_CONFIG.RESERVATION_SERVICE}/api/reservations/all`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching all reservations' };
    }
};

export const getUserReservationCount = async (userId) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.RESERVATION_SERVICE}/api/reservations/user/${userId}/count`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching reservation count' };
    }
};

export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
    try {
        const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/api/rooms/${roomId}/availability`, {
            params: { checkIn, checkOut }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error checking room availability' };
    }
}; 