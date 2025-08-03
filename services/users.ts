export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface InviteUserData {
  email: string;
  projectId: string;
}

export interface ProjectMemberData {
  projectId: string;
  userId: string;
  role?: "OWNER" | "ADMIN" | "MEMBER";
}

const API_BASE = "/api/users";

export const userServices = {
  // Get all users (for demo purposes, in a real app this would be more restricted)
  async getUsers(): Promise<User[]> {
    const response = await fetch(API_BASE, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  },

  // Invite a user to a project
  async inviteUser(data: InviteUserData): Promise<void> {
    const response = await fetch(`/api/projects/${data.projectId}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: data.email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send invitation");
    }
  },

  // Get users assigned to tasks in a project
  async getProjectAssignees(projectId: string): Promise<User[]> {
    const response = await fetch(`/api/projects/${projectId}/assignees`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project assignees");
    }

    return response.json();
  },

  // Get project members
  async getProjectMembers(projectId: string): Promise<User[]> {
    const response = await fetch(`/api/projects/${projectId}/members`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project members");
    }

    return response.json();
  },

  // Add user to project
  async addProjectMember(data: ProjectMemberData): Promise<void> {
    const response = await fetch(`/api/projects/${data.projectId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: data.userId,
        role: data.role || "MEMBER",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add project member");
    }
  },
}; 