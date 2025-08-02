import { useQuery } from "@tanstack/react-query";
import { taskServices } from "@/services";

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => taskServices.fetchTasks(projectId),
    enabled: !!projectId,
  });
}

export function useTask(projectId: string, taskId: string) {
  return useQuery({
    queryKey: ["tasks", projectId, taskId],
    queryFn: () => taskServices.fetchTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
} 