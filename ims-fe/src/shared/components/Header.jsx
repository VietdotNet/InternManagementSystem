import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", desc: "Tổng quan hệ thống quản lý thực tập sinh" },
  "/programs": { title: "Chương trình đào tạo", desc: "Danh sách và quản lý các chương trình" },
  "/programs/create": { title: "Tạo chương trình đào tạo", desc: "Thêm mới chương trình đào tạo" },
  "/users": { title: "Quản lý người dùng", desc: "Danh sách intern và mentor" },
  "/users/create": { title: "Tạo tài khoản người dùng", desc: "Thêm mới tài khoản vào hệ thống" },
  "/statistics": { title: "Thống kê & Báo cáo", desc: "Phân tích dữ liệu và báo cáo" },
};

function Header({ currentPath }) {
  const [showNotif, setShowNotif] = useState(false);
  const pageInfo = PAGE_TITLES[currentPath] || { title: "InternHub", desc: "" };

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-bold text-slate-800 leading-tight">{pageInfo.title}</h1>
        {pageInfo.desc && <p className="text-xs text-slate-400">{pageInfo.desc}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="w-52 h-9 pl-9 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Thông báo</span>
                <span className="text-xs text-indigo-600 font-medium cursor-pointer">Đánh dấu đã đọc</span>
              </div>
              {[
                { text: "Chương trình 202603-JAVA sắp kết thúc", time: "5 phút trước", unread: true },
                { text: "3 thực tập sinh mới đăng ký hôm nay", time: "1 giờ trước", unread: true },
                { text: "Đánh giá tuần của mentor Trần Duy Hưng", time: "2 giờ trước", unread: false },
              ].map((n, i) => (
                <div key={i} className={`flex gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${n.unread ? "bg-indigo-50/60" : "hover:bg-slate-50"}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-indigo-500" : "bg-transparent"}`} />
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-slate-700 leading-tight">Admin</div>
            <div className="text-xs text-slate-400">Quản trị viên</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}

export default Header;
