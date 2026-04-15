import { useState, useEffect } from 'react';
import ManageLessonsModal from './ManageLessonsModal.jsx';
import { getLessonsByTrack } from '../services/lessonService.js';

export default function ProgramLessons({
  program,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson
}) {
  const [managingTrack, setManagingTrack] = useState(null);
  const [trackList, setTrackList] = useState([]);

  const totalTracks = trackList.length;

  useEffect(() => {
  if (!program?.tracks?.length) {
    setTrackList([]);
    return;
  }

  const loadLessons = async () => {
    try {
   const updated = await Promise.all(
  program.tracks.map(async (track) => {
    const trackId = track.trackId;

    if (!trackId) {
      console.error("Track không có ID:", track);
      return { ...track, lessons: [] };
    }

    const data = await getLessonsByTrack(trackId);

    return {
      ...track,
      lessons: data || []
    };
  })
);

      setTrackList(updated);
    } catch (err) {
      console.error(err);
      alert("Load lessons failed");
    }
  };

  loadLessons();
}, [program]);

  // 👉 handlers
  function handleAdd(trackId, name, order) {
    onAddLesson(trackId, name, order);
  }

  function handleEdit(trackId, lessonId, name, order) {
    onUpdateLesson(trackId, lessonId, name, order);
  }

  function handleDelete(trackId, lessonId) {
    onDeleteLesson(trackId, lessonId);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
          🏫 Program Lessons
        </h2>
        <p className="text-sm text-gray-500">
          Tổng số chương trình: {totalTracks}
        </p>
      </div>

      <div className="space-y-4">
        {trackList.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
              <span className="font-semibold text-gray-800">
                {track.trackName}
              </span>
              <button
                onClick={() => setManagingTrack(track)}
                className="px-3.5 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Cập nhật
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {(track.lessons || []).length === 0 ? (
                <p className="px-5 py-4 text-sm text-gray-400 italic">
                  Chưa có bài học nào.
                </p>
              ) : (
                track.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between px-5 py-3.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-blue-500 text-sm">♦</span>
                      <span className="text-sm text-gray-800">
                        {lesson.lessonName}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-gray-600 text-white text-xs font-medium rounded-lg">
                      Order: {lesson.orderIndex}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {managingTrack && (
        <ManageLessonsModal
          track={managingTrack}
          programId={program.programId}
          onClose={() => setManagingTrack(null)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}