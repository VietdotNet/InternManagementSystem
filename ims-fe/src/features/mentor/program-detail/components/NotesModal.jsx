export default function NotesModal({ review, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📝</span>
            <h2 className="text-base font-semibold text-gray-900">Notes</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span>🪖</span>
                <span className="font-semibold text-sm text-gray-800">Notes</span>
              </div>
              <span className="px-2.5 py-0.5 bg-cyan-400 text-white text-xs font-semibold rounded-full">Internal</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 italic">
                {review.mentorNotes || 'Không có ghi chú nào.'}
              </p>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <p><span className="font-medium">Intern:</span> {review.internName}</p>
            <p><span className="font-medium">Bài học:</span> {review.lessonName} · {review.attemptLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
