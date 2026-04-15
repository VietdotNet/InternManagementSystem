import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        // Không gọi API ở trang public
        if (location.pathname === "/login") {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const me = await getCurrentUser();

        if (isMounted) {
          setUser({
            email: me.email,
            name: me.name,
            role: me.roleName,
          });
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);