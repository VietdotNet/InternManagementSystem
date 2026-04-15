import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgramDetail } from '../hooks/useProgramDetail.js';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';
import InternList from '../components/InternList.jsx';
import ReviewRequestsTable from '../components/ReviewRequestsTable.jsx';
import ProgramLessons from '../components/ProgramLessons.jsx';

const TABS = [
  { id: 'interns', label: '👥 Interns', },
  { id: 'reviews', label: '📋 Review Requests' },
  { id: 'lessons', label: '📖 Program Lessons' },
];

export default function ProgramDetailPage({ mentorUser }) {
  const { id } = useParams();
  const programId = Number(id);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('interns');

  const {
    program,
    reviews,
    handleUpdateReview,
    handleAddMessage,
    handleAddLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  } = useProgramDetail(programId);

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-sm">Không tìm thấy chương trình đào tạo.</p>
        <button onClick={() => navigate('/mentor/programs')} className="mt-4 text-sm text-blue-600 hover:underline">
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/mentor/programs')}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại danh sách
      </button>

      {/* Program Header */}
      <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
                {program.programName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">📅 {program.startDate} – {program.endDate}</p>
            <div className="mt-3">
              <StatusBadge status={program.isClosed ? "Closed" : "Ongoing"} />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-3xl">🧑‍💼</span>
              <span className="text-4xl font-bold text-gray-900">{program.internCount}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total Interns</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'interns' && (
            <InternList program={program} />
          )}

          {activeTab === 'reviews' && (
            <ReviewRequestsTable
              program={program}
              reviews={reviews}
              mentorUser={mentorUser}
              onUpdateReview={handleUpdateReview}
              onSendMessage={handleAddMessage}
            />
          )}

          {activeTab === 'lessons' && (
            <ProgramLessons
              program={program}
              onAddLesson={handleAddLesson}
              onUpdateLesson={handleUpdateLesson}
              onDeleteLesson={handleDeleteLesson}
            />
          )}
        </div>
      </div>
    </div>
  );
}
