import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, BookOpen, GraduationCap, Award,
  UserCheck, ArrowUpRight, ArrowDownRight, Activity,
} from "lucide-react";
import { store } from "../../../shared/store/mockData";
import StatusBadge from "../../../shared/components/StatusBadge";

const MONTHLY_DATA = [
  { month: "T1", interns: 5, programs: 1 },
  { month: "T2", interns: 8, programs: 1 },
  { month: "T3", interns: 12, programs: 2 },
  { month: "T4", interns: 9, programs: 2 },
  { month: "T5", interns: 15, programs: 3 },
  { month: "T6", interns: 20, programs: 3 },
];

function MiniBarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1 h-14">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className={`w-full rounded-sm transition-all duration-500 ${color}`}
            style={{ height: `${(d.value / max) * 100}%`, minHeight: "4px" }}
          />
          <span className="text-xs text-slate-400 truncate">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function StatBigCard({ icon: Icon, label, value, change, changeType, color, bgColor }) {
  const isPositive = changeType === "up";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ProgramStatsRow({ program }) {
  const interns = store.getInterns().filter((i) => i.programId === program.id);
  const mentors = store.getMentors().filter((m) => program.mentorIds?.includes(m.id));
  const completion = Math.floor(Math.random() * 40 + 50);

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="px-5 py-4">
        <div className="text-sm font-semibold text-slate-700">{program.name}</div>
        <div className="text-xs text-slate-400">{program.startDate} → {program.endDate}</div>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={program.status} />
      </td>
      <td className="px-5 py-4 text-center">
        <span className="text-sm font-semibold text-slate-700">{interns.length}</span>
      </td>
      <td className="px-5 py-4 text-center">
        <span className="text-sm font-semibold text-slate-700">{mentors.length}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600 w-8">{completion}%</span>
        </div>
      </td>
    </tr>
  );
}

function StatisticsPage() {
  const [stats, setStats] = useState({});
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setStats(store.getStats());
    setPrograms(store.getPrograms());
    setUsers(store.getUsers());
  }, []);

  const internsByProgram = programs.map((p) => ({
    label: p.name.replace("202", "'"),
    value: users.filter((u) => u.programId === p.id).length,
  }));

  const internsByMonth = MONTHLY_DATA.map((d) => ({ label: d.month, value: d.interns }));
  const programsByMonth = MONTHLY_DATA.map((d) => ({ label: d.month, value: d.programs }));

  const activeRate = stats.totalInterns
    ? Math.round((stats.activeInterns / stats.totalInterns) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBigCard
          icon={GraduationCap} label="Tổng thực tập sinh" value={stats.totalInterns || 0}
          change="+12%" changeType="up" color="text-indigo-600" bgColor="bg-indigo-100"
        />
        <StatBigCard
          icon={UserCheck} label="Đang hoạt động" value={stats.activeInterns || 0}
          change={`${activeRate}%`} changeType="up" color="text-emerald-600" bgColor="bg-emerald-100"
        />
        <StatBigCard
          icon={Users} label="Mentor" value={stats.totalMentors || 0}
          color="text-purple-600" bgColor="bg-purple-100"
        />
        <StatBigCard
          icon={BookOpen} label="Chương trình" value={stats.totalPrograms || 0}
          change={`${stats.activePrograms || 0} đang chạy`} changeType="up" color="text-amber-600" bgColor="bg-amber-100"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-800">Intern theo tháng</h3>
          </div>
          <MiniBarChart data={internsByMonth} color="bg-indigo-400" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-800">Chương trình theo tháng</h3>
          </div>
          <MiniBarChart data={programsByMonth} color="bg-emerald-400" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-800">Intern theo chương trình</h3>
          </div>
          {internsByProgram.length > 0 ? (
            <MiniBarChart data={internsByProgram} color="bg-purple-400" />
          ) : (
            <p className="text-sm text-slate-400 italic">Không có dữ liệu</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-800">Thống kê chương trình đào tạo</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Chương trình</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Intern</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Mentor</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Tiến độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((p) => (
                  <ProgramStatsRow key={p.id} program={p} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-800">Tỷ lệ hoạt động</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Intern đang hoạt động", value: activeRate, color: "bg-indigo-500" },
                { label: "Chương trình đang chạy", value: stats.totalPrograms ? Math.round((stats.activePrograms / stats.totalPrograms) * 100) : 0, color: "bg-emerald-500" },
                { label: "Mentor được phân công", value: programs.length > 0 ? Math.min(100, Math.round((users.filter((u) => u.role === "mentor").length / 4) * 100)) : 0, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 opacity-80" />
              <h3 className="text-sm font-semibold">Tóm tắt tháng này</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Intern mới", value: "+3" },
                { label: "Chương trình kết thúc", value: "0" },
                { label: "Chương trình sắp diễn ra", value: `+${stats.upcomingPrograms || 0}` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="opacity-75">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
