// API Base URLs for different microservices
export const API_CONFIG = {
    AUTH_SERVICE: 'http://localhost:8080/api/auth',
    ROOM_SERVICE: 'http://localhost:8085/api/rooms',
    RESERVATION_SERVICE: 'http://localhost:8086/api/reservations',
    USER_SERVICE: 'http://localhost:8080/api/users',
    REVIEW_SERVICE: 'http://localhost:9090/api/reviews'
};

// Common headers
export const COMMON_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}; 