import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCheck, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCreateUser } from "../hooks/useUsers";

function FormInput({ label, name, type = "text", value, onChange, error, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete="off"
        className={cn(
          "w-full h-11 px-4 rounded-xl border text-sm text-slate-700 placeholder:text-slate-400 transition-all outline-none",
          "focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400",
          error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300"
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FormSelect({ label, name, value, onChange, error, options, placeholder, required, disabled }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={name} name={name} value={value} onChange={onChange} disabled={disabled}
          className={cn(
            "w-full h-11 px-4 pr-10 rounded-xl border text-sm text-slate-700 transition-all outline-none appearance-none cursor-pointer",
            "focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400",
            error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300",
            disabled && "opacity-50 cursor-not-allowed",
            !value && "text-slate-400"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function CreateUserPage() {
  const navigate = useNavigate();
  const {
    form, errors, loading, success, programs, availablePositions,
    handleChange, handleSubmit, resetSuccess,
  } = useCreateUser();

  const isIntern = form.role === "intern";

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetSuccess();
        navigate("/users");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, resetSuccess]);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-80">
        <div className="text-center space-y-4 p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Tạo tài khoản thành công!</h2>
          <p className="text-sm text-slate-500">Tài khoản đã được thêm vào hệ thống.<br />Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  const roleOptions = [
    { value: "intern", label: "Intern" },
    { value: "mentor", label: "Mentor" },
  ];

  const programOptions = programs.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.startDate} → ${p.endDate})`,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/users")}
          className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-2xl">🧑‍💼</span> Tạo tài khoản người dùng
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <p className="text-sm text-slate-500">Điền thông tin để tạo tài khoản mới cho <strong className={isIntern ? "text-purple-600" : "text-indigo-600"}>{isIntern ? "Intern" : "Mentor"}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormInput
            label="Họ & Tên" name="name" value={form.name} onChange={handleChange}
            placeholder="Nguyễn Văn A" error={errors.name} required
          />

          <FormInput
            label="Email" name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="email@congty.vn" error={errors.email} required
          />

          <FormSelect
            label="Vai trò" name="role" value={form.role} onChange={handleChange}
            options={roleOptions} placeholder="Chọn vai trò" required
          />

          {isIntern && (
            <>
              <FormSelect
                label="Chương trình đào tạo" name="programId" value={form.programId}
                onChange={handleChange} options={programOptions}
                placeholder="-- Chọn chương trình --" error={errors.programId} required
              />

              <FormSelect
                label="Vị trí" name="position" value={form.position}
                onChange={handleChange} options={availablePositions}
                placeholder="-- Chọn vị trí --" error={errors.position} required
                disabled={!form.programId}
              />
            </>
          )}

          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;
