import type { ProjectFormData, ProjectWithTasks } from "@/types";

const API_BASE = "/api/projects";

export const projectServices = {
  // Fetch all projects for the authenticated user
  async fetchProjects(): Promise<ProjectWithTasks[]> {
    const response = await fetch(API_BASE, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    return response.json();
  },

  // Fetch a single project by ID
  async fetchProject(id: string): Promise<ProjectWithTasks> {
    const response = await fetch(`${API_BASE}/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }

    return response.json();
  },

  // Create a new project
  async createProject(data: ProjectFormData): Promise<ProjectWithTasks> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create project");
    }

    return response.json();
  },

  // Update an existing project
  async updateProject({ id, data }: { id: string; data: ProjectFormData }): Promise<ProjectWithTasks> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project");
    }

    return response.json();
  },

  // Delete a project
  async deleteProject(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete project");
    }

    return response.json();
  },
}; 