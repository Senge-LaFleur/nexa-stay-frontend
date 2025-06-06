import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8081', // API Gateway URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Client: Preparing request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 10)}...` : null,
            headers: {
                ...config.headers,
                Authorization: token ? 'Bearer [TOKEN]' : 'None'
            }
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

// Add a response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Client: Response received:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            hasData: !!response.data
        });
        return response;
    },
    async (error) => {
        console.error('API Client: Request failed:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            console.log('API Client: Unauthorized error detected, clearing auth state');
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if we're not already on the login page
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient; 
