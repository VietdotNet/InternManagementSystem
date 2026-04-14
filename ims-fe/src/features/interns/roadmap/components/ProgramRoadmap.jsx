import { useListPrograms, useGetProgram, getGetProgramQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { TrackSection } from "./TrackSection";
import { CalendarDays } from "lucide-react";

function StatusBadge({ status }) {
  const colors = {
    Ongoing: "bg-green-500 text-white",
    Completed: "bg-gray-500 text-white",
    Upcoming: "bg-blue-500 text-white",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-semibold ${colors[status] || "bg-gray-500 text-white"}`}
      data-testid="badge-program-status"
    >
      {status}
    </span>
  );
}

export function ProgramRoadmap() {
  const { data: programs, isLoading: loadingPrograms } = useListPrograms();
  const firstProgram = programs?.[0];

  const { data: programDetail, isLoading: loadingDetail } = useGetProgram(
    firstProgram?.id,
    {
      query: {
        enabled: !!firstProgram?.id,
        queryKey: getGetProgramQueryKey(firstProgram?.id ?? 0),
      },
    }
  );

  if (loadingPrograms || loadingDetail) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!programDetail) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No training program found.
      </div>
    );
  }

  const { program, tracks } = programDetail;

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-5 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground" data-testid="text-program-name">
              [{program.code}] {program.name}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span data-testid="text-program-dates">{program.startDate} - {program.endDate}</span>
            </div>
          </div>
          <StatusBadge status={program.status} />
        </div>
      </div>

      <div>
        {tracks.map(track => (
          <TrackSection
            key={track.id}
            track={track}
            programId={program.id}
          />
        ))}
      </div>
    </div>
  );
}
