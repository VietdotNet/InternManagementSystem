import { useState, useEffect } from "react";
import { useProgramSearch } from '../hooks/useProgramSearch.js';
import ProgramCard from '../components/ProgramCard.jsx';
import {getProgramsByMentor} from '../services/programService.js'

export default function ProgramsListPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query, setQuery, filtered } = useProgramSearch(programs);

    useEffect(() => {
    loadPrograms();
  }, []);


    const loadPrograms = async () => {
      try {
        setLoading(true);
        const data = await getProgramsByMentor();
        setPrograms(data);
      } catch (err) {
        console.error(err);
        alert("Load lessons failed");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📋 Chương trình đào tạo
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và giám sát chương trình được giao của bạn</p>
        </div>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search program..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">Không tìm thấy chương trình nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
           {filtered.map((program, index) => (
    <ProgramCard
      key={program.id ?? index}
      program={program}
    />
  ))}
        </div>
      )}
    </div>
  );
}
