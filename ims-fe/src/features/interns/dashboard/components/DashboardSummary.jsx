import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardSummary() {
  const { summary, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !summary) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card data-testid="card-summary-total">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-summary-total-lessons">
            {summary.totalLessons}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-summary-passed">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Passed Lessons</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-summary-passed-lessons">
            {summary.passedLessons}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-summary-pending">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-summary-pending-reviews">
            {summary.pendingReviews}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-summary-progress">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold" data-testid="text-summary-progress-percent">
              {summary.overallProgress}%
            </div>
            <Progress value={summary.overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
