// src/components/ui/approvals/ApprovalSubmitForm.jsx
"use client";

import { Button } from "@/components/ui/button";
import RelationSelect from "@/components/ui/dynamic/UniversalRelationSelect"; // Reuse RelationSelect
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { universalConfig } from "@/config/dynamicConfig";
import { createApprovalApi } from "@/services/approvalService"; // Import the correct service
import { AlertCircle, Loader2, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ApprovalSubmitForm({
  token,
  itemToApprove, // The item (e.g., Report) we are submitting
  entityType, // e.g., "Report"
  onClose,
  onSubmitSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      approver: "",
      description: `Please review and approve this ${entityType.toLowerCase()}: "${
        itemToApprove?.title || itemToApprove?.name || "item"
      }"`,
    },
  });

  // Approver (User) field configuration for RelationSelect
  const approverConfig = {
    relation: "users", // We are selecting a User
    label: "Approver",
    required: true,
    placeholder: "Select an Approver",
  };

  // Form submission handler
  const onSubmit = useCallback(
    async (data) => {
      setFormError("");
      if (!data.approver) {
        setFormError("Please select an approver.");
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Submitting for approval...");

      try {
        // Prepare data object for createApprovalApi
        const approvalData = {
          entityType: entityType, // e.g., "Report"
          entityId: itemToApprove._id, // ID of the report/item
          // Use the item's title or a default title
          title:
            itemToApprove.title ||
            `Approval for ${entityType} ${itemToApprove._id.slice(-6)}`,
          description: data.description,
          approver: data.approver,
          priority: "medium", // Set a default priority
        };

        const result = await createApprovalApi(approvalData, token);

        toast.success(result.message || "Submitted for approval!", {
          id: toastId,
        });
        if (onSubmitSuccess) onSubmitSuccess();
        onClose(); // Close modal on success
      } catch (error) {
        console.error("Approval submission failed:", error);
        const errorMessage = error.message || "Failed to submit for approval.";
        setFormError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, itemToApprove, entityType, onSubmitSuccess, onClose]
  ); // Add dependencies

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-1 max-h-[70vh] overflow-y-auto"
    >
      {/* Show which item is being submitted */}
      <div className="text-sm p-3 bg-gray-50 border border-gray-200 rounded text-gray-700">
        <strong>Item to Approve:</strong>
        <span className="ml-2 truncate">
          {itemToApprove.title || itemToApprove.name || itemToApprove._id}
        </span>
      </div>

      {/* Approver Selection Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="approver">
          Assign Approver <span className="text-red-500">*</span>
        </Label>
        {/* Check if 'users' config exists before rendering RelationSelect */}
        {!universalConfig.users ? (
          <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
            Error: `users` module configuration is missing in dynamicConfig.js.
          </div>
        ) : (
          <RelationSelect
            fieldKey="approver"
            fieldConfig={approverConfig}
            control={control}
            token={token}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        )}
        {errors.approver && (
          <p className="text-sm text-red-500">{errors.approver.message}</p>
        )}
      </div>

      {/* Description/Comments */}
      <div className="space-y-2">
        <Label htmlFor="description">Message (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a message for the approver..."
          disabled={isSubmitting}
          rows={3}
          {...register("description")}
        />
      </div>

      {/* Display general form errors */}
      {formError && (
        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="break-words">{formError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-6 sticky bottom-0 bg-white py-3 px-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[170px]">
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              {" "}
              <Loader2 className="h-4 w-4 animate-spin" />{" "}
              <span>Submitting...</span>{" "}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {" "}
              <Send className="h-4 w-4" /> <span>Submit for Approval</span>{" "}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
