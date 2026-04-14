import { Users, Award, Building2, BarChart3, Shield, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Quản lý thực tập sinh",
    desc: "Theo dõi hồ sơ, tiến độ và đánh giá từng thực tập sinh",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Building2,
    title: "Quản lý công ty",
    desc: "Kết nối với các doanh nghiệp và quản lý chỗ thực tập",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Award,
    title: "Đánh giá & xếp loại",
    desc: "Hệ thống đánh giá hiệu suất và cấp chứng chỉ tốt nghiệp",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Báo cáo thống kê",
    desc: "Dashboard tổng quan với số liệu thực thời",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const STATS = [
  { value: "2,400+", label: "Thực tập sinh" },
  { value: "380+", label: "Công ty đối tác" },
  { value: "96%", label: "Hài lòng" },
];

function FeatureItem({ icon: Icon, title, desc, color, bg }) {
  return (
    <div className="flex gap-3 group">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} size={18} />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function LoginSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-20 left-10 w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="absolute top-40 right-20 w-1 h-1 rounded-full bg-white/30" />
        <div className="absolute bottom-32 right-10 w-2 h-2 rounded-full bg-white/15" />
        <div className="absolute bottom-20 left-20 w-1 h-1 rounded-full bg-purple-300/40" />
      </div>

      <div className="relative space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-indigo-300" />
          </div>
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Nền tảng tin cậy</span>
        </div>
        <h2 className="text-3xl font-bold text-white leading-tight">
          Quản lý thực tập<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            thông minh hơn
          </span>
        </h2>
        <p className="text-sm text-white/55 leading-relaxed max-w-xs">
          Nền tảng toàn diện giúp doanh nghiệp và nhà trường quản lý chương trình thực tập hiệu quả.
        </p>
      </div>

      <div className="relative space-y-4">
        {FEATURES.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-white/40">
          <Clock className="w-3 h-3" />
          <span className="text-xs">Cập nhật theo thời gian thực</span>
        </div>
      </div>
    </div>
  );
}

export default LoginSidebar;