import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { taskServices } from "@/services";
import type { TaskFormData } from "@/types";

export function useCreateTask() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: TaskFormData }) =>
      taskServices.createTask(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/protected/projects/${projectId}`);
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ projectId, taskId, data }: { projectId: string; taskId: string; data: TaskFormData }) =>
      taskServices.updateTask(projectId, taskId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/protected/projects/${projectId}`);
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) =>
      taskServices.deleteTask(projectId, taskId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });
} 