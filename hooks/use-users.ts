import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface InviteUserData {
  email: string;
  projectId: string;
}

// Fetch all users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}

// Fetch project assignees
export function useProjectAssignees(projectId: string) {
  return useQuery({
    queryKey: ["project-assignees", projectId],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch(`/api/projects/${projectId}/assignees`);
      if (!response.ok) {
        throw new Error("Failed to fetch project assignees");
      }
      return response.json();
    },
    enabled: !!projectId,
  });
}

// Fetch project members
export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch(`/api/projects/${projectId}/members`);
      if (!response.ok) {
        throw new Error("Failed to fetch project members");
      }
      return response.json();
    },
    enabled: !!projectId,
  });
}

// Get current user's role in a project
export function useMyProjectRole(projectId: string) {
  return useQuery({
    queryKey: ["my-project-role", projectId],
    queryFn: async (): Promise<{ role: string }> => {
      const response = await fetch(`/api/projects/${projectId}/my-role`);
      if (!response.ok) {
        throw new Error("Failed to fetch user role");
      }
      return response.json();
    },
    enabled: !!projectId,
  });
}

// Invite user to project
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteUserData): Promise<void> => {
      const response = await fetch(`/api/projects/${data.projectId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "Failed to send invitation");
      }
    },
    onSuccess: (_, { projectId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["project-assignees", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

// Remove user from project
export function useRemoveProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }): Promise<void> => {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "Failed to remove member");
      }
    },
    onSuccess: (_, { projectId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["project-assignees", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
} 