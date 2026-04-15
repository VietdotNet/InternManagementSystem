import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, BookOpen, GraduationCap, TrendingUp, UserCheck,
  ArrowUpRight, CalendarDays, Clock, ChevronRight, Plus,
} from "lucide-react";
import { store } from "../../../shared/store/mockData";
import StatusBadge from "../../../shared/components/StatusBadge";
import { cn } from "../../../lib/utils";

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className={cn("rounded-2xl p-5 border flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-200", "bg-white border-slate-200")}>
      <div className="flex items-start justify-between">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <ArrowUpRight className="w-3 h-3" />
            {trend}%
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className="text-sm font-medium text-slate-600 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, label, desc, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-150 group text-left w-full"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{label}</div>
        <div className="text-xs text-slate-400">{desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
    </button>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [programs, setPrograms] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    setStats(store.getStats());
    setPrograms(store.getPrograms().slice(0, 3));
    setRecentUsers([...store.getUsers()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
  }, []);

  const STAT_CARDS = [
    { icon: GraduationCap, label: "Thực tập sinh", value: stats.totalInterns, sub: `${stats.activeInterns} đang hoạt động`, color: "bg-indigo-100 text-indigo-600", trend: 12 },
    { icon: Users, label: "Mentor", value: stats.totalMentors, sub: "Người hướng dẫn", color: "bg-purple-100 text-purple-600", trend: 8 },
    { icon: BookOpen, label: "Chương trình", value: stats.totalPrograms, sub: `${stats.activePrograms} đang chạy`, color: "bg-emerald-100 text-emerald-600", trend: 5 },
    { icon: TrendingUp, label: "Sắp diễn ra", value: stats.upcomingPrograms, sub: "Chương trình mới", color: "bg-amber-100 text-amber-600" },
  ];

  const QUICK_ACTIONS = [
    { icon: Plus, label: "Tạo chương trình đào tạo", desc: "Thêm mới chương trình", onClick: () => navigate("/programs/create"), color: "bg-indigo-100 text-indigo-600" },
    { icon: UserCheck, label: "Thêm tài khoản", desc: "Tạo intern hoặc mentor", onClick: () => navigate("/users/create"), color: "bg-purple-100 text-purple-600" },
    { icon: TrendingUp, label: "Xem thống kê", desc: "Báo cáo và phân tích", onClick: () => navigate("/statistics"), color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-800">Chương trình đào tạo</h2>
            </div>
            <button onClick={() => navigate("/programs")} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {programs.map((program) => {
              const mentors = store.getMentors().filter((m) => program.mentorIds?.includes(m.id));
              const interns = store.getInterns().filter((i) => i.programId === program.id);
              return (
                <div key={program.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate("/programs")}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{program.name}</span>
                        <StatusBadge status={program.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {program.startDate} → {program.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {interns.length} intern
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {program.tracks?.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex -space-x-2 flex-shrink-0">
                      {mentors.slice(0, 3).map((m) => (
                        <div key={m.id} title={m.name} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                          {m.avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-800">Thành viên mới</h2>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{user.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  </div>
                  <StatusBadge status={user.role} />
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button onClick={() => navigate("/users")} className="text-xs font-medium text-indigo-600 hover:underline w-full text-center">Xem tất cả người dùng</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-800">Thao tác nhanh</h2>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.label} {...action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
