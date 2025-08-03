"use client";

import { useState } from "react";
import { useProjectMembers, useRemoveProjectMember, useMyProjectRole } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Crown, Shield, UserCheck, Users, X } from "lucide-react";

interface ProjectMembersModalProps {
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

export function ProjectMembersModal({ projectId }: ProjectMembersModalProps) {
  const { data: members, isLoading, error } = useProjectMembers(projectId);
  const { data: myRole } = useMyProjectRole(projectId);
  const removeMember = useRemoveProjectMember();
  
  // State for confirmation dialog
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync({ projectId, userId });
      setIsConfirmDialogOpen(false);
      setMemberToRemove(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
      // You could add toast notification here
    }
  };

  const openConfirmDialog = (member: { id: string; name: string }) => {
    setMemberToRemove(member);
    setIsConfirmDialogOpen(true);
  };

  // Check if current user has permission to remove members (OWNER or ADMIN)
  const canRemoveMembers = myRole?.role === 'OWNER' || myRole?.role === 'ADMIN';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Members ({members?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-3">
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
          )}

          {error && (
            <p className="text-destructive">Failed to load project members</p>
          )}

          {!isLoading && !error && (
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
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(member.role || 'MEMBER')}>
                      {member.role || 'MEMBER'}
                    </Badge>
                    {canRemoveMembers && member.role !== 'OWNER' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openConfirmDialog({ id: member.id, name: member.name || member.email || 'Unknown User' })}
                        disabled={removeMember.isPending}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {(!members || members.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No members yet. Invite users to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from this project? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setMemberToRemove(null);
              }}
              disabled={removeMember.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove.id)}
              disabled={removeMember.isPending}
            >
              {removeMember.isPending ? "Removing..." : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
} 