import { ProjectForm } from "@/components/project-form";

export default async function CreateProjectPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <ProjectForm mode="create" />
    </div>
  );
} 