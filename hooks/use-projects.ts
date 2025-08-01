import { useQuery } from "@tanstack/react-query";
import { projectServices } from "@/services";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectServices.fetchProjects,
  });
} 