import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowRoles }) => {
    const user = JSON.parse(localStorage.getItem("authUser"))
    if (!user)
        return <Navigate to='/admin/login' replace />
    else if (user && !allowRoles)
        return <Navigate to='/403' replace />
    return children
}

export default ProtectedRoute;
