import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { logout } from "../../features/auth/services/authService";
import { useAuth } from "@/shared/context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* truyền pathname thay vì location object */}
        <Header currentPath={location.pathname} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* React Router render child routes tại đây */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;