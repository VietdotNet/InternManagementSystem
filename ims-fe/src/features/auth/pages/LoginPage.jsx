import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../hooks/useLoginForm";
import LoginHeader from "../components/LoginHeader";
import LoginForm from "../components/LoginForm";
import LoginHints from "../components/LoginHints";
import LoginSidebar from "../components/LoginSidebar";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/shared/utils/authApi";

import { useAuth } from "@/shared/context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [oauthStatus, setOauthStatus] = useState(null);
  const [oauthMessage, setOauthMessage] = useState("");

  const {
    formData,
    errors,
    showPassword,
    isLoading,
    rememberMe,
    loginError,
    handleChange,
    handleSubmit,
    toggleShowPassword,
    setRememberMe,
  } = useLoginForm();

  async function onSubmit(e) {
    const result = await handleSubmit(e);
    if (result?.success && result.user) {
      setUser(result.user); // Lưu user vào context
    }
  };

  useEffect(() => {
  if (!user) return;

  if (user.role === "Admin") {
    navigate("/dashboard", { replace: true });
  } else if (user.role === "Intern") {
    navigate("/intern", { replace: true });
  } else if (user.role === "Mentor") {
    navigate("/mentor/programs", { replace: true });
  }
}, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          <LoginSidebar />

          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/60 border border-white/60 p-8 sm:p-10 space-y-8">
              <LoginHeader />

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">Đăng nhập</h2>
                <p className="text-sm text-slate-500">Nhập thông tin để truy cập hệ thống</p>
              </div>

              {oauthStatus && (
  <div
    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
      oauthStatus === "success"
        ? "bg-green-50 text-green-600"
        : "bg-red-50 text-red-600"
    }`}
  >
    {oauthStatus === "success" ? (
      <CheckCircle2 className="w-4 h-4" />
    ) : (
      <AlertCircle className="w-4 h-4" />
    )}
    {oauthMessage}
  </div>
)}

              <LoginForm
                formData={formData}
                errors={errors}
                showPassword={showPassword}
                isLoading={isLoading}
                rememberMe={rememberMe}
                loginError={loginError}
                onChange={handleChange}
                onSubmit={onSubmit}
                onTogglePassword={toggleShowPassword}
                onRememberMeChange={setRememberMe}
              />

              <LoginHints />
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              © 2026 InternHub. Bảo lưu mọi quyền.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
