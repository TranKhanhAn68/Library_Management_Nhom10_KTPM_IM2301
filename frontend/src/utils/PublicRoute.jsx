import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContent } from './AuthContext';

const PublicRoute = ({ children }) => {
    const { status } = useContext(AuthContent);

    if (status)
        return <Navigate to="/" />;
    return children;
};

export default PublicRoute;