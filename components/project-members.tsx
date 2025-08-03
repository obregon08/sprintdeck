"use client";

import { useProjectMembers } from "@/hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Shield, UserCheck } from "lucide-react";

interface ProjectMembersProps {
  projectId: string;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "OWNER":
      return <Crown className="h-4 w-4 text-yellow-600" />;
    case "ADMIN":
      return <Shield className="h-4 w-4 text-blue-600" />;
    case "MEMBER":
      return <UserCheck className="h-4 w-4 text-green-600" />;
    default:
      return <User className="h-4 w-4 text-gray-600" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "OWNER":
      return "bg-yellow-100 text-yellow-800";
    case "ADMIN":
      return "bg-blue-100 text-blue-800";
    case "MEMBER":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ProjectMembers({ projectId }: ProjectMembersProps) {
  const { data: members, isLoading, error } = useProjectMembers(projectId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load project members</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                  {getRoleIcon(member.role || 'MEMBER')}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Badge className={getRoleColor(member.role || 'MEMBER')}>
                {member.role || 'MEMBER'}
              </Badge>
            </div>
          ))}
          {(!members || members.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              No members yet. Invite users to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 