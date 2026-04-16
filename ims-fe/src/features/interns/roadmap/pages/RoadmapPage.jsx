import { useState, useCallback } from 'react';
import { mockPrograms, addReviewRequest } from '../../../../shared/store/mockData.js';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';
import TrackSection from '../components/TrackSection.jsx';
import RequestReviewModal from '../components/RequestReviewModal.jsx';

function calcCompletion(tracks) {
  let total = 0;
  let passed = 0;
  for (const track of tracks) {
    total += track.lessons.length;
    passed += track.lessons.filter((l) => l.status === 'Passed').length;
  }
  return total === 0 ? 0 : Math.round((passed / total) * 100);
}

export default function RoadmapPage() {
  const [program] = useState(mockPrograms[0]);
  const [requestModal, setRequestModal] = useState(null);
  const [toast, setToast] = useState('');

  const completion = calcCompletion(program.tracks);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const handleRequestReview = useCallback((lesson, trackName) => {
    setRequestModal({ lesson, trackName });
  }, []);

  function handleSubmitRequest(note) {
    const { lesson, trackName } = requestModal;
    addReviewRequest(lesson.id, lesson.name, trackName, note);
    setRequestModal(null);
    showToast(`Đã gửi yêu cầu kiểm tra cho bài "${lesson.name}" thành công!`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-300">
          ✅ {toast}
        </div>
      )}

      {/* Program header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                [{program.code}] {program.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                📅 {program.startDate} – {program.endDate}
              </p>
            </div>
            <StatusBadge status={program.status} />
          </div>
        </div>

        {/* Overall progress */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tổng tiến độ</span>
            <span className="text-sm font-bold text-blue-600">{completion}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {program.tracks.reduce((s, t) => s + t.lessons.filter((l) => l.status === 'Passed').length, 0)}/
            {program.tracks.reduce((s, t) => s + t.lessons.length, 0)} bài đã hoàn thành
          </p>
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-4">
        {program.tracks.map((track) => (
          <TrackSection
            key={track.id}
            track={track}
            allTracks={program.tracks}
            onRequestReview={handleRequestReview}
          />
        ))}
      </div>

      {/* Request Review Modal */}
      {requestModal && (
        <RequestReviewModal
          lesson={requestModal.lesson}
          trackName={requestModal.trackName}
          onClose={() => setRequestModal(null)}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  );
}
