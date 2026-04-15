import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import {
  createLesson,
  getLessonsByTrack,
  updateLesson,
  deleteLesson
} from "../services/lessonService";

<toast
  position="top-right"
  toastOptions={{
    style: {
      zIndex: 9999
    }
  }}
/>

export default function ManageLessonsModal({ track, onClose}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newName, setNewName] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [editingLesson, setEditingLesson] = useState(null);

    useEffect(() => {
    loadLessons();
  }, [track.trackId]);

  const loadLessons = async () => {
    if (!track?.trackId) return;

    try {
      setLoading(true);
      const data = await getLessonsByTrack(track.trackId);
      const normalized = data.map(l => ({
        id: l.id,
        name: l.lessonName,
        order: l.orderIndex,
        rowVersion: l.rowVersion
      }));
      setLessons(normalized);
    } catch (err) {
      console.error(err);
      alert("Load lessons failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newOrder) return;

    try {
      await createLesson({
        lessonName: newName.trim(),
        orderIndex: Number(newOrder),
        programTrackId: track.trackId,
      });
      toast.success("Thêm lesson thành công 🎉");
      await loadLessons();

      setNewName("");
      setNewOrder("");
    } catch (err) {
      toast.error("Bạn không có quyền để thêm lesson!");
    }
  };

  // ================= EDIT =================
const startEdit = (lesson) => {
   if (editingId !== null) return;
  setEditingId(lesson.id);
  setEditingLesson({ ...lesson }); 
};

const handleChange = (field, value) => {
  setEditingLesson(prev => ({
    ...prev,
    [field]: value
  }));
};

const handleCancel = () => {
  setEditingId(null);
  setEditingLesson(null);
};

const handleEditSave = async () => {
  if (!editingLesson?.name?.trim() || !editingLesson?.order) return;

  try {
  await updateLesson(editingLesson.id, {
    lessonName: editingLesson.name.trim(),
    orderIndex: Number(editingLesson.order),
    rowVersion: editingLesson.rowVersion,
     });
    
     await loadLessons();
       setEditingId(null);
      setEditingLesson(null);

      toast.success("Cập nhật thành công 🎉", {
  duration: 2000,
});

   } catch (err) {
    if (err?.response?.status === 403) {
      toast.error("Bạn không có quyền chỉnh sửa bài học!");
    } else {
      toast.error("Dữ liệu đã bị thay đổi bởi người khác. Vui lòng reload!");
    }
  }
};

  // ================= DELETE =================
  const handleDelete = async (lessonId) => {
    if (!window.confirm("Xác nhận xóa bài học này?")) return;

    try {
      await deleteLesson(lessonId);
      await loadLessons();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <h2 className="text-base font-semibold text-gray-900">Manage Lessons — {track.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lessons.map((lesson) => (
                  
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {editingId === lesson.id ? (
                        <input
                         value={editingLesson?.name || ""}
                          onChange={(e) =>  handleChange( "name", e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{lesson.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === lesson.id ? (
                        <input
                          type="number"
                          value={editingLesson?.order || ""}
                          onChange={(e) => handleChange( "order", Number(e.target.value))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{lesson.order}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === lesson.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={handleEditSave}
                            className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Save
                          </button>
                          <button
                           onClick={handleCancel}
                            className="px-2.5 py-1 text-xs font-medium bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(lesson)}
                            className="px-2.5 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id)}
                            className="px-2.5 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Lesson form */}
          <form onSubmit={handleAdd} className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thêm bài học mới</p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Lesson name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              placeholder="Order"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
