import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const login = async (email, password) => {
    try {
        const response = await apiClient.post(`${API_CONFIG.AUTH_SERVICE}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred during login' };
    }
};

export const signup = async (userData) => {
    try {
        const response = await apiClient.post(`${API_CONFIG.AUTH_SERVICE}/signup`, userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred during signup' };
    }
};

export const logout = async () => {
    localStorage.removeItem('token');
};

export const checkAuthStatus = async () => {
    try {
        const response = await apiClient.get(`${API_CONFIG.AUTH_SERVICE}/status`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error checking auth status' };
    }
};
