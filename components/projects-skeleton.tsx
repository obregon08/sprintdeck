import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
              <div className="flex gap-2 ml-4">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-12"></div>
                <div className="h-5 w-8 bg-muted rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-muted rounded mr-2"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 