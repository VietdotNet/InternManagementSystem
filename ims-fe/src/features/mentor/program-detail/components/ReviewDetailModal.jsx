import { useState, useRef, useEffect } from 'react';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';

export default function ReviewDetailModal({ review, mentorUser, onClose, onSave, onSendMessage }) {
  const [messages, setMessages] = useState(review.messages);
  const [text, setText] = useState('');
  const [status, setStatus] = useState(review.status);
  const [score, setScore] = useState(review.score ?? '');
  const [mentorNotes, setMentorNotes] = useState(review.mentorNotes || '');
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSendReply(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    setTimeout(() => {
      const msg = onSendMessage(review.id, trimmed, 'mentor', mentorUser.name, mentorUser.id);
      if (msg) setMessages((prev) => [...prev, msg]);
      setText('');
      setSending(false);
    }, 400);
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      onSave(review.id, {
        status,
        score: score === '' ? null : Number(score),
        mentorNotes,
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📋</span>
            <h2 className="text-base font-semibold text-gray-900">Review Detail</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Info block */}
          <div className="mx-6 mt-4 border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700">Review Detail</p>
              <StatusBadge status={review.status} />
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm"><span className="font-semibold">Intern:</span> {review.internName}</p>
                <p className="text-sm"><span className="font-semibold">Lesson:</span> {review.lessonName}</p>
              </div>
              {review.note && (
                <div>
                  <p className="text-sm font-semibold">Lời nhắn:</p>
                  <p className="text-sm text-gray-500 italic mt-0.5">{review.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="mx-6 mt-4 border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-44 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-xs text-gray-400 pt-4">Chưa có tin nhắn nào.</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderRole === 'mentor';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[75%] flex flex-col gap-1">
                        <div className={`flex items-center gap-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isMe ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                            {msg.senderName.charAt(0)}
                          </div>
                          <span className="text-[10px] text-gray-400">{msg.senderName}</span>
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                        <p className="text-[10px] text-gray-400">{msg.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendReply} className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(e); }
                }}
                rows={2}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nhập tin nhắn reply..."
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                Send Reply
              </button>
            </form>
          </div>

          {/* Evaluate */}
          <div className="mx-6 mt-4 mb-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="InReview">InReview</option>
                  <option value="Passed">Passed</option>
                  <option value="NotPassed">NotPassed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Score</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0-10"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <input
                  type="text"
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Internal notes..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:bg-gray-300 transition"
              >
                {saving ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : saved ? '✅' : '💾'}
                {saved ? 'Đã lưu!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
