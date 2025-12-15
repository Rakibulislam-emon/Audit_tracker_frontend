"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { useQuestionAssignments } from "@/hooks/useQuestionAssignments";

export default function AssignmentDropdown({
  session,
  question,
  teamMembers = [],
  currentAssignment,
  isLeadAuditor,
}) {
  const { useAssignQuestion, useUnassignQuestion } = useQuestionAssignments();
  const assignMutation = useAssignQuestion(session._id);
  const unassignMutation = useUnassignQuestion(session._id);

  const [isHovered, setIsHovered] = useState(false);

  const isLoading = assignMutation.isPending || unassignMutation.isPending;

  const handleAssign = (userId) => {
    if (userId === "unassigned") {
      if (currentAssignment) {
        unassignMutation.mutate(currentAssignment._id);
      }
      return;
    }
    assignMutation.mutate({
      questionId: question._id,
      assignedTo: userId,
    });
  };

  const assignedUser = currentAssignment?.assignedTo;

  // --- 1. Read-Only View (Regular Auditor) ---
  if (!isLeadAuditor) {
    if (!assignedUser) return null; // Or show "Unassigned" badge?
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
      >
        <UserPlus className="h-3 w-3" />
        Assigned to: {assignedUser.name}
      </Badge>
    );
  }

  // --- 2. Edit View (Lead Auditor) ---
  return (
    <div className="flex items-center gap-2">
      <div className="w-[200px]">
        <Select
          disabled={isLoading}
          value={assignedUser?._id || "unassigned"}
          onValueChange={handleAssign}
        >
          <SelectTrigger className="h-8 text-sm">
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-2" />
            ) : (
              <UserPlus className="h-3 w-3 mr-2 text-gray-500" />
            )}
            <SelectValue placeholder="Assign Auditor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">
              <span className="text-gray-400 italic">Unassigned</span>
            </SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.user._id} value={member.user._id}>
                {member.user.name} ({member.roleInTeam})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Unassign Button (Optional, can just use dropdown) */}
      {assignedUser && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => unassignMutation.mutate(currentAssignment._id)}
          disabled={isLoading}
          title="Remove Assignment"
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
