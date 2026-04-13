import { Route, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function ProtectedRoute({ component: Component, roles, ...rest }) {
  const { user, loading } = useAuth();
  const [location, navigate] = useLocation();

  // ✅ redirect trong useEffect
  useEffect(() => {
    if (!loading && !user && location !== "/login") {
      navigate("/login");
    }
  }, [user, loading, location]);

  return (
    <Route
      {...rest}
      component={(params) => {
        if (loading) return <div>Loading...</div>;

        // ❗ không navigate ở đây nữa
        if (!user) return null;

        if (roles && !roles.includes(user.role)) {
          return <div>403 - Forbidden</div>;
        }

        return <Component {...params} />;
      }}
    />
  );
}