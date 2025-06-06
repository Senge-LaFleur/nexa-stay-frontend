import axios from 'axios';
import { SERVICE_URLS } from '../config/apiConfig';

// Create API clients for different services
export const authClient = axios.create({
    baseURL: SERVICE_URLS.AUTH_SERVICE,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const roomClient = axios.create({
    baseURL: SERVICE_URLS.ROOM_SERVICE,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to both clients
const addRequestInterceptor = (client) => {
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            console.log('API Client: Preparing request:', {
                url: config.url,
                method: config.method,
                hasToken: !!token,
                hasUser: !!user,
                tokenPreview: token ? `${token.substring(0, 10)}...` : null
            });

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            console.error('API Client: Request preparation failed:', {
                message: error.message,
                config: error.config
            });
            return Promise.reject(error);
        }
    );
};

// Add response interceptor to both clients
const addResponseInterceptor = (client) => {
    client.interceptors.response.use(
        (response) => {
            console.log('API Client: Response received:', {
                url: response.config.url,
                status: response.status,
                statusText: response.statusText,
                hasData: !!response.data
            });
            return response;
        },
        async (error) => {
            console.error('API Client: Request failed:', {
                url: error.config?.url,
                status: error.response?.status,
                statusText: error.response?.statusText,
                message: error.message
            });

            if (error.response?.status === 401) {
                console.log('API Client: Unauthorized error detected, clearing auth state');

                // Clear auth state
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Force reload the page to reset all auth states
                window.location.reload();
            }
            return Promise.reject(error);
        }
    );
};

// Add interceptors to both clients
addRequestInterceptor(authClient);
addRequestInterceptor(roomClient);
addResponseInterceptor(authClient);
addResponseInterceptor(roomClient);

export default roomClient; // Default export for backward compatibility 
