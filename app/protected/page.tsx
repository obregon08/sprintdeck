import { redirect } from "next/navigation";

export default function ProtectedPage(): void {
  redirect("/protected/projects");
}
