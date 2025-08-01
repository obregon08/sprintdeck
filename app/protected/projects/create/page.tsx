import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { ProjectForm } from "@/components/project-form";
import { QueryProvider } from "@/components/query-provider";

export default async function CreateProjectPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <QueryProvider>
      <div className="flex-1 w-full flex flex-col gap-8">
        <ProjectForm mode="create" />
      </div>
    </QueryProvider>
  );
} 