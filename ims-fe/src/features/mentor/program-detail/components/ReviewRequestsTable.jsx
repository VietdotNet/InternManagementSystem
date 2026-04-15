import { useState } from 'react';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';
import ReviewDetailModal from './ReviewDetailModal.jsx';
import NotesModal from './NotesModal.jsx';

const ATTEMPT_COLORS = { 1: 'bg-gray-600', 2: 'bg-amber-500', 3: 'bg-orange-600' };

export default function ReviewRequestsTable({ program, reviews, mentorUser, onUpdateReview, onSendMessage }) {
  const [filter, setFilter] = useState({ track: '', status: '', attempt: '', search: '' });
  const [selectedReview, setSelectedReview] = useState(null);
  const [notesReview, setNotesReview] = useState(null);

  const tracks = program.tracks;

  const filtered = reviews.filter((r) => {
    if (filter.track && r.trackName !== filter.track) return false;
    if (filter.status && r.status !== filter.status) return false;
    if (filter.attempt && r.attempt !== Number(filter.attempt)) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!r.lessonName.toLowerCase().includes(q) && !r.internName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function setF(key, val) {
    setFilter((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="space-y-5">
      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔍</span>
          <h3 className="font-semibold text-gray-900">Filter</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Program Track</label>
            <select
              value={filter.track}
              onChange={(e) => setF('track', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">-- All Tracks --</option>
              {tracks.map((t) => <option key={t.trackId} value={t.trackId}>{t.trackName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
            <select
              value={filter.status}
              onChange={(e) => setF('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="InReview">InReview</option>
              <option value="Passed">Passed</option>
              <option value="NotPassed">NotPassed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lượt kiểm tra</label>
            <select
              value={filter.attempt}
              onChange={(e) => setF('attempt', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">All</option>
              <option value="1">Lần 1</option>
              <option value="2">Lần 2</option>
              <option value="3">Lần 3</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setF('search', e.target.value)}
              placeholder="Lesson / Intern name..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-gray-900">Review Requests</h3>
          <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} kết quả</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Intern', 'Program Track', 'Lesson', 'Attempt', 'Created At', 'Status', 'Score', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">Không có yêu cầu nào.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{r.internName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.trackName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.lessonName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white ${ATTEMPT_COLORS[r.attempt] || 'bg-gray-500'}`}>
                        {r.attemptLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.createdAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      {r.score !== null ? r.score : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedReview(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                        >
                          ✏️ Review
                        </button>
                        <button
                          onClick={() => setNotesReview(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition"
                        >
                          ✏️ Notes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          mentorUser={mentorUser}
          onClose={() => setSelectedReview(null)}
          onSave={(id, updates) => {
            onUpdateReview(id, updates);
            setSelectedReview(null);
          }}
          onSendMessage={(reviewId, text, role, name, senderId) => {
            const msg = { id: Date.now(), senderId, senderName: name, senderRole: role, text, time: new Date().toLocaleString() };
            onSendMessage(reviewId, text, role, name, senderId);
            return msg;
          }}
        />
      )}

      {notesReview && (
        <NotesModal review={notesReview} onClose={() => setNotesReview(null)} />
      )}
    </div>
  );
}
