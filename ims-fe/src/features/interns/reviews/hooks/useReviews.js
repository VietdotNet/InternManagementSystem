import { useState } from "react";
import { useReviewsQuery } from "../services/reviewsService";

export function useReviews() {
  const [filters, setFilters] = useState({
    status: "All",
    trackId: "",
    attempt: "",
    search: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const queryParams = {};
  if (filters.status && filters.status !== "All") queryParams.status = filters.status;
  if (filters.trackId) queryParams.trackId = parseInt(filters.trackId);
  if (filters.attempt) queryParams.attempt = parseInt(filters.attempt);
  if (filters.search) queryParams.search = filters.search;

  const { data: reviews, isLoading } = useReviewsQuery(queryParams);

  return { reviews, isLoading, filters, handleFilterChange };
}
