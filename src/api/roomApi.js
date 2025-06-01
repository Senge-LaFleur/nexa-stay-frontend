import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const getAllRooms = async (params) => {
    const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}`, { params });
    return response.data;
};

export const getRoomById = async (roomId) => {
    const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/${roomId}`);
    return response.data;
};

export const searchRooms = async (searchParams) => {
    const response = await apiClient.get(`${API_CONFIG.ROOM_SERVICE}/search`, { params: searchParams });
    return response.data;
};

export const createRoom = async (roomData) => {
    const response = await apiClient.post(`${API_CONFIG.ROOM_SERVICE}`, roomData);
    return response.data;
};

export const updateRoom = async (roomId, roomData) => {
    const response = await apiClient.put(`${API_CONFIG.ROOM_SERVICE}/${roomId}`, roomData);
    return response.data;
};

export const deleteRoom = async (roomId) => {
    const response = await apiClient.delete(`${API_CONFIG.ROOM_SERVICE}/${roomId}`);
    return response.data;
}; 