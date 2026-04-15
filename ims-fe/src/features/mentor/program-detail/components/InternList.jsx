import { useState } from 'react';

export default function InternList({ program }) {
  const tracks = program?.tracks || [];

  const [expandedTracks, setExpandedTracks] = useState(() => {
    const init = {};
    program.tracks.forEach((t) => (init[t.trackId] = true));
    return init;
  });

  const statusMap = {
  1: "Unactivated",
  2: "Active",
  3: "Dropped",
};

    const totalInterns = tracks.reduce(
    (s, t) => s + (t.interns?.length || 0),
    0
  );

  function toggle(trackId) {
    setExpandedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  }

  return (
    <div className="space-y-4">
      {program.tracks.map((track) => (
        <div key={track.trackId} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => toggle(track.trackId)}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{track.icon}</span>
              <span className="font-semibold text-gray-800 text-sm">{track.trackName}</span>
              <span className="ml-2 px-2.5 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
                {track.interns.length} interns
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${expandedTracks[track.trackId] ? '' : '-rotate-180'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {expandedTracks[track.trackId] && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Họ & Tên</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Join Date</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(track.interns || []).map((intern, index) => (
                    <tr
                      key={`${track.trackId}-${index}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-gray-900 font-medium">
                        {intern.fullName}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {intern.email}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {intern.joinDate && intern.joinDate !== "0001-01-01T00:00:00"
                          ? new Date(intern.joinDate).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500 text-white">
                          {statusMap[intern.status] || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
