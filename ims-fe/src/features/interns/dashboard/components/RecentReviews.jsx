import { format } from "date-fns";
import { useLocation } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { Pencil, ArrowRight } from "lucide-react";
import  StatusBadge  from "@/shared/components/StatusBadge";

function AttemptBadge({ attempt }) {
  const colors = attempt >= 2 ? "bg-yellow-400 text-yellow-900" : "bg-gray-500 text-white";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors}`}>
      Lần {attempt}
    </span>
  );
}

export function RecentReviews({ reviews, isLoading }) {
  const [, setLocation] = useLocation();

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-foreground">Recent Review Requests</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/reviews")}
          className="flex items-center gap-1 text-primary"
          data-testid="button-view-all-reviews"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No recent reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-2 font-semibold">Lesson</th>
                <th className="text-left px-4 py-2 font-semibold">Attempt</th>
                <th className="text-left px-4 py-2 font-semibold">Date</th>
                <th className="text-left px-4 py-2 font-semibold">Status</th>
                <th className="text-left px-4 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                  data-testid={`row-recent-review-${review.id}`}
                >
                  <td className="px-4 py-2 font-medium">{review.lessonTitle}</td>
                  <td className="px-4 py-2">
                    <AttemptBadge attempt={review.attempt} />
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/review/${review.id}`)}
                      data-testid={`button-recent-review-${review.id}`}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
