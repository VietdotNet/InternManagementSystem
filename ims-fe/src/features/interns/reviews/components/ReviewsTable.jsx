import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import StatusBadge  from "@/shared/components/StatusBadge";
import { useLocation } from "wouter";

function AttemptBadge({ attempt }) {
  const colors =
    attempt >= 2 ? "bg-yellow-400 text-yellow-900" : "bg-gray-500 text-white";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${colors}`}
      data-testid={`badge-attempt-${attempt}`}
    >
      Kiểm tra lần {attempt}
    </span>
  );
}

export function ReviewsTable({ reviews, isLoading }) {
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <span className="text-base">📋</span>
        <h3 className="font-semibold text-foreground">Các yêu cầu kiểm tra của bạn</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold">Lesson</th>
              <th className="text-left px-4 py-3 font-semibold">Attempt</th>
              <th className="text-left px-4 py-3 font-semibold">Created At</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Score</th>
              <th className="text-left px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {(!reviews || reviews.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No review requests found.
                </td>
              </tr>
            )}
            {reviews?.map((review) => (
              <tr
                key={review.id}
                className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                data-testid={`row-review-${review.id}`}
              >
                <td className="px-4 py-3 font-medium" data-testid={`text-review-lesson-${review.id}`}>
                  {review.lessonTitle}
                </td>
                <td className="px-4 py-3">
                  <AttemptBadge attempt={review.attempt} />
                </td>
                <td className="px-4 py-3 text-muted-foreground" data-testid={`text-review-date-${review.id}`}>
                  {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={review.status} />
                </td>
                <td className="px-4 py-3 font-medium" data-testid={`text-review-score-${review.id}`}>
                  {review.score != null ? review.score : "-"}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/review/${review.id}`)}
                    data-testid={`button-review-detail-${review.id}`}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
