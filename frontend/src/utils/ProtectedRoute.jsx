import { useContext } from "react";
import { AuthContent } from "./AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children, allowRoles = [] }) => {
    const { loading, token, setReload, user } = useContext(AuthContent);

    if (loading)
        return <Loading loading={loading} />;

    if (allowRoles.length > 0) {
        const hasPermission = allowRoles.some(role => user?.[role] === true);
        if (!hasPermission) return <Navigate to="/403" replace />;
    }

    return children;
};

export default ProtectedRoute