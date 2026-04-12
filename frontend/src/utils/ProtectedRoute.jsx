import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContent } from './AuthContext';
import Loading from '../components/Loading';

const ProtectedRoute = ({ children, allowRoles = [] }) => {
    const { user, loading } = useContext(AuthContent);

    if (loading)
        return <Loading loading={loading} />

    if (!user) return <Navigate to='/admin/login' replace />;

    if (allowRoles.length > 0) {
        const hasPermission = allowRoles.some(roleName => user[roleName] === true);
        if (!hasPermission) return <Navigate to='/403' replace />;
    }
    return children;
};

export default ProtectedRoute;