// import {
//   // useListPrograms,
//   // // getListProgramsQueryKey,
//   // useListTracks,
//   // // getListTracksQueryKey,
//   // useListLessons,
//   // getListLessonsQueryKey,
//   useCreateReview,
// } from "@/lib/api-client-react";

// export function useProgramsQuery() {
//   return useListPrograms({
//     query: { queryKey: getListProgramsQueryKey() },
//   });
// }

// export function useTracksQuery(programId) {
//   return useListTracks(
//     { programId },
//     {
//       query: {
//         enabled: !!programId,
//         queryKey: getListTracksQueryKey({ programId }),
//       },
//     }
//   );
// }

// export function useLessonsQuery(trackId) {
//   return useListLessons(
//     { trackId },
//     {
//       query: {
//         enabled: !!trackId,
//         queryKey: getListLessonsQueryKey({ trackId }),
//       },
//     }
//   );
// }

// export function useCreateReviewMutation() {
//   return useCreateReview();
// }

// // export {
// //   getListProgramsQueryKey,
// //   getListTracksQueryKey,
// //   getListLessonsQueryKey,
// // };
