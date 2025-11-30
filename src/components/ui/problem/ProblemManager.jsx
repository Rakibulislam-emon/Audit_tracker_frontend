"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { useDeleteModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Loader2, Trash2, Wrench } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FixActionManager from "../fixAction/FixActionManager";

// =============================================================================
// CONSTANTS
// =============================================================================

const MODULE_NAME = "problems";
const FIX_ACTION_PERMITTED_ROLES = [
  "admin",
  "sysadmin",
  "compliance_officer",
  "auditor",
];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Loading state for problems list
 */
const ProblemsLoadingState = () => (
  <div className="flex items-center justify-center p-8 text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin mr-3" />
    <span className="text-sm">Loading problems...</span>
  </div>
);

/**
 * Empty state for problems list
 */
const ProblemsEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
    <AlertCircle className="h-8 w-8 mb-2" />
    <p className="text-sm font-medium">No problems logged</p>
    <p className="text-xs mt-1">
      No problems have been recorded for this session yet
    </p>
  </div>
);

/**
 * Risk rating badge with consistent styling
 */
const RiskRatingBadge = ({ riskRating }) => {
  const getRiskBadgeVariant = (rating) => {
    switch (rating?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Badge
      variant={getRiskBadgeVariant(riskRating)}
      className="text-xs font-medium"
    >
      {riskRating} Risk
    </Badge>
  );
};

/**
 * Status badge with consistent styling
 */
const StatusBadge = ({ status }) => (
  <Badge variant="secondary" className="text-xs font-medium">
    {status}
  </Badge>
);

/**
 * Individual problem row component
 */
const ProblemRow = ({
  problem,
  canManageFixActions,
  onOpenFixActions,
  onDelete,
  isDeleting,
}) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
    {/* Problem Details */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-1">
            {problem.title}
          </p>
          {problem.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {problem.description.length > 70
                ? `${problem.description.substring(0, 70)}...`
                : problem.description}
            </p>
          )}

          {/* Problem Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>
              <strong>Created:</strong>{" "}
              {new Date(problem.createdAt).toLocaleDateString()}
            </span>
            {problem.dueDate && (
              <span>
                <strong>Due:</strong>{" "}
                {new Date(problem.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons & Badges */}
    <div className="flex items-center gap-3">
      {/* Risk Rating Badge */}
      <RiskRatingBadge riskRating={problem.riskRating} />

      {/* Status Badge */}
      <StatusBadge status={problem.problemStatus} />

      {/* Fix Actions Button (Role-Based) */}
      {canManageFixActions && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenFixActions(problem)}
          className="flex items-center gap-2"
        >
          <Wrench className="h-4 w-4" />
          <span className="hidden sm:inline">Fix Actions</span>
        </Button>
      )}

      {/* Delete Button - Admin/SysAdmin/Auditor Only */}
      {["admin", "sysadmin", "auditor"].includes(
        useAuthStore.getState().user?.role
      ) && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(problem._id)}
          disabled={isDeleting}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  </div>
);

/**
 * Problems list component
 */
const ProblemsList = ({
  problems,
  isLoading,
  canManageFixActions,
  onOpenFixActions,
  onDeleteProblem,
  isDeleting,
}) => (
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">
        Problems ({problems.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {isLoading && <ProblemsLoadingState />}

      {!isLoading && problems.length === 0 && <ProblemsEmptyState />}

      {!isLoading && problems.length > 0 && (
        <div className="divide-y">
          {problems.map((problem) => (
            <ProblemRow
              key={problem._id}
              problem={problem}
              canManageFixActions={canManageFixActions}
              onOpenFixActions={onOpenFixActions}
              onDelete={onDeleteProblem}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ProblemManager({
  session,
  problemList,
  isLoading,
  refetch,
}) {
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================

  const { token, user } = useAuthStore();
  const [isFixActionModalOpen, setIsFixActionModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // ===========================================================================
  // MUTATIONS
  // ===========================================================================

  const { mutate: deleteProblem, isPending: isDeleting } = useDeleteModule(
    MODULE_NAME,
    token
  );

  // ===========================================================================
  // PERMISSION CHECKS
  // ===========================================================================

  /**
   * Checks if current user can manage fix actions
   */
  const canManageFixActions = FIX_ACTION_PERMITTED_ROLES.includes(user?.role);

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles problem deletion with confirmation
   */
  const handleDeleteProblem = (problemId) => {
    toast.warning("Are you sure you want to delete this problem?", {
      action: {
        label: "Confirm",
        onClick: () => {
          deleteProblem(problemId, {
            onSuccess: () => {
              toast.success("Problem deleted successfully");
              refetch();
            },
            onError: (err) => toast.error(err.message),
          });
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  /**
   * Opens fix action manager for a specific problem
   */
  const handleOpenFixActionManager = (problem) => {
    console.log("🎯 Opening Fix Actions for problem:", problem._id);
    setSelectedProblem(problem);
    setIsFixActionModalOpen(true);
  };

  /**
   * Closes fix action modal and cleans up state
   */
  const handleCloseFixActionModal = () => {
    setIsFixActionModalOpen(false);
    setSelectedProblem(null);
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <>
      {/* 🎯 Problems List */}
      <ProblemsList
        problems={problemList}
        isLoading={isLoading}
        canManageFixActions={canManageFixActions}
        onOpenFixActions={handleOpenFixActionManager}
        onDeleteProblem={handleDeleteProblem}
        isDeleting={isDeleting}
      />

      {/* 🎯 Fix Action Management Modal */}
      {isFixActionModalOpen && selectedProblem && (
        <Modal
          isOpen={isFixActionModalOpen}
          onClose={handleCloseFixActionModal}
          size="xl"
        >
          <div className="p-1">
            <FixActionManager
              problem={selectedProblem}
              onClose={handleCloseFixActionModal}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
