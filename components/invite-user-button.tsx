"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { InviteUser } from "@/components/invite-user";

interface InviteUserButtonProps {
  projectId: string;
}

export function InviteUserButton({ projectId }: InviteUserButtonProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInviteForm(true)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite User
      </Button>

      {showInviteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <InviteUser
              projectId={projectId}
              onClose={() => setShowInviteForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
} 