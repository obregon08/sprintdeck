import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { TaskForm } from "@/components/task-form";
import { db } from "@/lib/db";

interface EditTaskPageProps {
  params: Promise<{ id: string; taskId: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const session = await getSession();
  const { id, taskId } = await params;

  // Verify user has access to project (owner or member) and get task
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      projectId: id,
      project: {
        OR: [
          { userId: session!.user.id }, // Project owner
          { members: { some: { userId: session!.user.id } } }, // Project member
        ],
      },
    },
  });

  if (!task) {
    redirect(`/protected/projects/${id}`);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <TaskForm
        mode="edit"
        projectId={id}
        initialData={{
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId,
        }}
      />
    </div>
  );
} 