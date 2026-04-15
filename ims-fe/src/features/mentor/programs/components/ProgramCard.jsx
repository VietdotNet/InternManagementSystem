import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';

export default function ProgramCard({ program }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#d0eef8] border border-[#a8d8ea] rounded-xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-gray-900 text-sm leading-snug">
           {program.programName}
        </h3>
        <StatusBadge status={program.isClosed ? "Closed" : "Ongoing"}  />
      </div>

      <p className="text-xs text-gray-600 mb-3">
        📅 {program.startDate} - {program.endDate}
      </p>

      <p className="text-sm text-gray-700 mb-4">
        🧑‍💼 Interns: <span className="font-semibold">{program.internCount}</span>
      </p>

      <button
        onClick={() => navigate(`/mentor/programs/${program.programId}`)}
        className="px-4 py-1.5 text-sm font-medium border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition"
      >
        View Details
      </button>
    </div>
  );
}
