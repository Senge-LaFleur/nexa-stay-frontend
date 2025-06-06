import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../api/apiClient';
import { API_CONFIG } from '../config/apiConfig';

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
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                console.log('AuthProvider: Checking stored credentials:', {
                    hasStoredUser: !!storedUser,
                    hasToken: !!token
                });

                if (storedUser && token) {
                    const userData = JSON.parse(storedUser);
                    if (userData && userData.id) {
                        setUser(userData);
                        setIsAuthenticated(true);
                        authClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                        console.log('AuthProvider: Restored auth state:', {
                            userId: userData.id,
                            role: userData.role,
                            isAuthenticated: true
                        });
                    } else {
                        clearAuthState();
                    }
                }
            } catch (error) {
                console.error('AuthProvider: Error initializing auth:', error);
                clearAuthState();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const clearAuthState = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete authClient.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const login = async (email, password) => {
        try {
            console.log('AuthProvider: Attempting login for:', email);

            const response = await authClient.post(`${API_CONFIG.AUTH_SERVICE}/login`, {
                email,
                motDePasse: password
            });

            const { token, role, name, id } = response.data;

            if (!token || !id) {
                throw new Error('Invalid response from server');
            }

            // Create user data object
            const userData = { id, email, role, name };

            // Store auth data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update axios default headers
            authClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            console.log('AuthProvider: Login successful:', {
                userId: id,
                role,
                isAuthenticated: true
            });

            return response.data;
        } catch (error) {
            console.error('AuthProvider: Login error:', error);
            clearAuthState();
            throw error.response?.data || error;
        }
    };

    const logout = () => {
        console.log('AuthProvider: Logging out');
        clearAuthState();
        window.location.href = '/login';
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}; 