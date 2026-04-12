import { ListChecks } from "lucide-react";
import { ReviewsFilter } from "../components/ReviewsFilter";
import { ReviewsTable } from "../components/ReviewsTable";
import { useReviews } from "../hooks/useReviews";

export function ReviewsPage() {
  const { reviews, isLoading, filters, handleFilterChange } = useReviews();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ListChecks className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
      </div>
      <ReviewsFilter filters={filters} onFilterChange={handleFilterChange} />
      <ReviewsTable reviews={reviews} isLoading={isLoading} />
    </div>
  );
}
