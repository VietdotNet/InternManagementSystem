import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus, Search, Trash2, MoreVertical, Mail, Briefcase, ChevronDown, Users, GraduationCap,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { store } from "../../../shared/store/mockData";
import { useUsers } from "../hooks/useUsers";
import StatusBadge from "../../../shared/components/StatusBadge";

const ROLE_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "intern", label: "Intern" },
  { value: "mentor", label: "Mentor" },
];

function AvatarCell({ avatar, name }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
        {avatar}
      </div>
      <span className="text-sm font-semibold text-slate-700 truncate">{name}</span>
    </div>
  );
}

function UserRow({ user, onDelete, onToggleStatus }) {
  const [showMenu, setShowMenu] = useState(false);
  const program = user.programId ? store.getProgramById(user.programId) : null;

  return (
    <tr className="hover:bg-slate-50/60 transition-colors group">
      <td className="px-5 py-3.5">
        <AvatarCell avatar={user.avatar} name={user.name} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Mail className="w-3.5 h-3.5 text-slate-300" />
          {user.email}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={user.role} />
      </td>
      <td className="px-5 py-3.5">
        {program ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            {program.name}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        {user.position ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <Briefcase className="w-3.5 h-3.5 text-slate-300" />
            {user.position}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs text-slate-400">{user.createdAt}</span>
      </td>
      <td className="px-5 py-3.5">
        <div className="relative flex justify-end">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1 overflow-hidden">
              <button
                onClick={() => { onToggleStatus(user.id); setShowMenu(false); }}
                className="w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 text-left"
              >
                {user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => { if (confirm(`Xóa tài khoản "${user.name}"?`)) { onDelete(user.id); setShowMenu(false); } }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tài khoản
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-20 text-center">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Không có người dùng nào</h3>
          <p className="text-xs text-slate-400 mb-5">Thêm intern hoặc mentor để bắt đầu</p>
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tạo tài khoản
          </button>
        </div>
      </td>
    </tr>
  );
}

function UsersPage() {
  const navigate = useNavigate();
  const { users, loading, deleteUser, toggleStatus } = useUsers();
  const [search, setSearch] = useState("");
  const [roleTab, setRoleTab] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleTab === "all" || u.role === roleTab;
    return matchSearch && matchRole;
  });

  const counts = {
    all: users.length,
    intern: users.filter((u) => u.role === "intern").length,
    mentor: users.filter((u) => u.role === "mentor").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Tìm người dùng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
            />
          </div>
        </div>
        <button
          onClick={() => navigate("/users/create")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tạo tài khoản
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleTab(tab.value)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              roleTab === tab.value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-semibold",
              roleTab === tab.value ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"
            )}>
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Họ & Tên</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Vai trò</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Chương trình</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Vị trí</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Ngày tạo</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <EmptyState onCreateClick={() => navigate("/users/create")} />
              ) : (
                filtered.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={deleteUser}
                    onToggleStatus={toggleStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số <strong className="text-slate-600">{users.length}</strong> người dùng
          </span>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
