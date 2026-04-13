import { useState } from 'react';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';
import { getLessonCanRequest } from '../../../../shared/store/mockData.js';

function calcTrackCompletion(track) {
  const total = track.lessons.length;
  if (total === 0) return 0;
  const passed = track.lessons.filter((l) => l.status === 'Passed').length;
  return Math.round((passed / total) * 100);
}

export default function TrackSection({ track, allTracks, onRequestReview }) {
  const [expanded, setExpanded] = useState(true);
  const pct = calcTrackCompletion(track);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Track header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-blue-50 hover:bg-blue-100 transition"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{track.icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{track.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-[140px]">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-blue-600 w-9 text-right">{pct}%</span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? '' : '-rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </button>

      {/* Lessons */}
      {expanded && (
        <div className="divide-y divide-gray-100">
          {track.lessons.map((lesson) => {
            const { canRequest, reason } = getLessonCanRequest(lesson.id, allTracks);
            const isPassed = lesson.status === 'Passed';
            const attemptsLeft = lesson.maxAttempts - lesson.attempts;

            return (
              <div key={lesson.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{lesson.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Attempts: {lesson.attempts} / {lesson.maxAttempts}
                    </p>
                  </div>
                  <StatusBadge status={lesson.status} />
                </div>

                {/* Action */}
                {!isPassed && (
                  <div className="mt-2.5 flex justify-end">
                    {canRequest && attemptsLeft > 0 ? (
                      <button
                        onClick={() => onRequestReview(lesson, track.name)}
                        className="px-3 py-1.5 text-xs font-medium border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                      >
                        Request Review
                      </button>
                    ) : (
                      <p className="text-xs text-red-500 font-medium">
                        {attemptsLeft === 0 ? 'Đã hết lượt kiểm tra' : reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
