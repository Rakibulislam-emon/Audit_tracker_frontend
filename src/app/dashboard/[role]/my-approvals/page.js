// src/app/dashboard/[role]/my-approvals/page.jsx - NEW FILE
"use client";

import { useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { approvalService } from "@/services/approvalService"; // Import service
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner"; // Import toast
import { useState } from "react"; // Import useState

export default function MyApprovalsPage() {
  const { token, user } = useAuthStore();
  const [processingId, setProcessingId] = useState(null);

  // Fetch approvals where current user is the approver
  const {
    data: approvalsData,
    isLoading,
    error,
    refetch,
  } = useModuleData(
    "approvals",
    token,
    { approvalStatus: "pending" } // Only show pending approvals
  );

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this request?")) return;

    setProcessingId(id);
    const toastId = toast.loading("Approving request...");

    try {
      await approvalService.approve(
        id,
        "Approved via My Approvals dashboard",
        token
      );
      toast.success("Request approved successfully", { id: toastId });
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to approve", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason === null) return; // Cancelled
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setProcessingId(id);
    const toastId = toast.loading("Rejecting request...");

    try {
      await approvalService.reject(id, reason, token);
      toast.success("Request rejected successfully", { id: toastId });
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to reject", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      critical: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority}
      </Badge>
    );
  };

  const getEntityIcon = (entityType) => {
    const icons = {
      Report: "📄",
      FixAction: "🔧",
      Problem: "⚠️",
      AuditSession: "🔍",
    };
    return icons[entityType] || "📋";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading your approvals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading approvals: {error.message}</p>
        <Button onClick={refetch} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const approvals = approvalsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Approvals</h1>
          <p className="text-gray-600">Review and approve pending requests</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {approvals.length} Pending
        </Badge>
      </div>

      {approvals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              All Caught Up!
            </h3>
            <p className="text-gray-500 text-center mt-2">
              You don&apos;t have any pending approval requests at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {approvals.map((approval) => (
            <Card
              key={approval._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getEntityIcon(approval.entityType)}
                    </span>
                    <div>
                      <CardTitle className="text-lg">
                        {approval.title}
                      </CardTitle>
                      <CardDescription>
                        {approval.entityType} • Requested by{" "}
                        {approval.requestedBy?.name}
                      </CardDescription>
                    </div>
                  </div>
                  {getPriorityBadge(approval.priority)}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4">{approval.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Due in 7 days</span>
                    </div>
                    <div>
                      Requirements:{" "}
                      {
                        approval.requirements.filter((req) => req.completed)
                          .length
                      }
                      /{approval.requirements.length} completed
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(approval._id)}
                      disabled={processingId === approval._id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {processingId === approval._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(approval._id)}
                      disabled={processingId === approval._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingId === approval._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
