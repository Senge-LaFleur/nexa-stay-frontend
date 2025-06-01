// API Base URLs for different microservices
export const API_CONFIG = {
    AUTH_SERVICE: 'http://localhost:8081/api/auth',
    ROOM_SERVICE: 'http://localhost:8082/api/rooms',
    BOOKING_SERVICE: 'http://localhost:8083/api/bookings',
    USER_SERVICE: 'http://localhost:8084/api/users'
};

// Common headers
export const COMMON_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}; 