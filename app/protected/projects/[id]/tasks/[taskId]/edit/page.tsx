import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { TaskForm } from "@/components/task-form";
import { QueryProvider } from "@/components/query-provider";
import { db } from "@/lib/db";

interface EditTaskPageProps {
  params: Promise<{ id: string; taskId: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const session = await getSession();
  const { id, taskId } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  // Verify project belongs to user and get task
  const task = await db.task.findFirst({
    where: {
      id: taskId,
      projectId: id,
      project: {
        userId: session.user.id,
      },
    },
  });

  if (!task) {
    redirect(`/protected/projects/${id}`);
  }

  return (
    <QueryProvider>
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
    </QueryProvider>
  );
} 