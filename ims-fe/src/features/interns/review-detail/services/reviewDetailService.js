import {
  useGetReview,
  getGetReviewQueryKey,
  useListMessages,
  getListMessagesQueryKey,
  useSendMessage,
} from "@/lib/api-client-react";

export function useReviewDetailQuery(reviewId, enabled) {
  return useGetReview(reviewId, {
    query: { enabled: !!reviewId && enabled, queryKey: getGetReviewQueryKey(reviewId ?? 0) },
  });
}

export function useMessagesQuery(reviewId, enabled) {
  return useListMessages(reviewId, {
    query: { enabled: !!reviewId && enabled, queryKey: getListMessagesQueryKey(reviewId ?? 0) },
  });
}

export function useSendMessageMutation() {
  return useSendMessage();
}

export { getGetReviewQueryKey, getListMessagesQueryKey };
