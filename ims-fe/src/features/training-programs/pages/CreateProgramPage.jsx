import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, BookOpen, Users, Layers, CheckCheck, ArrowLeft } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCreateProgram } from "../hooks/useTrainingPrograms";
import { getAllMentors } from "../../users/services/userService";


function SectionCard({ icon: Icon, iconColor, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
        <span className="text-xl">{typeof Icon === "string" ? Icon : ""}</span>
        {typeof Icon !== "string" && <Icon className={cn("w-4.5 h-4.5", iconColor)} size={18} />}
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange, error, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={cn(
          "w-full h-10 px-3.5 rounded-xl border text-sm text-slate-700 placeholder:text-slate-400 transition-all outline-none",
          "focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400",
          error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-white hover:border-slate-300"
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function CreateProgramPage() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [error, setError] = useState(null);
  const {
    form, errors, loading, success, newTrack,
    handleChange, toggleMentor, addTrack, removeTrack, setNewTrack, handleSubmit, resetSuccess,
  } = useCreateProgram();

 useEffect(() => {
  async function fetchMentors() {
    try {
      const data = await getAllMentors();

      const mapped = data.map(m => ({
        id: m.id,
        name: m.fullName, 
        email: m.email
      }));

      setMentors(mapped);
     } catch (err) {
      console.error(err);
      setError("Không tải được danh sách mentor");
    } finally {
      setLoadingMentors(false);
    }
  }

  fetchMentors();
}, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetSuccess();
        navigate("/programs", { replace: true });
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
          <h2 className="text-xl font-bold text-slate-800">Tạo thành công!</h2>
          <p className="text-sm text-slate-500">Chương trình <strong>{form.name || "mới"}</strong> đã được tạo.<br />Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/programs")}
          className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCapIcon /> Tạo chương trình đào tạo
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <SectionCard icon={BookOpen} iconColor="text-indigo-500" title="Thông tin chương trình">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <FormInput
                label="Tên chương trình" name="name" value={form.name}
                onChange={handleChange} placeholder="Ex: 202603-JAVA"
                error={errors.name} required
              />
            </div>
            <div>
              <FormInput
                label="Ngày bắt đầu" name="startDate" type="date" value={form.startDate}
                onChange={handleChange} error={errors.startDate} required
              />
            </div>
            <div>
              <FormInput
                label="Ngày kết thúc" name="endDate" type="date" value={form.endDate}
                onChange={handleChange} error={errors.endDate} required
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Users} iconColor="text-purple-500" title="Phân công mentors">
          
          {mentors.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Chưa có mentor nào trong hệ thống.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mentors.map((mentor) => {
                const selected = form.mentorIds.includes(mentor.id);
                return (
                  <button
                    key={mentor.id}
                    type="button"
                    onClick={() => toggleMentor(mentor.id)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150",
                      selected
                        ? "border-indigo-400 bg-indigo-50 shadow-sm shadow-indigo-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                      selected ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                    )}>
                      {selected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={cn("text-sm font-semibold truncate", selected ? "text-indigo-700" : "text-slate-700")}>{mentor.name}</div>
                      <div className="text-xs text-slate-400 truncate">{mentor.email}</div>
                      {/* <div className="text-xs text-indigo-500 mt-0.5">{mentor.department}</div> */}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {form.mentorIds.length > 0 && (
            <div className="mt-3 text-xs text-indigo-600 font-medium">
              Đã chọn {form.mentorIds.length} mentor
            </div>
          )}
        </SectionCard>

        <SectionCard icon={Layers} iconColor="text-emerald-500" title="Training Tracks">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTrack(); } }}
                placeholder="Nhập tên track (Enter để thêm)"
                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all"
              />
              <button
                type="button"
                onClick={addTrack}
                disabled={!newTrack.trim()}
                className="h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium flex items-center gap-1.5 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm Track
              </button>
            </div>
            {form.tracks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tracks.map((track) => (
                  <span key={track} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-medium text-indigo-700">
                    {track}
                    <button type="button" onClick={() => removeTrack(track)} className="hover:text-indigo-900 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {form.tracks.length === 0 && (
              <p className="text-sm text-slate-400 italic">Chưa có track nào. Nhập và nhấn Enter hoặc nút Thêm Track.</p>
            )}
            {errors.tracks && (
              <p className="text-xs text-red-500 mt-2">{errors.tracks}</p>
            )}
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/programs")}
            className="h-10 px-6 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-6 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Tạo chương trình
          </button>
        </div>
      </form>
    </div>
  );
}

function GraduationCapIcon() {
  return <span className="text-xl">🎓</span>;
}

export default CreateProgramPage;
