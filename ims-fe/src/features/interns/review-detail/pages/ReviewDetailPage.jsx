import { useState } from 'react';
import { getReviewRequests, mockPrograms } from '../../../../shared/store/mockData.js';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';
import ReviewDetailModal from '../components/ReviewDetailModal.jsx';

const ATTEMPT_COLORS = {
  1: 'bg-gray-600',
  2: 'bg-amber-500',
  3: 'bg-orange-600',
};

export default function ReviewDetailPage() {
  const [reviews, setReviews] = useState(getReviewRequests());
  const [filter, setFilter] = useState({ track: '', status: '', attempt: '', search: '' });
  const [selectedReview, setSelectedReview] = useState(null);

  function handleCloseDetail() {
    setSelectedReview(null);
    setReviews(getReviewRequests());
  }

  const tracks = mockPrograms[0].tracks.map((t) => t.name);

  const filtered = reviews.filter((r) => {
    if (filter.track && r.trackName !== filter.track) return false;
    if (filter.status && r.status !== filter.status) return false;
    if (filter.attempt && r.attempt !== Number(filter.attempt)) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!r.lessonName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function setF(key, val) {
    setFilter((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Filter panel */}
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">-- All Tracks --</option>
              {tracks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
            <select
              value={filter.status}
              onChange={(e) => setF('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Reviews table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="font-semibold text-gray-900">Các yêu cầu kiểm tra của bạn</h3>
            <span className="ml-auto text-xs text-gray-400 font-medium">{filtered.length} kết quả</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lesson</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attempt</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Không có yêu cầu kiểm tra nào.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{r.lessonName}</p>
                      <p className="text-xs text-gray-400">{r.trackName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
                          ATTEMPT_COLORS[r.attempt] || 'bg-gray-500'
                        }`}
                      >
                        {r.attemptLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{r.createdAt}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {r.score !== null ? (
                        <span className="text-sm font-semibold text-gray-800">{r.score}</span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review detail modal */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={handleCloseDetail}
          onUpdate={() => setReviews(getReviewRequests())}
        />
      )}
    </div>
  );
}
