import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Map, ListChecks } from "lucide-react";
import { mockUser } from "../store/mockData.js";
import { logout } from "../../features/auth/services/authService";
import { useAuth } from "@/shared/context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/intern", icon: LayoutDashboard },
  { label: "Lộ trình đào tạo", path: "/roadmap", icon: Map },
  { label: "Yêu cầu kiểm tra", path: "/reviews", icon: ListChecks },
];

export default function InternLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1e2a3a] text-white flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">
            IMS
          </div>
          <div>
            <p className="font-semibold text-sm">Intern Manager</p>
            <p className="text-xs text-white/50">System</p>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-semibold text-sm">
              {mockUser.avatar}
            </div>
            <div>
              <p className="text-sm font-medium">{mockUser.name}</p>
              <p className="text-xs text-white/50">Intern</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              currentPath === item.path ||
              (item.path !== "/" && currentPath.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-red-600/20"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center">
          <button
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2 className="font-semibold">
            {NAV_ITEMS.find((n) => n.path === currentPath)?.label ||
              NAV_ITEMS.find(
                (n) => n.path !== "/" && currentPath.startsWith(n.path)
              )?.label ||
              "Dashboard"}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ⬇️ cực kỳ quan trọng */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}