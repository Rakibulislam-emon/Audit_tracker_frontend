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

  const onSubmit = useCallback(
    (formData) => {
      setServerError("");
      setIsSubmitting(true);
      const toastId = toast.loading("Saving problem...");

      const problemData = {
        ...formData,
        auditSession: session._id,
        observation: observation._id,
        question: question._id,
      };

      createProblem(problemData, {
        onSuccess: (res) => {
          toast.success("Problem created successfully!", { id: toastId });
          if (onProblemCreated) onProblemCreated(res.data);
          onClose();
          setIsSubmitting(false);
        },
        onError: (err) => {
          const errorMessage = err.message || "Failed to create problem.";
          setServerError(errorMessage);
          toast.error(errorMessage, { id: toastId });
          setIsSubmitting(false);
        },
      });
    },
    [session, observation, question, createProblem, onProblemCreated, onClose]
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
          <span className="break-words">{serverError}</span>
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
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
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
