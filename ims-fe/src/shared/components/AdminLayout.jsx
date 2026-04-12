import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { logout } from "../../features/auth/services/authService";

function AdminLayout({ children }) {
  const [location, navigate] = useLocation();

//   function handleLogout() {
//     navigate("/login");
//   }

  const handleLogout = async () => {
    try {
      await logout(); 
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentPath={location} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
