import { useState, useEffect, useCallback } from "react";
import { store } from "../../../shared/store/mockData";
import { createInterns } from "../services/userService";
import { createMentors } from "../services/userService";
import { getAllPrograms } from "../../training-programs/services/programService";
import { getTracksByProgram} from "../../training-programs/services/programService"

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(store.getUsers());
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function deleteUser(id) {
    store.deleteUser(id);
    refresh();
  }

  function toggleStatus(id) {
    const user = store.getUserById(id);
    if (user) {
      store.updateUser(id, { status: user.status === "active" ? "inactive" : "active" });
      refresh();
    }
  }

  return { users, loading, deleteUser, toggleStatus, refresh };
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [tracks, setTracks] = useState([]);

  const INITIAL_FORM = { name: "", email: "", role: "intern", programId: "", position: "" };
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllPrograms();

        const mapped = data.map(p => ({
        id: p.programId,
        name: p.programName,
        startDate: p.startDate, 
        endDate: p.endDate
      }));

        setPrograms(mapped);
      } catch (err) {
        console.error("Failed to fetch programs", err);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
  const fetchTracks = async () => {
    if (!form.programId) {
      setTracks([]);
      return;
    }

    try {
      const data = await getTracksByProgram(form.programId);

      const mapped = data.map(t => ({
        id: t.trackId ?? t.id,
        name: t.trackName ?? t.name,
      }));

      setTracks(mapped);
    } catch (err) {
      console.error("Failed to fetch tracks", err);
      setTracks([]);
    }
  };

  fetchTracks();
}, [form.programId]);

  const availablePositions = (tracks || []).map(t => ({
  value: t.id,
  label: t.name
}));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "role" && value !== "intern") {
        updated.programId = "";
        updated.position = "";
      }
      if (name === "programId") {
        updated.position = "";
      }
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Họ & Tên không được để trống";
    if (!form.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email không đúng định dạng";
    if (form.role === "intern" && !form.programId) newErrors.programId = "Vui lòng chọn chương trình đào tạo";
    if (form.role === "intern" && !form.position) newErrors.position = "Vui lòng chọn vị trí";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
    if (form.role === "intern") {
      await createInterns({
        fullName: form.name,
        email: form.email,
        role: form.role,
        programId: form.programId,
        positionId: form.position, 
      });
    } else {
      await createMentors({
        fullName: form.name,
        email: form.email,
        role: form.role,
      });
    }

    setSuccess(true);
    setForm(INITIAL_FORM);
  } catch (err) {
    console.log(err);

    setErrors((prev) => ({
      ...prev,
      api: err.response?.data?.message || "Tạo user thất bại",
    }));
  } finally {
    setLoading(false);
  }
  }

  function resetSuccess() {
    setSuccess(false);
  }

  return {
    form, errors, loading, success, programs, availablePositions,
    handleChange, handleSubmit, resetSuccess,
  };
}
