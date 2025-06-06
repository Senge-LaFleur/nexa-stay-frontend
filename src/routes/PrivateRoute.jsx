import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, requiredRole = null }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    // If not authenticated, redirect to login with return path
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // If user is ADMIN, allow access to all routes
    if (user.role === 'ADMIN') {
        return element;
    }

    // If route requires ADMIN role and user is not ADMIN, redirect to rooms
    if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
        return <Navigate to="/rooms" replace />;
    }

    // For client routes or routes without specific role requirements
    return element;
};

export default PrivateRoute; 