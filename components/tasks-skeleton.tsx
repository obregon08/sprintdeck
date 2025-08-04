import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TasksSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-muted rounded w-24"></div>
        <div className="h-9 w-24 bg-muted rounded"></div>
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
                <div className="flex gap-2 ml-4">
                  <div className="h-8 w-8 bg-muted rounded"></div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded"></div>
                <div className="h-5 w-12 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 