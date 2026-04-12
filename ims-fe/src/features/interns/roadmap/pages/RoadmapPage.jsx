import { Map } from "lucide-react";
import { TrackSection } from "../components/TrackSection";
import { RequestReviewModal } from "../components/RequestReviewModal";
// import { useRoadmap } from "../hooks/useRoadmap";

export function RoadmapPage() {
  const {
    program,
    tracks,
    isLoading,
    expandedTracks,
    toggleTrack,
    selectedLesson,
    reviewModalOpen,
    openReviewModal,
    closeReviewModal,
    submitReviewRequest,
    createReview,
  } = useRoadmap();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Map className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training Roadmap</h1>
          {program && (
            <p className="text-sm text-muted-foreground mt-0.5">
              [{program.code}] {program.name}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !tracks || tracks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No training tracks found.
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => (
            <TrackSection
              key={track.id}
              track={track}
              expanded={!!expandedTracks[track.id]}
              onToggle={toggleTrack}
              onRequestReview={openReviewModal}
            />
          ))}
        </div>
      )}

      <RequestReviewModal
        lesson={selectedLesson}
        open={reviewModalOpen}
        onClose={closeReviewModal}
        onSubmit={submitReviewRequest}
        isPending={createReview.isPending}
      />
    </div>
  );
}
