"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import UniversalDatePicker from "@/components/ui/dynamic/UniversalDatePicker";
import UniversalRelationSelect from "@/components/ui/dynamic/UniversalRelationSelect";
import UniversalStaticSelect from "@/components/ui/dynamic/UniversalStaticSelect";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateModule, useUpdateModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function FixActionForm({
  problem,
  fixAction = null,
  onSuccess,
  onCancel,
}) {
  const { token } = useAuthStore();
  const [formError, setFormError] = useState("");
  const { mutate: createFixAction, isPending: isCreating } = useCreateModule(
    "fixActions",
    token
  );
  const { mutate: updateFixAction, isPending: isUpdating } = useUpdateModule(
    "fixActions",
    token
  );

  const isSubmitting = isCreating || isUpdating;

  // 🎯 REACT HOOK FORM SETUP
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      actionText: fixAction?.actionText || "",
      owner: fixAction?.owner?._id || "",
      deadline: fixAction?.deadline || "",
      actionStatus: fixAction?.actionStatus || "Pending",
      reviewNotes: fixAction?.reviewNotes || "",
      verificationMethod: fixAction?.verificationMethod || "",
    },
  });

  // 🎯 FORM SUBMISSION
  const onSubmit = (formData) => {
    setFormError("");
    const payload = {
      ...formData,
      problem: problem._id, // 🎯 Auto-populate problem ID
    };

    if (mode === "create") {
      createFixAction(payload, {
        onSuccess: () => {
          toast.success("Fix Action created successfully!");
          onSuccess();
        },
        onError: (error) => {
          setFormError(error.message || "Failed to create fix action");
          toast.error(error.message);
        },
      });
    } else {
      updateFixAction(
        { id: fixAction._id, data: payload },
        {
          onSuccess: () => {
            toast.success("Fix Action updated successfully!");
            onSuccess();
          },
          onError: (error) => {
            setFormError(error.message || "Failed to update fix action");
            toast.error(error.message);
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 🎯 Action Description */}
      <div className="space-y-2">
        <Label htmlFor="actionText" className="flex items-center gap-1">
          Action Description
          <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="actionText"
          control={control}
          rules={{ required: "Action description is required" }}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Describe the corrective action needed..."
              rows={3}
              disabled={isSubmitting}
              className={errors.actionText ? "border-red-500" : ""}
            />
          )}
        />
        {errors.actionText && (
          <p className="text-red-600 text-sm">{errors.actionText.message}</p>
        )}
      </div>

      {/* 🎯 Assigned Owner */}
      <div className="space-y-2">
        <Label htmlFor="owner" className="flex items-center gap-1">
          Assigned To
          <span className="text-red-500">*</span>
        </Label>
        <UniversalRelationSelect
          fieldConfig={{
            relation: "users",
            label: "Assigned To",
            placeholder: "Select team member...",
            required: true,
          }}
          fieldKey="owner"
          control={control}
          token={token}
          isSubmitting={isSubmitting}
          errors={errors}
        />
        {errors.owner && (
          <p className="text-red-600 text-sm">{errors.owner.message}</p>
        )}
      </div>

      {/* 🎯 Deadline */}
      <div className="space-y-2">
        <Label htmlFor="deadline" className="flex items-center gap-1">
          Deadline
          <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="deadline"
          control={control}
          rules={{ required: "Deadline is required" }}
          render={({ field }) => (
            <UniversalDatePicker
              field={field}
              isSubmitting={isSubmitting}
              hasError={!!errors.deadline}
            />
          )}
        />
        {errors.deadline && (
          <p className="text-red-600 text-sm">{errors.deadline.message}</p>
        )}
      </div>

      {/* 🎯 FIXED: Status Field using UniversalStaticSelect */}
      <div className="space-y-2">
        <Label htmlFor="actionStatus" className="flex items-center gap-1">
          Status
          <span className="text-red-500">*</span>
        </Label>
        <UniversalStaticSelect
          fieldConfig={{
            label: "Status",
            options: [
              "Pending",
              "In Progress",
              "Completed",
              "Verified",
              "Rejected",
            ],
            placeholder: "Select status...",
            required: true,
          }}
          fieldKey="actionStatus"
          control={control}
          isSubmitting={isSubmitting}
          errors={errors}
        />
        {errors.actionStatus && (
          <p className="text-red-600 text-sm">{errors.actionStatus.message}</p>
        )}
      </div>

      {/* 🎯 Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="reviewNotes">Additional Notes</Label>
        <Controller
          name="reviewNotes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Any additional notes or instructions..."
              rows={2}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* 🎯 Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || (mode === "edit" && !isDirty)}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : mode === "create" ? (
            <Plus className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {mode === "create" ? "Create Fix Action" : "Save Changes"}
        </Button>
      </div>

      {/* 🎯 Status Indicator */}
      {mode === "edit" && !isDirty && !isSubmitting && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            No changes detected. Make changes to enable save.
          </p>
        </div>
      )}

      {/* 🎯 Persistent Error Display */}
      {formError && (
        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="break-words">{formError}</span>
        </div>
      )}
    </form>
  );
}
