import { useDashboardSummaryQuery } from "../services/dashboardService";

export function useDashboard() {
  const { data: summary, isLoading, error } = useDashboardSummaryQuery();
  return { summary, isLoading, error };
}
