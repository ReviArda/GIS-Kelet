import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if user data exists in localStorage
    const user = JSON.parse(localStorage.getItem('user_data'));

    // Check if user is logged in (simple check)
    // In a real app, you might want to verify token expiration here
    const isAuthenticated = user && user.role === 'admin';

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
