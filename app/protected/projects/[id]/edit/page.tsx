import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { ProjectForm } from "@/components/project-form";
import { db } from "@/lib/db";
import type { EditProjectPageProps } from "@/types";

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getSession();
  const { id } = await params;

  // Fetch the project data for editing
  const project = await db.project.findFirst({
    where: {
      id: id,
      userId: session!.user.id,
    },
  });

  if (!project) {
    redirect("/protected/projects");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <ProjectForm 
        mode="edit" 
        initialData={{
          id: project.id,
          name: project.name,
          description: project.description,
        }}
      />
    </div>
  );
} 