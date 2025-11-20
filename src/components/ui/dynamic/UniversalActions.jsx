// components/ui/dynamic/UniversalActions.jsx
"use client";

import { CheckCircle, Edit, MoreVertical, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { RequirementsButton } from "../approvals/RequirementsButton";

// Stores
import { useAuthStore } from "@/stores/useAuthStore";

// Services
import { approvalService } from "@/services/approvalService";
import { useQueryClient } from "@tanstack/react-query";

// =============================================================================
// SIMPLE APPROVAL ACTIONS
// =============================================================================

const SimpleApprovalActions = ({ approval }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient(); // ✅ ADD THIS

  const isAssignedApprover =
    user?._id === approval.approver?._id || user?.id === approval.approver?._id;
  const requirements = approval.requirements || [];
  const unmetRequirements = requirements.filter((req) => !req.completed);
  const canApprove = unmetRequirements.length === 0;

  // Show status if not assigned approver or already decided
  if (!isAssignedApprover || approval.approvalStatus !== "pending") {
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          approval.approvalStatus === "approved"
            ? "bg-green-100 text-green-800"
            : approval.approvalStatus === "rejected"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {approval.approvalStatus}
      </span>
    );
  }

  const handleAction = (type) => {
    if (type === "approve" && !canApprove) {
      toast.error("Complete all requirements first");
      return;
    }
    setActionType(type);
    setShowDialog(true);
  };

  const handleSubmit = async (comments = "") => {
    if (actionType === "reject" && !comments.trim()) {
      toast.error("Comments required for rejection");
      return;
    }

    setIsLoading(true);
    try {
      const result =
        actionType === "approve"
          ? await approvalService.approve(approval._id, comments, token)
          : await approvalService.reject(approval._id, comments, token);

      toast.success(
        `${actionType === "approve" ? "Approved" : "Rejected"} successfully`
      );

      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setShowDialog(false);
    } catch (error) {
      toast.error(`Failed to ${actionType}: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Requirements Button */}
        {requirements.length > 0 && <RequirementsButton approval={approval} />}

        {/* Approve Button */}
        <Button
          size="sm"
          variant="outline"
          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          onClick={() => handleAction("approve")}
          disabled={isLoading || !canApprove}
          title={
            !canApprove
              ? "Complete all requirements first"
              : "Approve this request"
          }
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </Button>

        {/* Reject Button */}
        <Button
          size="sm"
          variant="outline"
          className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          onClick={() => handleAction("reject")}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Request
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Optional comments"
                : "Required comments for rejection"}
            </DialogDescription>
          </DialogHeader>

          <CommentsForm
            actionType={actionType}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const CommentsForm = ({ actionType, onSubmit, isLoading }) => {
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    onSubmit(comments);
    setComments("");
  };

  return (
    <>
      <div className="py-4">
        <Textarea
          placeholder={
            actionType === "approve"
              ? "Optional comments..."
              : "Reason for rejection..."
          }
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setShowDialog(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (actionType === "reject" && !comments.trim())}
          className={
            actionType === "approve"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }
        >
          {isLoading ? "Processing..." : actionType}
        </Button>
      </DialogFooter>
    </>
  );
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const hasPermission = (action, moduleConfig, userRole) => {
  if (!action.action || !moduleConfig.permissions[action.action]) {
    return true;
  }
  return moduleConfig.permissions[action.action].includes(userRole);
};

const shouldShowAction = (action, item) => {
  if (!action.showWhen) return true;
  const { field, value } = action.showWhen;
  const fieldValue = item[field];
  return fieldValue === value;
};

const getFilteredCustomActions = (moduleConfig, userRole, item) => {
  if (!moduleConfig.customActions) return [];
  return moduleConfig.customActions.filter(
    (action) =>
      hasPermission(action, moduleConfig, userRole) &&
      shouldShowAction(action, item)
  );
};

const getActionIcon = (actionType, className = "h-4 w-4 mr-2") => {
  const ACTION_ICONS = {
    start: Play,
    cancel: Ban,
    viewDetails: Eye,
    edit: Edit,
    delete: Trash2,
    approve: CheckCircle,
    reject: XCircle,
  };
  const IconComponent = ACTION_ICONS[actionType] || Play;
  return <IconComponent className={className} />;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const DesktopActionButton = ({ action, item, onCustomAction }) => {
  const icon = getActionIcon(action.action);
  if (action.type === "link") {
    const href = action.href.replace(":id", item._id);
    return (
      <Button asChild variant="outline" size="sm" key={action.action}>
        <Link href={href}>
          {icon}
          {action.label}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      key={action.action}
      variant="outline"
      size="sm"
      onClick={() => onCustomAction(action, item)}
    >
      {icon}
      {action.label}
    </Button>
  );
};

const MobileDropdownItem = ({ action, item, onCustomAction }) => {
  const icon = getActionIcon(action.action);
  if (action.type === "link") {
    const href = action.href.replace(":id", item._id);
    return (
      <DropdownMenuItem asChild key={action.action}>
        <Link href={href}>
          {icon}
          {action.label}
        </Link>
      </DropdownMenuItem>
    );
  }
  return (
    <DropdownMenuItem
      key={action.action}
      onClick={() => onCustomAction(action, item)}
    >
      {icon}
      {action.label}
    </DropdownMenuItem>
  );
};

const EditButton = ({ onEdit, item }) => (
  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </Button>
);

const DeleteButton = ({ onDelete, item }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => onDelete(item)}
    className="text-red-600 hover:bg-red-50"
  >
    <Trash2 className="h-4 w-4 mr-2" />
    Delete
  </Button>
);

// =============================================================================
// MAIN COMPONENT SECTIONS
// =============================================================================

const DesktopActionsView = ({
  canEdit,
  canDelete,
  customActions,
  item,
  onEdit,
  onDelete,
  onCustomAction,
  moduleConfig,
  userRole,
}) => {
  if (moduleConfig.endpoint === "approvals" && item.approvalStatus) {
    return <SimpleApprovalActions approval={item} />;
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      {canEdit && <EditButton onEdit={onEdit} item={item} />}
      {customActions.map((action) => (
        <DesktopActionButton
          key={action.action}
          action={action}
          item={item}
          onCustomAction={onCustomAction}
        />
      ))}
      {canDelete && <DeleteButton onDelete={onDelete} item={item} />}
    </div>
  );
};

const MobileActionsView = ({
  canEdit,
  canDelete,
  customActions,
  item,
  onEdit,
  onDelete,
  onCustomAction,
  moduleConfig,
  userRole,
}) => {
  if (moduleConfig.endpoint === "approvals" && item.approvalStatus) {
    return (
      <div className="md:hidden">
        <SimpleApprovalActions approval={item} />
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEdit && (
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          {customActions.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {customActions.map((action) => (
                <MobileDropdownItem
                  key={action.action}
                  action={action}
                  item={item}
                  onCustomAction={onCustomAction}
                />
              ))}
            </>
          )}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalActions({
  item,
  moduleConfig,
  onEdit,
  onDelete,
  onCustomAction,
}) {
  const { user } = useAuthStore();
  const userRole = user?.role;

  const canEdit = moduleConfig.permissions.edit?.includes(userRole) ?? false;
  const canDelete =
    moduleConfig.permissions.delete?.includes(userRole) ?? false;
  const customActions = getFilteredCustomActions(moduleConfig, userRole, item);

  return (
    <>
      <DesktopActionsView
        canEdit={canEdit}
        canDelete={canDelete}
        customActions={customActions}
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
        onCustomAction={onCustomAction}
        moduleConfig={moduleConfig}
        userRole={userRole}
      />

      <MobileActionsView
        canEdit={canEdit}
        canDelete={canDelete}
        customActions={customActions}
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
        onCustomAction={onCustomAction}
        moduleConfig={moduleConfig}
        userRole={userRole}
      />
    </>
  );
}
