import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter"; 
import { getCurrentUser } from "../utils/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation(); // lấy route hiện tại

  useEffect(() => {
    async function fetchUser() {
      try {
        if (location === "/login" || location === "/") {
          setLoading(false);
          setUser(null);
          return;
        }

        const me = await getCurrentUser();

        setUser({
          email: me.email,
          name: me.name,
          role: me.roleName
        });

      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [location]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);