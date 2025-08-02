import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { TaskForm } from "@/components/task-form";
import { QueryProvider } from "@/components/query-provider";
import { db } from "@/lib/db";

interface CreateTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateTaskPage({ params }: CreateTaskPageProps) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  // Verify project belongs to user
  const project = await db.project.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  if (!project) {
    redirect("/protected/projects");
  }

  return (
    <QueryProvider>
      <div className="flex-1 w-full flex flex-col gap-8">
        <TaskForm mode="create" projectId={id} />
      </div>
    </QueryProvider>
  );
} 