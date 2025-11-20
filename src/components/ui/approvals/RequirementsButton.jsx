// components/ui/approvals/RequirementsButton.jsx - FIXED (No Reload)
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { approvalService } from "@/services/approvalService";
import { useAuthStore } from "@/stores/useAuthStore";
import { ListChecks } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

export function RequirementsButton({ approval }) {
  const [isOpen, setIsOpen] = useState(false);
  const [requirements, setRequirements] = useState(approval.requirements || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const { token } = useAuthStore();
  const queryClient = useQueryClient(); // ✅ Get query client

  const unmetCount = requirements.filter(req => !req.completed).length;
  const allCompleted = requirements.every(req => req.completed);

  const handleRequirementToggle = async (index, completed) => {
    setIsUpdating(true);
    try {
      await approvalService.updateRequirement(approval._id, index, completed, token);
      
      // Update local state only
      const updated = [...requirements];
      updated[index] = { ...updated[index], completed };
      setRequirements(updated);
      
      toast.success(`Requirement ${completed ? 'completed' : 'marked incomplete'}`);
    } catch (error) {
      toast.error('Failed to update requirement');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // ✅ Refresh only approvals data without page reload
    queryClient.invalidateQueries({ queryKey: ['approvals'] });
    console.log('🔄 Refreshed approvals data silently');
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={`${
          allCompleted 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
        } hover:bg-opacity-80`}
        onClick={() => setIsOpen(true)}
        disabled={isUpdating}
      >
        <ListChecks className="h-4 w-4 mr-1" />
        {allCompleted ? 'All Complete' : `Requirements (${unmetCount})`}
        {isUpdating && '...'}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approval Requirements</DialogTitle>
            <DialogDescription>
              Complete all requirements to approve this request
              {allCompleted && (
                <span className="text-green-600 font-medium ml-2">
                  ✓ All requirements completed!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-96 overflow-y-auto">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 border rounded">
                <Checkbox
                  id={`req-${index}`}
                  checked={req.completed || false}
                  onCheckedChange={(checked) => handleRequirementToggle(index, !!checked)}
                  disabled={isUpdating}
                />
                <Label 
                  htmlFor={`req-${index}`}
                  className={`text-sm flex-1 ${req.completed ? 'text-gray-500 line-through' : ''}`}
                >
                  {req.description || `Requirement ${index + 1}`}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-500">
              {requirements.filter(r => r.completed).length} of {requirements.length} completed
            </span>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isUpdating}
              >
                Close
              </Button>
              {allCompleted && (
                <Button 
                  onClick={handleClose}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✓ All Complete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}