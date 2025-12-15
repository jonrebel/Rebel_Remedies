import { Navigate } from "react-router-dom";
import { getAccessToken } from "./auth";

export default function ProtectedRoute({ children }) {
    const token = getAccessToken();
    if (!token) return <Navigate to="/login" replace />;
    return children;
}
