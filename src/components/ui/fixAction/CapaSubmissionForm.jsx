"use client";
import { uploadProofApi } from "@/services/proofService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateModule, useDeleteModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  Save,
  UploadCloud,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CapaSubmissionForm({ problem, onClose, onSuccess }) {
  const { token, user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rootCause: "",
      correctiveAction: "",
      preventiveAction: "",
      deadline: "",
    },
  });

  const { mutateAsync: createFixAction } = useCreateModule("fixActions", token);
  const { mutateAsync: deleteFixAction } = useDeleteModule("fixActions", token);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic Validation
      if (file.size > 100 * 1024 * 1024) {
        // 100MB
        toast.error("File size exceeds 100MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (formData) => {
    if (!selectedFile) {
      toast.error("Proof of fix (file) is required.");
      return;
    }

    setServerError("");
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting CAPA with proof...");

    let createdFixActionId = null;

    try {
      // 1. Create Fix Action
      const fixActionData = {
        problem: problem._id,
        observation: problem.observation?._id || null,
        actionText: `CAPA for: ${problem.title}`,
        owner: user._id,
        deadline: formData.deadline,
        rootCause: formData.rootCause,
        correctiveAction: formData.correctiveAction,
        preventiveAction: formData.preventiveAction,
        actionStatus: "Pending",
      };

      const fixActionRes = await createFixAction(fixActionData);

      // Handle different response structures
      createdFixActionId =
        fixActionRes.data?._id ||
        fixActionRes._id ||
        fixActionRes.data?.data?._id;

      if (!createdFixActionId) {
        throw new Error("Failed to retrieve Fix Action ID.");
      }

      // 2. Upload Proof
      const proofFormData = new FormData();
      proofFormData.append("file", selectedFile);
      proofFormData.append("fixAction", createdFixActionId);
      proofFormData.append("caption", "Proof of Fix Implementation");

      await uploadProofApi(proofFormData, token);

      // Success
      toast.success("CAPA submitted successfully!", { id: toastId });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Submission Error:", err);
      const errorMessage = err.message || "Failed to submit CAPA.";
      setServerError(errorMessage);
      toast.error(errorMessage, { id: toastId });

      // Rollback: Delete Fix Action if proof upload failed
      if (createdFixActionId) {
        try {
          await deleteFixAction(createdFixActionId);
          console.log(
            "Rollback: Deleted orphaned fix action",
            createdFixActionId
          );
        } catch (rollbackErr) {
          console.error("Rollback Failed:", rollbackErr);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Problem Context */}
      <div className="p-4 bg-muted/50 border rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Problem Details</h4>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Title:</span> {problem.title}
          </p>
          <p>
            <span className="font-medium">Risk Rating:</span>{" "}
            {problem.riskRating}
          </p>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="space-y-2">
        <Label htmlFor="rootCause" className="text-base font-semibold">
          Root Cause Analysis <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Why did this problem occur? Identify the underlying cause.
        </p>
        <Textarea
          id="rootCause"
          {...register("rootCause", {
            required: "Root cause analysis is required",
          })}
          disabled={isSubmitting}
          rows={4}
          placeholder="e.g., Lack of training on safety equipment usage, inadequate supervision..."
        />
        {errors.rootCause && (
          <p className="text-xs text-red-500">{errors.rootCause.message}</p>
        )}
      </div>

      {/* Corrective Action */}
      <div className="space-y-2">
        <Label htmlFor="correctiveAction" className="text-base font-semibold">
          Corrective Action <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          What immediate action will fix this specific instance?
        </p>
        <Textarea
          id="correctiveAction"
          {...register("correctiveAction", {
            required: "Corrective action is required",
          })}
          disabled={isSubmitting}
          rows={4}
          placeholder="e.g., Provide safety helmets to all workers immediately, conduct emergency safety briefing..."
        />
        {errors.correctiveAction && (
          <p className="text-xs text-red-500">
            {errors.correctiveAction.message}
          </p>
        )}
      </div>

      {/* Preventive Action */}
      <div className="space-y-2">
        <Label htmlFor="preventiveAction" className="text-base font-semibold">
          Preventive Action <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          What will you do to prevent this from happening again?
        </p>
        <Textarea
          id="preventiveAction"
          {...register("preventiveAction", {
            required: "Preventive action is required",
          })}
          disabled={isSubmitting}
          rows={4}
          placeholder="e.g., Add helmet requirement to onboarding checklist, implement monthly safety audits, create safety training program..."
        />
        {errors.preventiveAction && (
          <p className="text-xs text-red-500">
            {errors.preventiveAction.message}
          </p>
        )}
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <Label
          htmlFor="deadline"
          className="text-base font-semibold flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Completion Deadline <span className="text-red-500">*</span>
        </Label>
        <Input
          id="deadline"
          type="date"
          {...register("deadline", { required: "Deadline is required" })}
          disabled={isSubmitting}
          min={new Date().toISOString().split("T")[0]}
        />
        {errors.deadline && (
          <p className="text-xs text-red-500">{errors.deadline.message}</p>
        )}
      </div>

      {/* PROOF OF FIX UPLOAD */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          Proof of Fix <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Upload a photo or document proving the fix has been implemented.
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            selectedFile
              ? "border-primary/50 bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/jpeg,image/png,application/pdf,video/mp4"
          />

          {!selectedFile ? (
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Click to upload proof
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, PDF or MP4 (max 100MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 bg-background border rounded-md shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 flex-shrink-0 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="wrap-break-word">{serverError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Submit CAPA</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
