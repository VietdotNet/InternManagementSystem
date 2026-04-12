import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@/lib/api-client-react";

export function useDashboardSummaryQuery() {
  return useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() },
  });
}

export { getGetDashboardSummaryQueryKey };
