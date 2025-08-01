"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreateProject, useUpdateProject } from "@/hooks";
import type { ProjectFormData, ProjectFormProps } from "@/types";
import { useRouter } from "next/navigation";

export function ProjectForm({ mode = "create", initialData }: ProjectFormProps) {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const onSubmit = (data: ProjectFormData) => {
    if (mode === "create") {
      createProjectMutation.mutate(data);
    } else if (mode === "edit" && initialData) {
      updateProjectMutation.mutate({ id: initialData.id, data });
    }
  };

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/protected/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === "create" ? "Create New Project" : "Edit Project"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "create"
              ? "Create a new project to organize your tasks and track progress."
              : "Update your project details."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Project name is required",
                minLength: {
                  value: 1,
                  message: "Project name cannot be empty",
                },
                maxLength: {
                  value: 100,
                  message: "Project name cannot exceed 100 characters",
                },
              })}
              placeholder="Enter project name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
              placeholder="Enter project description (optional)"
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>{mode === "create" ? "Create Project" : "Update Project"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/protected/projects")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 