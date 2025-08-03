import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { TaskForm } from "@/components/task-form";
import { db } from "@/lib/db";

interface CreateTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateTaskPage({ params }: CreateTaskPageProps) {
  const session = await getSession();
  const { id } = await params;

  // Verify user has access to project (owner or member)
  const project = await db.project.findFirst({
    where: {
      id: id,
      OR: [
        { userId: session!.user.id }, // Project owner
        { members: { some: { userId: session!.user.id } } }, // Project member
      ],
    },
  });

  if (!project) {
    redirect("/protected/projects");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <TaskForm mode="create" projectId={id} />
    </div>
  );
} 