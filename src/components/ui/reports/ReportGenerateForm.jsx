// src/components/ui/reports/ReportGenerateForm.jsx
"use client";

import { Button } from "@/components/ui/button";
import RelationSelect from "@/components/ui/dynamic/UniversalRelationSelect"; // Reuse RelationSelect
import { Label } from "@/components/ui/label";
import { universalConfig } from "@/config/dynamicConfig";
import { generateReportApi } from "@/services/reportService"; // Import API
import { AlertCircle, FilePlus2, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ReportGenerateForm({
  token,
  onClose,
  onGenerateSuccess,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { auditSession: "" },
  });

  // auditSessions ড্রপডাউনের জন্য কনফিগারেশন
  const auditSessionConfig = {
    relation: "auditSessions",
    label: "Audit Session",
    required: true,
    placeholder: "Select Audit Session to Generate Report",
  };

  // Form submission handler
  const onSubmit = useCallback(
    async (data) => {
      setFormError("");
      if (!data.auditSession) {
        setFormError("Please select an audit session.");
        return;
      }

      setIsGenerating(true);
      const toastId = toast.loading(
        "Generating report, this may take a moment..."
      );

      try {
        const result = await generateReportApi(data.auditSession, token);
        toast.success(result.message || "Report generated successfully!", {
          id: toastId,
        });
        if (onGenerateSuccess) onGenerateSuccess();
        onClose(); // Close modal on success
      } catch (error) {
        console.error("Generation failed:", error);
        const errorMessage = error.message || "Failed to generate report.";
        setFormError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsGenerating(false);
      }
    },
    [token, onGenerateSuccess, onClose]
  ); // Add dependencies

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <div className="space-y-2">
        <Label htmlFor="auditSession">
          Select Audit Session
          <span className="text-red-500">*</span>
        </Label>
        {/* auditSessions মডিউলের কনফিগারেশন আছে কিনা চেক করা */}
        {!universalConfig.auditSessions ? (
          <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
            Error: `auditSessions` module configuration is missing in
            dynamicConfig.js.
          </div>
        ) : (
          <RelationSelect
            fieldKey="auditSession"
            fieldConfig={auditSessionConfig}
            control={control}
            token={token}
            isSubmitting={isGenerating}
            errors={errors}
          />
        )}
        {errors.auditSession && (
          <p className="text-sm text-red-500">{errors.auditSession.message}</p>
        )}
      </div>

      {formError && (
        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="break-words">{formError}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        This will generate a new report based on all problems identified in the
        selected audit session. This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6 sticky bottom-0 bg-white dark:bg-gray-800 py-3 px-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isGenerating}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isGenerating} className="min-w-[150px]">
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FilePlus2 className="h-4 w-4" />
              <span>Generate Report</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
