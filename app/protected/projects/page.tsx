import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProjectsList } from "@/components/projects-list";
import { QueryProvider } from "@/components/query-provider";

export default async function ProjectsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <QueryProvider>
      <div className="flex-1 w-full flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Link href="/protected/projects/create">
            <Button>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </Link>
        </div>
        
        <ProjectsList />
      </div>
    </QueryProvider>
  );
} 