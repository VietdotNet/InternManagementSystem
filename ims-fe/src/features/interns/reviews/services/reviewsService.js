import {
  useListReviews,
  getListReviewsQueryKey,
  useListPrograms,
  getListProgramsQueryKey,
} from "@/lib/api-client-react";

export function useReviewsQuery(params = {}) {
  return useListReviews(params, {
    query: { queryKey: getListReviewsQueryKey(params) },
  });
}

export function useProgramsQuery() {
  return useListPrograms({
    query: { queryKey: getListProgramsQueryKey() },
  });
}

export { getListReviewsQueryKey };
