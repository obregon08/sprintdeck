"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, X, AlertCircle } from "lucide-react";
import { useInviteUser } from "@/hooks/use-users";

interface InviteUserProps {
  projectId: string;
  onClose?: () => void;
}

export function InviteUser({ projectId, onClose }: InviteUserProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inviteUserMutation = useInviteUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setError(null);

    try {
      await inviteUserMutation.mutateAsync({
        email: email.trim(),
        projectId,
      });
      
      setEmail("");
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to invite user:", error);
      setError(error instanceof Error ? error.message : "Failed to send invitation");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Invite User</CardTitle>
            <CardDescription>
              Send an invitation to collaborate on this project
            </CardDescription>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
            />
          </div>
          
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm border rounded-md bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={inviteUserMutation.isPending || !email.trim()}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={inviteUserMutation.isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 