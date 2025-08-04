import type { TaskStatus } from "@/types";

const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export function SwimlaneSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {TASK_STATUSES.map((status) => (
        <div key={status} className="flex-1 min-h-[400px] p-4 rounded-lg border-2 border-dashed border-gray-200">
          <div className="mb-4">
            <div className="h-6 bg-muted rounded w-24 mb-2"></div>
            <div className="h-5 w-8 bg-muted rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 