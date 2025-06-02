import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const login = async (email, motDePasse) => {
    try {
        console.log('Sending login request for:', email); // Debug log

        const response = await apiClient.post(`${API_CONFIG.AUTH_SERVICE}/login`, {
            email,
            motDePasse
        });

        console.log('Full login response:', response.data); // Debug log

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);

            // Make sure we're getting the role from the correct response property
            const userRole = response.data.role || response.data.user?.role;
            console.log('Extracted user role:', userRole); // Debug log

            if (userRole) {
                localStorage.setItem('userRole', userRole);
            }
        }
        return response.data;
    } catch (error) {
        console.error('Login error in API:', error.response?.data || error); // Debug log
        throw error.response?.data || { message: 'An error occurred during login' };
    }
};

export const register = async (userData) => {
    try {
        // Transform the userData to match backend expectations
        const registerData = {
            nom: userData.name,
            email: userData.email,
            motDePasse: userData.password
        };

        console.log('Sending registration request:', registerData);

        const response = await apiClient.post(`${API_CONFIG.AUTH_SERVICE}/register`, registerData);

        console.log('Registration response:', response.data);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.role) {
                localStorage.setItem('userRole', response.data.role);
            }
        }
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response || error);
        if (error.response?.data) {
            throw error.response.data;
        } else if (error.message) {
            throw { message: error.message };
        } else {
            throw { message: 'An error occurred during registration' };
        }
    }
};

export const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
};

export const checkAuthStatus = async () => {
    try {
        const response = await apiClient.get(`${API_CONFIG.AUTH_SERVICE}/status`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error checking auth status' };
    }
};

export const getUserRole = () => {
    return localStorage.getItem('userRole');
};
