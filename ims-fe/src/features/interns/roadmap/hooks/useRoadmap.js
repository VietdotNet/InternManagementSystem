// import { useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import {
//   useProgramsQuery,
//   useTracksQuery,
//   // useLessonsQuery,
//   useCreateReviewMutation,
//   // getListLessonsQueryKey,
//   getListTracksQueryKey,
// } from "../services/roadmapService";
// import { useToast } from "@/shared/utils/useToast";

// export function useRoadmap() {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [reviewModalOpen, setReviewModalOpen] = useState(false);
//   const [expandedTracks, setExpandedTracks] = useState({});

//   const { data: programs, isLoading: programsLoading } = useProgramsQuery();
//   const program = programs?.[0] ?? null;

//   const { data: tracks, isLoading: tracksLoading } = useTracksQuery(program?.id ?? null);
//   const createReview = useCreateReviewMutation();

//   const toggleTrack = (trackId) => {
//     setExpandedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
//   };

//   const openReviewModal = (lesson) => {
//     setSelectedLesson(lesson);
//     setReviewModalOpen(true);
//   };

//   const closeReviewModal = () => {
//     setReviewModalOpen(false);
//     setSelectedLesson(null);
//   };

//   const submitReviewRequest = (data) => {
//     if (!selectedLesson) return;
//     createReview.mutate(
//       { data: { ...data, lessonId: selectedLesson.id } },
//       {
//         onSuccess: () => {
//           toast({ title: "Review Requested", description: "Your review request has been submitted." });
//           queryClient.invalidateQueries({ queryKey: getListLessonsQueryKey({ trackId: selectedLesson.trackId }) });
//           queryClient.invalidateQueries({ queryKey: getListTracksQueryKey({ programId: program?.id }) });
//           closeReviewModal();
//         },
//         onError: (error) => {
//           toast({ title: "Error", description: error.message ?? "Failed to submit request.", variant: "destructive" });
//         },
//       }
//     );
//   };

//   return {
//     program,
//     tracks,
//     isLoading: programsLoading || tracksLoading,
//     expandedTracks,
//     toggleTrack,
//     selectedLesson,
//     reviewModalOpen,
//     openReviewModal,
//     closeReviewModal,
//     submitReviewRequest,
//     createReview,
//   };
// }
