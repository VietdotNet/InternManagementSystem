import { LayoutDashboard } from "lucide-react";
import { DashboardSummary } from "../components/DashboardSummary";
import  {RecentReviews}  from "../components/RecentReviews";
import { useDashboard } from "../hooks/useDashboard";

export function InternDashboardPage() {
  const { summary, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardSummary />
      <RecentReviews reviews={summary?.recentReviews} isLoading={isLoading} />
    </div>
  );
}
