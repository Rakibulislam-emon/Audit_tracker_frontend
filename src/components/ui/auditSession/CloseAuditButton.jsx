"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Close Audit Button - Only visible to Approvers
 * Validates all problems are resolved before allowing closure
 */
export default function CloseAuditButton({
  auditSession,
  sessionId,
  problemList,
  onClose,
  token,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  // Debug logging
  console.log("🔍 Close Button Debug:", {
    sessionId,
    userRole: user?.role,
    problemListLength: problemList?.length,
    isLocked: auditSession?.isLocked,
  });

  // Check if user is approver or admin
  const canClose =
    user?.role === "approver" ||
    user?.role === "admin" ||
    user?.role === "sysadmin" ||
    user?.role === "superAdmin";

  console.log("🔐 Can close audit?", canClose);

  // Check if all problems are resolved
  const unresolvedProblems = problemList?.filter(
    (p) => p.problemStatus !== "Closed" && p.problemStatus !== "Resolved"
  );
  const hasUnresolvedProblems = unresolvedProblems?.length > 0;

  // Don't show button if user doesn't have permission
  if (!canClose) {
    console.log("❌ Button hidden: User role not authorized");
    return null;
  }

  // Don't show button if audit is already closed/locked
  if (auditSession?.isLocked || auditSession?.workflowStatus === "completed") {
    console.log("🔒 Button hidden: Audit is already closed");
    return null;
  }

  const handleCloseAudit = async () => {
    if (!window.confirm("Are you sure you want to close this audit session?")) {
      return;
    }

    setIsClosing(true);
    setError(null);

    try {
      const closeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auditSessions/${sessionId}/close`;
      console.log("📡 Close Audit URL:", closeUrl);

      const response = await fetch(closeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          closureNotes: "Audit session closed - all problems resolved",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to close audit");
      }

      // Success - refresh page or redirect
      if (onClose) {
        onClose();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
      setIsClosing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {hasUnresolvedProblems && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 text-sm">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          Cannot close audit: {unresolvedProblems.length} unresolved problem(s)
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          {error}
        </div>
      )}
      <button
        onClick={handleCloseAudit}
        disabled={hasUnresolvedProblems || isClosing}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          ${
            hasUnresolvedProblems || isClosing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }
        `}
      >
        {isClosing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Closing...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Close Audit
          </>
        )}
      </button>
    </div>
  );
}
