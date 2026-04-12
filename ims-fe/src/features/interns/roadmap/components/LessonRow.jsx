import { CheckCircle2, Circle, Loader2, Lock, ClipboardList } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const statusIcon = {
  Passed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  InProgress: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
  NotStarted: <Circle className="h-4 w-4 text-gray-400" />,
};

export function LessonRow({ lesson, onRequestReview }) {
  const locked = lesson.requiresPrevious && lesson.status === "NotStarted";
  const Icon = locked
    ? () => <Lock className="h-4 w-4 text-gray-400" />
    : () => statusIcon[lesson.status] || <Circle className="h-4 w-4 text-gray-400" />;

  return (
    <tr
      className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${locked ? "opacity-60" : ""}`}
      data-testid={`row-lesson-${lesson.id}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Icon />
          <span className={`text-sm font-medium ${locked ? "text-muted-foreground" : ""}`}>
            {lesson.title}
          </span>
          {locked && (
            <span className="ml-1 text-xs text-muted-foreground italic">
              (Complete previous lesson first)
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-center text-muted-foreground">
        {lesson.attempts ?? 0}/{lesson.maxAttempts ?? 3}
      </td>
      <td className="px-4 py-3 text-center">
        {lesson.canRequestReview && !locked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRequestReview(lesson)}
            className="flex items-center gap-1"
            data-testid={`button-request-review-${lesson.id}`}
          >
            <ClipboardList className="h-3 w-3" />
            Request Review
          </Button>
        ) : lesson.status === "Passed" ? (
          <span className="text-xs text-green-600 font-medium">✓ Passed</span>
        ) : locked ? (
          <span className="text-xs text-muted-foreground">Locked</span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>
    </tr>
  );
}
