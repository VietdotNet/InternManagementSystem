import { Info } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    role: "Quản trị viên",
    email: "admin@internhub.vn",
    password: "admin123",
    color: "bg-indigo-50 border-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  {
    role: "Quản lý",
    email: "manager@internhub.vn",
    password: "manager123",
    color: "bg-purple-50 border-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
];

function DemoAccountItem({ account }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-xs space-y-0.5 ${account.color}`}>
      <div className="flex items-center gap-1.5 font-semibold">
        <div className={`w-1.5 h-1.5 rounded-full ${account.dot}`} />
        {account.role}
      </div>
      <div className="opacity-80">{account.email}</div>
      <div className="opacity-70">Mật khẩu: {account.password}</div>
    </div>
  );
}

function LoginHints() {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
      <div className="flex items-center gap-2 text-slate-500">
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-xs font-medium">Tài khoản demo</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <DemoAccountItem key={account.role} account={account} />
        ))}
      </div>
    </div>
  );
}

export default LoginHints;