import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            const { from, scrollToReviews } = location.state || { from: '/', scrollToReviews: false };
            navigate(from, { state: { scrollToReviews } });
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    // ... rest of the component code ...
}

export default Login; 