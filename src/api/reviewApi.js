import apiClient from './apiClient';
import { API_CONFIG } from '../config/apiConfig';

export const submitReview = async (reviewData) => {
    try {
        // Log the size of the photo data
        const photoSize = reviewData.photo ? Math.round(reviewData.photo.length / 1024) : 0;
        console.log('Attempting to submit review:', {
            userId: reviewData.userId,
            roomId: reviewData.roomId,
            rating: reviewData.rating,
            commentLength: reviewData.comment?.length || 0,
            photoSize: `${photoSize}KB`
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

        // Send the request
        const response = await apiClient.post(API_CONFIG.REVIEW_SERVICE, {
            userId: reviewData.userId,
            roomId: reviewData.roomId,
            rating: reviewData.rating,
            comment: reviewData.comment || '',
            photo: reviewData.photo
        });

        console.log('Review submission successful:', {
            id: response.data.id,
            status: response.status,
            statusText: response.statusText
        });

        return response.data;
    } catch (error) {
        console.error('Review submission failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            },
            message: error.message
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
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
        console.log('Fetching latest reviews');
        const response = await apiClient.get(`${API_CONFIG.REVIEW_SERVICE}/latest`);
        console.log('Latest reviews fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching latest reviews:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw error.response?.data || { message: 'Error fetching reviews' };
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