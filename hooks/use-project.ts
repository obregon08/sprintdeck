import { useQuery } from "@tanstack/react-query";
import { projectServices } from "@/services";

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectServices.fetchProject(id),
    enabled: !!id,
  });
} 