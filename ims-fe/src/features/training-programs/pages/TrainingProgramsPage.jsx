import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, MoreVertical, Trash2, Edit2, BookOpen, CalendarDays, Users,
  ChevronDown, Filter,
} from "lucide-react";

import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import StatusBadge from "../../../shared/components/StatusBadge";

function EmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">Chưa có chương trình nào</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-xs">Bắt đầu bằng cách tạo chương trình đào tạo đầu tiên của bạn</p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Tạo chương trình
      </button>
    </div>
  );
}

function ProgramCard({ program, onDelete, onStatusChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const mentors = program.mentors || [];
  // const interns = store.getInterns().filter((i) => i.programId === program.id);

  const statusOptions = [
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "active", label: "Đang hoạt động" },
    { value: "completed", label: "Hoàn thành" },
  ].filter((o) => o.value !== program.status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{program.name}</h3>
              <StatusBadge status={program.status} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" />
                {program.startDate} → {program.endDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                {program.internCount} intern · {program.mentorCount} mentor
              </span>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-9 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1 overflow-hidden">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onStatusChange(program.id, opt.value); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    Đặt: {opt.label}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => { if (confirm(`Xóa chương trình "${program.name}"?`)) { onDelete(program.id); setShowMenu(false); } }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa chương trình
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {program.tracks?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {program.tracks.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
        <div className="flex -space-x-2">

          {mentors.slice(0, 4).map((m) => (
          <div
            key={m.id}
            title={m.fullName}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
          >
            {m.fullName
            ?.split(" ")
            .slice(-2)
            .map(word => word[0])
            .join("")
            .toUpperCase()}
          </div>
          ))}
          {mentors.length === 0 && <span className="text-xs text-slate-400 italic">Chưa có mentor</span>}
        </div>
        {/* <span className="text-xs text-slate-400">Tạo: {program.createdAt}</span> */}
      </div>
    </div>
  );
}

function TrainingProgramsPage() {
  const navigate = useNavigate();
  const { programs, loading, deleteProgram, updateProgramStatus } = useTrainingPrograms();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = programs.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Tìm chương trình..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="completed">Hoàn thành</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={() => navigate("/programs/create")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tạo chương trình
        </button>
      </div>

      <div className="flex gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{filtered.length}</span> chương trình
        {statusFilter !== "all" && <span>· Lọc: <strong>{statusFilter}</strong></span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onCreateClick={() => navigate("/programs/create")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              onDelete={deleteProgram}
              onStatusChange={updateProgramStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainingProgramsPage;
