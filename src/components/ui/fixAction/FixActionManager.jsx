// FILE: audit-frontend/src/components/ui/fix-action/FixActionManager.jsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { useDeleteModule, useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AlertCircle,
  Edit,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProofUploader from "../proof/ProofUploader"; // ✅ NEW IMPORT
import FixActionForm from "./FixActionForm";

// =============================================================================
// CONSTANTS
// =============================================================================
const MODULE_NAME = "fixActions";

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Loading state for fix actions list
 */
const FixActionsLoadingState = () => (
  <div className="flex items-center justify-center p-8 text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin mr-3" />
    <span className="text-sm">Loading fix actions...</span>
  </div>
);

/**
 * Empty state for fix actions list
 */
const FixActionsEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
    <AlertCircle className="h-8 w-8 mb-2" />
    <p className="text-sm font-medium">No fix actions created</p>
    <p className="text-xs mt-1">Create fix actions to address this problem</p>
  </div>
);

/**
 * Individual fix action row component
 */
const FixActionRow = ({
  fixAction,
  onEdit,
  onDelete,
  isDeleting,
  onAddProof,
}) => {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Verified":
        return "secondary";
      case "In Progress":
        return "outline";
      case "Pending":
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">
              {fixAction.actionText}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                <strong>Owner:</strong> {fixAction.owner?.name || "Unassigned"}
              </span>
              <span>
                <strong>Deadline:</strong>{" "}
                {fixAction.deadline
                  ? new Date(fixAction.deadline).toLocaleDateString()
                  : "Not set"}
              </span>
              <span className="flex items-center gap-1">
                <strong>Status:</strong>
                <Badge
                  variant={getStatusBadgeVariant(fixAction.actionStatus)}
                  className="text-xs"
                >
                  {fixAction.actionStatus}
                </Badge>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* ✅ NEW: Add Proof Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onAddProof(fixAction)}
          className="h-8 w-8"
          title="Add Proof"
        >
          <FileText className="h-3 w-3" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(fixAction)}
          className="h-8 w-8"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(fixAction._id)}
          disabled={isDeleting}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

/**
 * Fix actions list component
 */
const FixActionsList = ({
  fixActions,
  isLoading,
  onEditFixAction,
  onDeleteFixAction,
  onAddProof,
  isDeleting,
}) => (
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">
        Fix Actions ({fixActions.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {isLoading && <FixActionsLoadingState />}

      {!isLoading && fixActions.length === 0 && <FixActionsEmptyState />}

      {!isLoading && fixActions.length > 0 && (
        <div className="divide-y">
          {fixActions.map((fixAction) => (
            <FixActionRow
              key={fixAction._id}
              fixAction={fixAction}
              onEdit={onEditFixAction}
              onDelete={onDeleteFixAction}
              onAddProof={onAddProof} // ✅ NEW PROP
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

export default function FixActionManager({ problem, onClose }) {
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================
  const { token } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFixAction, setSelectedFixAction] = useState(null);

  // ✅ NEW STATES FOR PROOF MANAGEMENT
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedFixActionForProof, setSelectedFixActionForProof] =
    useState(null);

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================
  const {
    data: fixActionsData,
    isLoading,
    refetch,
  } = useModuleData(MODULE_NAME, token, {
    problem: problem._id,
  });

  const fixActions = fixActionsData?.data || [];

  // ===========================================================================
  // MUTATIONS
  // ===========================================================================
  const { mutate: deleteFixAction, isPending: isDeleting } = useDeleteModule(
    MODULE_NAME,
    token
  );

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles deletion of a fix action with confirmation
   */
  const handleDeleteFixAction = (fixActionId) => {
    toast.warning("Are you sure you want to delete this fix action?", {
      action: {
        label: "Confirm",
        onClick: () => {
          deleteFixAction(fixActionId, {
            onSuccess: () => {
              toast.success("Fix action deleted successfully");
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
   * Handles editing a fix action
   */
  const handleEditFixAction = (fixAction) => {
    setSelectedFixAction(fixAction);
    setIsEditModalOpen(true);
  };

  /**
   * ✅ NEW: Handles adding proof to a fix action
   */
  const handleAddProof = (fixAction) => {
    setSelectedFixActionForProof(fixAction);
    setIsProofModalOpen(true);
  };

  /**
   * Handles successful form submission
   */
  const handleSuccess = () => {
    refetch();
  };

  /**
   * Handles modal close and cleanup
   */
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedFixAction(null);
  };

  /**
   * ✅ NEW: Handles proof modal close
   */
  const handleProofModalClose = () => {
    setIsProofModalOpen(false);
    setSelectedFixActionForProof(null);
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    <div className="space-y-6">
      {/* 🎯 Header Card with Create Button */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Fix Actions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Managing corrective actions for: <strong>{problem.title}</strong>
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Fix Action
          </Button>
        </CardHeader>
      </Card>

      {/* 🎯 Fix Actions List */}
      <FixActionsList
        fixActions={fixActions}
        isLoading={isLoading}
        onEditFixAction={handleEditFixAction}
        onDeleteFixAction={handleDeleteFixAction}
        onAddProof={handleAddProof} // ✅ NEW PROP
        isDeleting={isDeleting}
      />

      {/* 🎯 Create Fix Action Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size="lg"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Create Fix Action</h3>
            <FixActionForm
              problem={problem}
              onSuccess={() => {
                handleModalClose();
                handleSuccess();
              }}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </Modal>
      )}

      {/* 🎯 Edit Fix Action Modal */}
      {isEditModalOpen && selectedFixAction && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          size="lg"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Fix Action</h3>
            <FixActionForm
              problem={problem}
              fixAction={selectedFixAction}
              onSuccess={() => {
                handleModalClose();
                handleSuccess();
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </Modal>
      )}

      {/* ✅ NEW: Proof Upload Modal */}
      {isProofModalOpen && selectedFixActionForProof && (
        <Modal
          isOpen={isProofModalOpen}
          onClose={handleProofModalClose}
          size="md"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Add Proof for Fix Action
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload evidence for:{" "}
              <strong>"{selectedFixActionForProof.actionText}"</strong>
            </p>
            <ProofUploader
              fixActionId={selectedFixActionForProof._id}
              onSuccess={() => {
                handleProofModalClose();
                toast.success("Proof uploaded successfully");
                // Optionally refresh data if needed
              }}
              onCancel={handleProofModalClose}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
