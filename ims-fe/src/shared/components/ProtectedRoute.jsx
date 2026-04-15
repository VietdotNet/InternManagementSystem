import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading
  if (loading) {
    return <div>Thinking...</div>;
  }

  // Chưa login → redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Sai role → 403
  if (roles && !roles.includes(user.role)) {
    return <div>403 - Forbidden</div>;
  }

  // OK
  return children;
}