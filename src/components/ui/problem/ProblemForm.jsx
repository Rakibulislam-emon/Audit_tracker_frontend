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


/**
 * Eti ekta "mini-form" ja shudhu ekta Observation theke Problem to-ri kore.
 */
export default function ProblemForm({
  session,
  observation,
  question,
  onClose, // Modal bondho korar jonno
  onProblemCreated, // List refresh korar jonno
}) {
  const { token } = useAuthStore();
  const config = universalConfig.problems; // Problem-er config load kori

  // --- Amader 3-ta "Static Select" tool-er config ---
  const impactConfig = config.fields.impact;
  const likelihoodConfig = config.fields.likelihood;
  const riskRatingConfig = config.fields.riskRating;


  console.log("[ProblemForm] observation:", observation.response);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // ✅ "Context" theke data auto-fill kori
      title: `Issue found for: ${question.questionText.substring(0, 50)}...`,
      description: `During the audit, the following observation was made: ${observation.response}`,
      // impact: "Medium",
      riskRating: observation.severity || "Medium",
      likelihood: "Possible",
      riskRating: "Medium",
      problemStatus: "Open", // Default
    },
  });

  const { mutate: createProblem, isPending } = useCreateModule(
    "problems",
    token
  );

  const onSubmit = (formData) => {
    const problemData = {
      ...formData,
      // ✅ "Context" theke shob ID automatically add kori
      auditSession: session._id,
      observation: observation._id,
      question: question._id,

    };

    createProblem(problemData, {
      onSuccess: (res) => {
        toast.success("Problem created successfully!");
        onProblemCreated(res.data); // Notun problem-take parent-ke pathai
        onClose(); // Modal bondho kori
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">Create New Problem</h3>
      <p className="text-sm text-gray-500">
        This problem is linked to Observation ID: ...{observation._id.slice(-6)}
      </p>

      {/* --- Title --- */}
      <div className="space-y-2">
        <label>Problem Title</label>
        <Input
          {...register("title", { required: "Title is required" })}
          disabled={isPending}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* --- Description --- */}
      <div className="space-y-2">
        <label>Description</label>
        <Textarea
          {...register("description", { required: "Description is required" })}
          disabled={isPending}
          className={errors.description ? "border-red-500" : ""}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* --- Risk Matrix (Impact, Likelihood, Rating) --- */}
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

      {/* --- Submit Button --- */}
      <div className="flex justify-end pt-4">
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
