import { useState, useRef, useEffect } from 'react';
import { addMessage, mockUser } from '../../../../shared/store/mockData.js';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';

export default function ReviewDetailModal({ review, onClose, onUpdate }) {
  const [messages, setMessages] = useState(review.messages);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);

    setTimeout(() => {
      const msg = addMessage(review.id, trimmed, mockUser.id);
      if (msg) setMessages((prev) => [...prev, msg]);
      setText('');
      setSending(false);

      // Simulate mentor reply after 1.5s
      setTimeout(() => {
        const mentorReply = {
          id: Date.now() + 1,
          senderId: 99,
          senderName: 'Trần Văn Mentor',
          senderRole: 'mentor',
          text: 'Cảm ơn bạn! Mình sẽ xem xét sớm.',
          time: (() => {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
          })(),
        };
        setMessages((prev) => [...prev, mentorReply]);
      }, 1500);
    }, 500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📋</span>
            <h2 className="text-base font-semibold text-gray-900">Review Detail</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Review info */}
        <div className="mx-6 mt-4 border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Review Detail</p>
            <StatusBadge status={review.status} />
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Intern:</span> {mockUser.name}
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Lesson:</span> {review.lessonName}
                </p>
              </div>
            </div>
            {review.note && (
              <div>
                <p className="text-sm font-semibold">Lời nhắn:</p>
                <p className="text-sm text-gray-500 mt-0.5">{review.note}</p>
              </div>
            )}
            {review.score !== null && (
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Điểm:</span> {review.score}/10
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="mx-6 mt-4 mb-2 flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderRole === 'intern';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`flex items-center gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            isMe ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                          }`}
                        >
                          {msg.senderName.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-400">{msg.senderName}</span>
                      </div>
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                        }`}
                      >
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

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              rows={2}
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập tin nhắn... (Enter để gửi)"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-1.5"
            >
              {sending ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              Gửi
            </button>
          </form>
        </div>

        <div className="h-4 flex-shrink-0" />
      </div>
    </div>
  );
}
