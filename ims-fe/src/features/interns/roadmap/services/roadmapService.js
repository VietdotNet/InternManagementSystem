import {
  useListPrograms,
  getListProgramsQueryKey,
  useGetProgram,
  getGetProgramQueryKey,
  useListLessons,
  getListLessonsQueryKey,
  useCreateReview,
} from "@/lib/api-client-react";

export function useProgramsQuery() {
  return useListPrograms({
    query: { queryKey: getListProgramsQueryKey() },
  });
}

export function useProgramDetailQuery(programId) {
  return useGetProgram(programId, {
    query: {
      enabled: !!programId,
      queryKey: getGetProgramQueryKey(programId ?? 0),
    },
  });
}

export function useLessonsQuery(trackId) {
  return useListLessons(
    { trackId },
    {
      query: {
        enabled: !!trackId,
        queryKey: getListLessonsQueryKey({ trackId }),
      },
    }
  );
}

export function useCreateReviewMutation() {
  return useCreateReview();
}

export {
  getListProgramsQueryKey,
  getGetProgramQueryKey,
  getListLessonsQueryKey,
};
