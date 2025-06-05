import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, requiredRole = null }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    // If user is ADMIN, allow access to all routes
    if (user?.role === 'ADMIN') {
        return element;
    }

    // If requiredRole is specified and user doesn't have it, redirect to login
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    // If no user is logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, render the protected component
    return element;
};

export default PrivateRoute; 