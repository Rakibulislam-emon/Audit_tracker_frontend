import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCircle } from "lucide-react";

export default function AssignProblemDropdown({
  problem,
  users,
  onAssign,
  isLeadAuditor,
  isUpdating,
}) {
  const assignedUserId = problem.assignedTo?._id || problem.assignedTo;
  const assignedUserName = problem.assignedTo?.name;

  // If not lead auditor, just show the assigned user name
  if (!isLeadAuditor) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UserCircle className="h-4 w-4" />
        <span className={!assignedUserName ? "italic opacity-70" : ""}>
          {assignedUserName || "Unassigned"}
        </span>
      </div>
    );
  }

  return (
    <Select
      value={assignedUserId || "unassigned"}
      onValueChange={(value) =>
        onAssign(problem._id, value === "unassigned" ? null : value)
      }
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[160px] h-8 text-xs bg-background">
        <div className="flex items-center gap-2 truncate">
          <UserCircle className="h-3 w-3 opacity-70" />
          <span className="truncate">
            {users?.find((u) => u._id === assignedUserId)?.name ||
              assignedUserName ||
              "Assign User"}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned" className="text-muted-foreground italic">
          Unassigned
        </SelectItem>
        {users?.map((user) => (
          <SelectItem key={user._id} value={user._id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
