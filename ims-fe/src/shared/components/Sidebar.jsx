import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { APP_NAME } from "../constants/app";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  LogOut,
  ChevronRight,
  Settings,
  PlusCircle,
  UserPlus,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Tổng quan",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "Chương trình đào tạo",
    items: [
      { icon: BookOpen, label: "Danh sách chương trình", href: "/programs" },
      { icon: PlusCircle, label: "Tạo chương trình", href: "/programs/create" },
    ],
  },
  {
    label: "Người dùng",
    items: [
      { icon: Users, label: "Danh sách người dùng", href: "/users" },
      { icon: UserPlus, label: "Tạo tài khoản", href: "/users/create" },
    ],
  },
  {
    label: "Báo cáo",
    items: [
      { icon: BarChart3, label: "Thống kê", href: "/statistics" },
    ],
  },
];

function NavItem({ icon: Icon, label, href }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
          isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "w-4 h-4",
              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
            )}
          />
          <span className="flex-1 truncate">{label}</span>
          {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ onLogout }) {
 const navigate = useNavigate();
 const location = useLocation();
 const pathname = location.pathname;

 function isActive(href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/";
  }

  if (href === "/programs/create") {
    return pathname === "/programs/create";
  }

  if (href === "/programs") {
    return pathname === "/programs";
  }

  if (href === "/users/create") {
    return pathname === "/users/create";
  }

  if (href === "/users") {
    return pathname === "/users";
  }

  return pathname.startsWith(href);
}

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 h-full">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">{APP_NAME}</div>
            <div className="text-xs text-slate-400">Quản trị hệ thống</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{group.label}</span>
            </div>
            {group.items.map((item) => (
              <NavItem key={item.href} {...item} active={isActive(item.href)} />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all text-left">
          <Settings className="w-4 h-4 text-slate-400" />
          Cài đặt
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
