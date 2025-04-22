import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {

        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    return children;
}

export default ProtectedRoute;