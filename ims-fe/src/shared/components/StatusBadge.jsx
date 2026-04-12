import { cn } from "../../lib/utils";

const STATUS_CONFIG = {
  active: { label: "Hoạt động", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Không hoạt động", className: "bg-slate-50 text-slate-500 border-slate-200" },
  upcoming: { label: "Sắp diễn ra", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Hoàn thành", className: "bg-blue-50 text-blue-700 border-blue-200" },
  intern: { label: "Intern", className: "bg-purple-50 text-purple-700 border-purple-200" },
  mentor: { label: "Mentor", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  admin: { label: "Admin", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || { label: status, className: "bg-slate-50 text-slate-500 border-slate-200" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", config.className, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        "bg-emerald-500": status === "active",
        "bg-slate-400": status === "inactive",
        "bg-amber-500": status === "upcoming",
        "bg-blue-500": status === "completed",
        "bg-purple-500": status === "intern",
        "bg-indigo-500": status === "mentor",
        "bg-rose-500": status === "admin",
      })} />
      {config.label}
    </span>
  );
}

export default StatusBadge;
