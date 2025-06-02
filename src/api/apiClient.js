import axios from 'axios';
import { COMMON_HEADERS } from '../config/apiConfig';

// Create axios instance
const apiClient = axios.create({
    headers: COMMON_HEADERS,
    withCredentials: true // Enable credentials for CORS
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData, let the browser handle it
        if (config.method === 'post' && !(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.message === 'Network Error') {
            console.error('Network Error - Please check your connection and API availability');
            throw new Error('Unable to connect to the server. Please check your connection and try again.');
        }

        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });

        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw error;
    }
);

export default apiClient; 
