"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { universalConfig } from "@/config/dynamicConfig";
import { useCreateModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2, Plus } from "lucide-react";
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // ✅ Description-এই Observation Answer include করছেন
      title: `Issue: ${question.questionText.substring(0, 60)}...`,
      description: generateDescription(observation, question),
      impact: getImpactFromSeverity(observation.severity),
      likelihood: getLikelihoodFromResponse(observation.response),
      riskRating: observation.severity || "Medium",
      problemStatus: "Open",
    },
  });

  const { mutate: createProblem, isPending } = useCreateModule(
    "problems",
    token
  );

  const onSubmit = (formData) => {
    const problemData = {
      ...formData,
      // ✅ শুধু ID গুলো silently pass করছেন
      auditSession: session._id,
      observation: observation._id, // Backend relation-এর জন্য
      question: question._id,
    };

    createProblem(problemData, {
      onSuccess: (res) => {
        toast.success("Problem created successfully!");
        onProblemCreated(res.data);
        onClose();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">Create Problem from Observation</h3>

      {/* ✅ Observation Info Display (Read-only) */}
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

      {/* --- Title --- */}
      <div className="space-y-2">
        <label>Problem Title</label>
        <Input
          {...register("title", { required: "Title is required" })}
          disabled={isPending}
        />
      </div>

      {/* --- Description --- */}
      <div className="space-y-2">
        <label>Description</label>
        <Textarea
          {...register("description", { required: "Description is required" })}
          disabled={isPending}
          rows={4}
        />
        <p className="text-xs text-gray-500">
          Includes observation response: "{observation.response}"
        </p>
      </div>

      {/* --- Risk Matrix --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label>Impact</label>
          <UniversalStaticSelect
            fieldKey="impact"
            fieldConfig={impactConfig}
            control={control}
            errors={errors}
            isSubmitting={isPending}
          />
        </div>
        <div className="space-y-2">
          <label>Likelihood</label>
          <UniversalStaticSelect
            fieldKey="likelihood"
            fieldConfig={likelihoodConfig}
            control={control}
            errors={errors}
            isSubmitting={isPending}
          />
        </div>
        <div className="space-y-2">
          <label>Risk Rating</label>
          <UniversalStaticSelect
            fieldKey="riskRating"
            fieldConfig={riskRatingConfig}
            control={control}
            errors={errors}
            isSubmitting={isPending}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Problem
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
