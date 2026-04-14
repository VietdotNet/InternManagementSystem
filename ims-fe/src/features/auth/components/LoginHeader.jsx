import { GraduationCap } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "../../../shared/constants/app";

function LoginHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{APP_NAME}</h1>
        <p className="text-sm text-slate-500">{APP_TAGLINE}</p>
      </div>
    </div>
  );
}

export default LoginHeader;
