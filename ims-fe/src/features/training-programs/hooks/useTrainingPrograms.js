import { useState, useEffect, useCallback } from "react";
import { store } from "../../../shared/store/mockData";
import { createProgramTraining } from "../services/programService";
import { getAllPrograms } from "../services/programService";

export function useTrainingPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPrograms();

      const mapped = data.map(p => ({
        id: p.programId,
        name: p.programName,
        internCount: p.internCount,
        mentorCount: p.mentorCount,
        status: p.isClosed ? "completed" : "active",
        startDate: p.startDate, 
        endDate: p.endDate,
        tracks: p.tracks || [],
        mentors: p.mentors || [],
      }));

      setPrograms(mapped);
    } catch (err) {
      console.error("Fetch programs error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function deleteProgram(id) {
    store.deleteProgram(id);
    refresh();
  }

  function updateProgramStatus(id, status) {
    store.updateProgram(id, { status });
    refresh();
  }

  return { programs, loading, deleteProgram, updateProgramStatus, refresh };
}

export function useCreateProgram() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const INITIAL_FORM = {
    name: "",
    startDate: "",
    endDate: "",
    mentorIds: [],
    tracks: [],
  };

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [newTrack, setNewTrack] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function toggleMentor(id) {
    setForm((prev) => ({
      ...prev,
      mentorIds: prev.mentorIds.includes(id)
        ? prev.mentorIds.filter((m) => m !== id)
        : [...prev.mentorIds, id],
    }));
  }

  function addTrack() {
    const trimmed = newTrack.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, tracks: [...prev.tracks, trimmed] }));
    setNewTrack("");
  }

  function removeTrack(track) {
    setForm((prev) => ({ ...prev, tracks: prev.tracks.filter((t) => t !== track) }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên chương trình không được để trống";
    if (!form.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!form.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (form.startDate && form.endDate && form.endDate <= form.startDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    };
    if (!form.mentorIds) {
    newErrors.mentorIds = "Phải gán ít nhất 1 mentor";
    }
    if (!form.tracks || form.tracks.length === 0) {
    newErrors.tracks = "Phải thêm ít nhất 1 training track";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    const payload = {
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      tracks: form.tracks,
      selectedMentorIds: form.mentorIds,
    };

    await createProgramTraining(payload);

    setSuccess(true);
    setForm(INITIAL_FORM);
  } catch (err) {
    console.error("Create program error:", err);

    alert("Tạo chương trình thất bại!");
  } finally {
    setLoading(false);
  }
}

  function resetSuccess() {
    setSuccess(false);
  }

  return {
    form, errors, loading, success, newTrack,
    handleChange, toggleMentor, addTrack, removeTrack, setNewTrack, handleSubmit, resetSuccess,
  };
}
