import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContent } from './AuthContext';

const PublicRoute = ({ children }) => {
    const { user, token } = useContext(AuthContent);
    if (user && token)
        return <Navigate to="/" />;
    return children;
};

export default PublicRoute;