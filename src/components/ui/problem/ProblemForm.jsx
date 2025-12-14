"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { universalConfig } from "@/config/dynamicConfig";
import { useCreateModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import UniversalStaticSelect from "../dynamic/UniversalStaticSelect";
import { uploadProofApi } from "@/services/proofService";
import { Label } from "@/components/ui/label";
import { FileText, UploadCloud, X } from "lucide-react";
import { useDeleteModule } from "@/hooks/useUniversal";

export default function ProblemForm({
  session,
  observation,
  question,
  onClose,
  onProblemCreated,
}) {
  const { token } = useAuthStore();
  const config = universalConfig.problems;

  const impactConfig = config.fields.impact;
  const likelihoodConfig = config.fields.likelihood;
  const riskRatingConfig = config.fields.riskRating;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: `Issue: ${question.questionText.substring(0, 60)}...`,
      description: generateDescription(observation, question),
      impact: getImpactFromSeverity(observation.severity),
      likelihood: getLikelihoodFromResponse(observation.response),
      riskRating: observation.severity || "Medium",
      problemStatus: "Open",
    },
  });

  const { mutate: createProblem } = useCreateModule("problems", token);
  const { mutate: deleteProblem } = useDeleteModule("problems", token);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const clearFile = () => setSelectedFile(null);

  const onSubmit = useCallback(
    (formData) => {
      // 1. Validate File Presence (Mandatory)
      if (!selectedFile) {
        toast.error("Proof (Evidence) is required to create a problem.");
        return;
      }

      setServerError("");
      setIsSubmitting(true);
      const toastId = toast.loading("Creating problem and uploading proof...");

      const problemData = {
        ...formData,
        auditSession: session._id,
        observation: observation._id,
        question: question._id,
      };

      // 2. Create Problem
      createProblem(problemData, {
        onSuccess: async (res) => {
          const newProblem = res.data;

          try {
            // 3. Upload Proof (Chained)
            const proofFormData = new FormData();
            proofFormData.append("file", selectedFile);
            proofFormData.append("problem", newProblem._id);
            proofFormData.append(
              "caption",
              "Evidence for Problem: " + newProblem.title
            );
            proofFormData.append("fileType", "image"); // Default, backend maps it anyway

            await uploadProofApi(proofFormData, token);

            // Success!
            toast.success("Problem and Proof created successfully!", {
              id: toastId,
            });
            if (onProblemCreated) onProblemCreated(newProblem);
            onClose();
          } catch (uploadErr) {
            console.error("Proof upload failed:", uploadErr);
            toast.error(
              "Proof upload failed. Rolling back problem creation...",
              { id: toastId }
            );

            // 4. Rollback (Delete Problem if proof upload fails)
            try {
              deleteProblem(newProblem._id);
            } catch (deleteErr) {
              console.error("Rollback failed:", deleteErr);
              toast.error(
                "CRITICAL: Failed to delete partial problem. Please contact admin."
              );
            }
          } finally {
            setIsSubmitting(false);
          }
        },
        onError: (err) => {
          const errorMessage = err.message || "Failed to create problem.";
          setServerError(errorMessage);
          toast.error(errorMessage, { id: toastId });
          setIsSubmitting(false);
        },
      });
    },
    [
      session,
      observation,
      question,
      createProblem,
      deleteProblem,
      selectedFile,
      token,
      onProblemCreated,
      onClose,
    ]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">Create Problem from Observation</h3>

      {/* Observation Info Display (Read-only) */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-sm text-blue-800 mb-2">
          Based on Observation:
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <strong>Question:</strong> {question.questionText}
          </p>
          <p>
            <strong>Response:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                observation.response === "no"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {observation.response}
            </span>
          </p>
          {observation.comments && (
            <p>
              <strong>Comments:</strong> {observation.comments}
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Problem Title</label>
        <Input
          {...register("title", { required: "Title is required" })}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register("description", { required: "Description is required" })}
          disabled={isSubmitting}
          rows={4}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Includes observation response: "{observation.response}"
        </p>
      </div>

      {/* Proof/Evidence Upload (Mandatory) */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          Evidence / Proof <span className="text-red-500">*</span>
          <span className="text-xs font-normal text-muted-foreground">
            (Required image or PDF)
          </span>
        </Label>

        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2 bg-muted/5 group cursor-pointer"
            onClick={() => document.getElementById("proof-upload").click()}
          >
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Click to upload evidence
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: JPG, PNG, PDF (Max 100MB)
              </p>
            </div>
            <Input
              id="proof-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              disabled={isSubmitting}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("proof-upload").click();
              }}
            >
              Select File
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={isSubmitting}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Risk Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Impact</label>
          <UniversalStaticSelect
            fieldKey="impact"
            fieldConfig={impactConfig}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Likelihood</label>
          <UniversalStaticSelect
            fieldKey="likelihood"
            fieldConfig={likelihoodConfig}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Risk Rating</label>
          <UniversalStaticSelect
            fieldKey="riskRating"
            fieldConfig={riskRatingConfig}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Persistent Server Error Display */}
      {serverError && (
        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="wrap-break-words">{serverError}</span>
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
        <Button type="submit" disabled={isSubmitting} className="min-w-35">
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Save Problem</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}

// Helper functions
function generateDescription(observation, question) {
  return `Problem identified during audit:

Observation Details:
• Question: ${question.questionText}
• Response: ${observation.response}
• Severity: ${observation.severity}
${observation.comments ? `• Comments: ${observation.comments}` : ""}`;
}

function getImpactFromSeverity(severity) {
  const map = { Low: "Low", Medium: "Medium", High: "High", Critical: "High" };
  return map[severity] || "Medium";
}

function getLikelihoodFromResponse(response) {
  return response === "no" ? "Likely" : "Possible";
}
