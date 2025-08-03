import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { taskServices } from "@/services";
import type { TaskFormData, TaskStatus } from "@/types";

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

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId, status }: { projectId: string; taskId: string; status: TaskStatus }) =>
      taskServices.updateTaskStatus(projectId, taskId, status),
    onMutate: async ({ projectId, taskId, status }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", projectId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", projectId], (old: unknown) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((task: unknown) =>
          task && typeof task === 'object' && 'id' in task && task.id === taskId 
            ? { ...task, status, updatedAt: new Date().toISOString() } 
            : task
        );
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onSuccess: () => {
      // Show success feedback (optional - since the UI updates immediately)
      console.log('Task status updated successfully');
    },
    onError: (err, { projectId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", projectId], context.previousTasks);
      }
      console.error("Error updating task status:", err);
      // You could add a toast notification here for error feedback
    },
    onSettled: (_, __, { projectId }) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
} 