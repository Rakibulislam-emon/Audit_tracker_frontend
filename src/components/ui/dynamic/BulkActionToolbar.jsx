"use client";

import { Download, Trash2, X } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Bulk Action Toolbar
 * Appears when rows are selected in the table
 */
export default function BulkActionToolbar({
  selectedCount,
  selectedItems,
  onDeselectAll,
  onBulkDelete,
  onBulkExport,
  onBulkStatusChange,
  moduleConfig,
  userRole,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check permissions
  const canDelete = moduleConfig.permissions?.delete?.includes(userRole);
  const canEdit = moduleConfig.permissions?.edit?.includes(userRole);

  // Get status options from module config
  const statusField = moduleConfig.fields?.status;
  const statusOptions = statusField?.options || [];

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      await onBulkDelete(selectedItems);
      toast.success(`Successfully deleted ${selectedCount} items`);
      setShowDeleteDialog(false);
      onDeselectAll();
    } catch (error) {
      toast.error(`Failed to delete items: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle bulk export
   */
  const handleBulkExport = () => {
    try {
      onBulkExport(selectedItems);
      toast.success(`Exported ${selectedCount} items`);
    } catch (error) {
      toast.error(`Failed to export: ${error.message}`);
    }
  };

  /**
   * Handle bulk status change
   */
  const handleBulkStatusChange = async () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    setIsProcessing(true);
    try {
      await onBulkStatusChange(selectedItems, newStatus);
      toast.success(`Updated status for ${selectedCount} items`);
      setShowStatusDialog(false);
      setNewStatus("");
      onDeselectAll();
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      {/* Toolbar */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {selectedCount}
            </div>
            <span className="font-medium">
              {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            </span>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

            {/* Status Change Button - Disabled for now */}
            {/* {canEdit && statusOptions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusDialog(true)}
                className="gap-2"
              >
                Change Status
              </Button>
            )} */}

            {/* Delete Button */}
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Deselect All Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Deselect All
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedCount} Items?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedCount} {selectedCount === 1 ? "item" : "items"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Select a new status for {selectedCount}{" "}
              {selectedCount === 1 ? "item" : "items"}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStatusDialog(false);
                setNewStatus("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkStatusChange}
              disabled={isProcessing || !newStatus}
            >
              {isProcessing ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
