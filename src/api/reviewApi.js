import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const submitReview = async (reviewData) => {
    try {
        console.log('Review API: Starting review submission:', {
            userId: reviewData.userId,
            roomId: reviewData.roomId,
            rating: reviewData.rating,
            hasComment: !!reviewData.comment,
            hasPhoto: !!reviewData.photo,
            photoSize: reviewData.photo?.length || 0
        });

        const token = localStorage.getItem('token');
        console.log('Review API: Using token:', {
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 10)}...` : null
        });

        // Validate the data before sending
        if (!reviewData.userId || !reviewData.roomId || !reviewData.rating || !reviewData.photo) {
            console.error('Missing required fields:', {
                userId: !!reviewData.userId,
                roomId: !!reviewData.roomId,
                rating: !!reviewData.rating,
                photo: !!reviewData.photo
            });
            throw new Error('Missing required fields');
        }

        if (!token) {
            console.error('No authentication token found');
            throw new Error('Authentication required. Please log in again.');
        }

        // Send the request
        const response = await apiClient.post(API_CONFIG.REVIEW_SERVICE, reviewData);

        console.log('Review API: Submission successful:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });

        return response.data;
    } catch (error) {
        console.error('Review API: Submission failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            stack: error.stack
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Clear invalid auth state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw new Error('Authentication required. Please log in again.');
        } else if (error.response?.status === 409) {
            throw new Error('You have already reviewed this room.');
        } else if (error.response?.status === 413) {
            throw new Error('The uploaded photo is too large. Please use a smaller image.');
        } else if (error.response?.status === 400) {
            throw new Error('Invalid review data. Please check all fields and try again.');
        }

        throw error.response?.data || { message: 'Error submitting review. Please try again.' };
    }
};

export const getLatestReviews = async () => {
    try {
        console.log('Review API: Fetching latest reviews');
        const response = await apiClient.get(`${API_CONFIG.REVIEW_SERVICE}/latest`);
        console.log('Review API: Fetch successful:', {
            status: response.status,
            reviewCount: response.data?.length || 0
        });
        return response.data;
    } catch (error) {
        console.error('Review API: Fetch failed:', {
            status: error.response?.status,
            message: error.message
        });
        throw error;
    }
};

export const getRoomReviews = async (roomId) => {
    try {
        console.log(`Fetching reviews for room ${roomId}`);
        const response = await apiClient.get(`${API_CONFIG.REVIEW_SERVICE}/room/${roomId}`);
        console.log('Room reviews fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for room ${roomId}:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw error.response?.data || { message: 'Error fetching room reviews' };
    }
};

export const getUserReviews = async (userId) => {
    try {
        console.log(`Fetching reviews for user ${userId}`);
        const response = await apiClient.get(`${API_CONFIG.REVIEW_SERVICE}/user/${userId}`);
        console.log('User reviews fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for user ${userId}:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw error.response?.data || { message: 'Error fetching user reviews' };
    }
};