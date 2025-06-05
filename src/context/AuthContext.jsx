import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        console.log('Initial localStorage check:', {
            hasStoredUser: !!storedUser,
            hasToken: !!token
        });

        if (storedUser && token) {
            try {
                const userData = JSON.parse(storedUser);
                console.log('Parsed user data from localStorage:', userData);

                if (!userData || !userData.id) {
                    console.error('Invalid user data in localStorage');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    return;
                }

                setUser(userData);
                setIsAuthenticated(true);
                // Set default Authorization header for all requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log('Successfully restored auth state:', {
                    userId: userData.id,
                    isAuthenticated: true
                });
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login for:', email);
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                motDePasse: password
            });

            console.log('Login response:', response.data);
            const { token, role, name, id } = response.data;

            if (!id) {
                throw new Error('User ID missing from login response');
            }

            // Store both token and user data
            localStorage.setItem('token', token);
            const userData = {
                id,
                email,
                role,
                name
            };
            console.log('Storing user data:', userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Set default Authorization header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            setIsAuthenticated(true);

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            // Clear any invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 