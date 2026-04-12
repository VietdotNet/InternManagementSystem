import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { LessonRow } from "./LessonRow";
// import { useLessonsQuery } from "../services/roadmapService";

export function TrackSection({ track, expanded, onToggle, onRequestReview }) {
  const { data: lessons, isLoading } = useLessonsQuery(track.id);
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const completion = track.completionPercent ?? 0;

  return (
    <div className="border rounded-lg overflow-hidden" data-testid={`track-${track.id}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(track.id)}
        data-testid={`button-toggle-track-${track.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="text-left min-w-0">
            <h3 className="font-semibold text-foreground truncate">{track.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lessons?.length ?? 0} lessons
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <div className="hidden sm:flex items-center gap-3">
            <Progress value={completion} className="w-28 h-2" />
            <span className="text-sm font-medium w-10 text-right">{completion}%</span>
          </div>
          <ChevronIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </button>

      {expanded && (
        <div className="border-t">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-2 font-semibold">Lesson</th>
                    <th className="text-center px-4 py-2 font-semibold">Attempts</th>
                    <th className="text-center px-4 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(!lessons || lessons.length === 0) && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-muted-foreground text-sm">
                        No lessons found.
                      </td>
                    </tr>
                  )}
                  {lessons?.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      onRequestReview={onRequestReview}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
