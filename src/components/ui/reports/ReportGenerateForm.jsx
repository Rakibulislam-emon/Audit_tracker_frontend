"use client";

import { Button } from "@/components/ui/button";
import RelationSelect from "@/components/ui/dynamic/UniversalRelationSelect";
import { Label } from "@/components/ui/label";
import { universalConfig } from "@/config/dynamicConfig";
import {
  generateReportApi,
  submitReportForApprovalApi,
} from "@/services/reportService";
import {
  AlertCircle,
  CheckCircle,
  FilePlus2,
  Loader2,
  Send,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ReportGenerateForm({
  token,
  onClose,
  onGenerateSuccess,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [formError, setFormError] = useState("");

  // Debug: Log when generatedReport changes
  useEffect(() => {
    console.log("📄 generatedReport state updated:", generatedReport);
  }, [generatedReport]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { auditSession: "" },
  });

  // auditSessions dropdown configuration
  const auditSessionConfig = {
    relation: "auditSessions",
    label: "Audit Session",
    required: true,
    placeholder: "Select Audit Session to Generate Report",
  };

  // ✅ FIXED: Generate Report Handler - Keeps modal open after generation
  const onGenerateReport = useCallback(
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
        console.log("🔄 Starting report generation with data:", data);
        const result = await generateReportApi(data.auditSession, token);
        console.log("📄 Full API response:", result);

        // More flexible response handling
        if (result && (result.data || result.report)) {
          const reportData = result.data || result.report;
          console.log("✅ Extracted report data:", reportData);

          toast.success(result.message || "Report generated successfully!", {
            id: toastId,
          });
          
          // ✅ CRITICAL FIX: Set the generated report but DON'T call onGenerateSuccess
          // This keeps the modal open and shows the approval section
          setGeneratedReport(reportData);
          
          // ❌ REMOVED: onGenerateSuccess() was closing the modal prematurely
          // if (onGenerateSuccess && typeof onGenerateSuccess === "function") {
          //   onGenerateSuccess();
          // }
        } else {
          console.error("❌ Unexpected response structure:", result);
          throw new Error(
            result.message || "Failed to generate report: Invalid response structure"
          );
        }
      } catch (error) {
        console.error("❌ Generation failed:", error);
        const errorMessage = error.message || "Failed to generate report.";
        setFormError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsGenerating(false);
      }
    },
    [token] // ✅ REMOVED: onGenerateSuccess from dependencies
  );

  // ✅ FIXED: Submit for Approval Handler - Uses proper backend endpoint
  const onSubmitForApproval = useCallback(async () => {
    if (!generatedReport) {
      setFormError("No report available for approval submission.");
      return;
    }

    setIsSubmittingApproval(true);
    const toastId = toast.loading("Submitting report for approval...");

    try {
      console.log(
        "🔄 Starting approval submission with report ID:",
        generatedReport._id
      );
      
      // ✅ FIX: Call the submitReportForApproval endpoint directly
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${generatedReport._id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        console.error(
          `❌ HTTP Error ${response.status} during approval submission:`,
          errorData
        );
        throw new Error(
          errorData.message || `Submission failed with status ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ Approval submission result:", result);

      if (result && result.success) {
        toast.success(
          result.message || "Report submitted for approval successfully!",
          { id: toastId }
        );

        // ✅ Now reset and close the modal after successful approval submission
        reset();
        setGeneratedReport(null);
        setFormError("");
        
        // Call onClose to close the modal
        if (onClose) onClose();
        
        // Optional: Call onGenerateSuccess if needed for parent component
        if (onGenerateSuccess && typeof onGenerateSuccess === "function") {
          onGenerateSuccess();
        }
      } else {
        console.error("❌ Approval submission failed:", result);
        throw new Error(result.message || "Failed to submit for approval");
      }
    } catch (error) {
      console.error("❌ Approval submission failed:", error);
      const errorMessage = error.message || "Failed to submit report for approval.";
      setFormError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmittingApproval(false);
    }
  }, [generatedReport, token, onClose, reset, onGenerateSuccess]);

  // Close handler with reset
  const handleClose = () => {
    reset();
    setGeneratedReport(null);
    setFormError("");
    if (onClose) onClose();
  };

  // Debug: Log component state
  console.log("🔍 Component state:", {
    isGenerating,
    isSubmittingApproval,
    hasGeneratedReport: !!generatedReport,
    formError,
  });

  return (
    <div className="space-y-4 p-1">
      {/* Report Generation Form - SHOWS INITIALLY */}
      {!generatedReport && (
        <form onSubmit={handleSubmit(onGenerateReport)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auditSession">
              Select Audit Session
              <span className="text-red-500">*</span>
            </Label>
            {!universalConfig.auditSessions ? (
              <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
                Error: `auditSessions` module configuration is missing.
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
              <p className="text-sm text-red-500">
                {errors.auditSession.message}
              </p>
            )}
          </div>

          {formError && (
            <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="break-words">{formError}</span>
            </div>
          )}

          <p className="text-xs text-gray-500">
            This will generate a new report based on all problems identified in
            the selected audit session.
          </p>

          {/* GENERATE BUTTON - ONLY SHOWS BEFORE REPORT GENERATION */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isGenerating}
              className="min-w-[150px]"
            >
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
      )}

      {/* APPROVAL SECTION - SHOWS AFTER REPORT GENERATION */}
      {generatedReport && (
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <h3 className="font-semibold">Report Generated Successfully!</h3>
          </div>

          <div className="text-sm text-green-600 space-y-1">
            <p>
              <strong>Report:</strong>{" "}
              {generatedReport.title || "Untitled Report"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">
                {generatedReport.reportStatus || "Unknown"}
              </span>
            </p>
            <p>
              <strong>ID:</strong> {generatedReport._id || "N/A"}
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Your report is ready. You can now submit it for approval to proceed
            with the audit closure process.
          </p>

          {formError && (
            <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="break-words">{formError}</span>
            </div>
          )}

          {/* APPROVAL BUTTONS - ONLY SHOWS AFTER REPORT GENERATION */}
          <div className="flex justify-end gap-3 pt-3 border-t border-green-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setGeneratedReport(null);
                setFormError("");
              }}
              disabled={isSubmittingApproval}
            >
              Generate Another
            </Button>
            <Button
              type="button"
              onClick={onSubmitForApproval}
              disabled={isSubmittingApproval}
              className="min-w-[170px] bg-blue-600 hover:bg-blue-700"
            >
              {isSubmittingApproval ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Submit for Approval</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}