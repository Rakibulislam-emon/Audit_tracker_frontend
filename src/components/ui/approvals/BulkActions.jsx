// components/ui/approvals/BulkActions.jsx
"use client";

import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { approvalService } from "@/services/approvalService";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

export function BulkActions({ selectedApprovals, onSelectionChange }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState('');
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const selectedCount = selectedApprovals.length;
  const canBulkApprove = selectedApprovals.every(approval => {
    const requirements = approval.requirements || [];
    return requirements.every(req => req.completed);
  });

  const handleBulkAction = (type) => {
    if (type === 'approve' && !canBulkApprove) {
      toast.error('Some selected approvals have unmet requirements');
      return;
    }
    setActionType(type);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (actionType === 'reject' && !comments.trim()) {
      toast.error('Comments are required for bulk rejection');
      return;
    }

    setIsLoading(true);
    try {
      const approvalIds = selectedApprovals.map(approval => approval._id);
      
      const result = actionType === 'approve' 
        ? await approvalService.bulkApprove(approvalIds, comments, token)
        : await approvalService.bulkReject(approvalIds, comments, token);

      // Show results summary
      const { successful, failed } = result.data;
      
      if (successful.length > 0) {
        toast.success(`${successful.length} approvals ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      }
      
      if (failed.length > 0) {
        toast.error(`${failed.length} approvals failed: ${failed.map(f => f.error).join(', ')}`);
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      
      // Clear selection
      onSelectionChange([]);
      
      setIsDialogOpen(false);
      setComments('');
      
    } catch (error) {
      toast.error(`Bulk ${actionType} failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-1">
          <span className="text-sm font-medium text-blue-800">
            {selectedCount} approval{selectedCount > 1 ? 's' : ''} selected
          </span>
          {!canBulkApprove && (
            <span className="text-sm text-orange-600 ml-2">
              (Some have unmet requirements)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
            onClick={() => handleBulkAction('approve')}
            disabled={!canBulkApprove}
            title={!canBulkApprove ? 'Some approvals have unmet requirements' : 'Bulk approve selected'}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Bulk Approve
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
            onClick={() => handleBulkAction('reject')}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Bulk Reject
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Bulk Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Bulk {actionType === 'approve' ? 'Approve' : 'Reject'} {selectedCount} Approval{selectedCount > 1 ? 's' : ''}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Add optional comments for all approvals'
                : 'Comments are required for rejection and will be applied to all selected approvals'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder={
                actionType === 'approve' 
                  ? 'Optional comments for all approvals...' 
                  : 'Reason for rejecting all approvals...'
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || (actionType === 'reject' && !comments.trim())}
              className={
                actionType === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Bulk ${actionType} (${selectedCount})`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}