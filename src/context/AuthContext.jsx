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

        console.log('AuthProvider: Checking stored credentials:', {
            hasStoredUser: !!storedUser,
            hasToken: !!token
        });

        if (storedUser && token) {
            try {
                const userData = JSON.parse(storedUser);
                console.log('AuthProvider: Parsed stored user data:', userData);

                if (!userData || !userData.id) {
                    console.error('AuthProvider: Invalid user data in localStorage');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    return;
                }

                // Set default Authorization header for all requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Update auth state
                setUser(userData);
                setIsAuthenticated(true);

                console.log('AuthProvider: Successfully restored auth state:', {
                    userId: userData.id,
                    isAuthenticated: true
                });
            } catch (error) {
                console.error('AuthProvider: Error restoring auth state:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            console.log('AuthProvider: Attempting login for:', email);
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                motDePasse: password
            });

            console.log('AuthProvider: Login response:', response.data);
            const { token, role, name, id } = response.data;

            if (!id) {
                throw new Error('User ID missing from login response');
            }

            // Store auth data
            const userData = {
                id,
                email,
                role,
                name
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Set default Authorization header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Update auth state
            setUser(userData);
            setIsAuthenticated(true);

            console.log('AuthProvider: Login successful:', {
                userId: id,
                isAuthenticated: true
            });

            return response.data;
        } catch (error) {
            console.error('AuthProvider: Login error:', error);
            // Clear any invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const logout = () => {
        console.log('AuthProvider: Logging out');
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