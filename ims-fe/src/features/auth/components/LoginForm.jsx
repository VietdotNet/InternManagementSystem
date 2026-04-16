import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GoogleLoginButton from "./GoogleLoginButton";

function FormField({ label, name, type, value, onChange, error, placeholder, icon: Icon, rightElement, autoComplete }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "w-full h-11 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-slate-700 placeholder:text-slate-400",
            "transition-all duration-200 outline-none",
            "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
            Icon ? "pl-10 pr-4" : "px-4",
            rightElement ? "pr-11" : "",
            error
              ? "border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-400"
              : "border-slate-200 hover:border-slate-300"
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-red-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}

export default function LoginForm({
  formData,
  errors,
  showPassword,
  isLoading,
  rememberMe,
  loginError,
  onChange,
  onSubmit,
  onTogglePassword,
  onRememberMeChange,
}) {
  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {loginError && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed">{loginError}</p>
          </div>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          placeholder="email@congty.vn"
          icon={Mail}
          autoComplete="email"
        />

        <FormField
          label="Mật khẩu"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          placeholder="Nhập mật khẩu"
          icon={Lock}
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => onRememberMeChange(e.target.checked)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center",
                  rememberMe
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-300 bg-white group-hover:border-indigo-400"
                )}
              >
                {rememberMe && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-slate-600 select-none">Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:underline underline-offset-2"
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-11 rounded-xl font-semibold text-sm text-white",
            "bg-gradient-to-r from-indigo-600 to-purple-600",
            "hover:from-indigo-700 hover:to-purple-700",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            "transition-all duration-200 shadow-md shadow-indigo-200",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-slate-400 font-medium">hoặc tiếp tục với</span>
        </div>
      </div>

      <GoogleLoginButton disabled={isLoading} />
    </div>
  );
}
