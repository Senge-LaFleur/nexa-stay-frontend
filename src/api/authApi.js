import { authClient } from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const login = async (email, motDePasse) => {
    try {
        const response = await authClient.post(`${API_CONFIG.AUTH_SERVICE}/login`, {
            email,
            motDePasse
        });

        const { token, role, id, name } = response.data;

        if (!token || !id) {
            throw new Error('Invalid response from server');
        }

        // Store auth data
        const userData = { id, email, role, name };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        // Clear any existing invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error.response?.data || { message: 'An error occurred during login' };
    }
};

export const register = async (userData) => {
    try {
        const registerData = {
            nom: userData.name,
            email: userData.email,
            motDePasse: userData.password,
            role: userData.role || 'CLIENT'
        };

        const response = await authClient.post(`${API_CONFIG.AUTH_SERVICE}/register`, registerData);

        const { token, role, id, name } = response.data;

        if (!token || !id) {
            throw new Error('Invalid response from server');
        }

        // Store auth data
        const newUserData = { id, email: userData.email, role, name };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUserData));

        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error.response?.data || { message: 'An error occurred during registration' };
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const checkAuthStatus = async () => {
    try {
        const response = await authClient.get(`${API_CONFIG.AUTH_SERVICE}/status`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        throw error.response?.data || { message: 'Error checking auth status' };
    }
};

export const getUserRole = () => {
    return localStorage.getItem('userRole');
};
