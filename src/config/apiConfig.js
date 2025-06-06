// API Base URLs for different microservices
export const API_CONFIG = {
    AUTH_SERVICE: '/api/auth',
    ROOM_SERVICE: '/api/rooms',
    RESERVATION_SERVICE: '/api/reservations',
    USER_SERVICE: '/api/users',
    REVIEW_SERVICE: '/api/reviews'
};

// API Base URLs for different services
export const SERVICE_URLS = {
    AUTH_SERVICE: 'http://localhost:8080',
    ROOM_SERVICE: 'http://localhost:8085',
};

// Common headers
export const COMMON_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}; 