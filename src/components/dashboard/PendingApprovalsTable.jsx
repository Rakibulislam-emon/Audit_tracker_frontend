// src/components/dashboard/PendingApprovalsTable.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { universalService } from "@/services/universalService";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Pending Approvals Table Component
 * Displays user's pending approvals with quick actions
 */
export default function PendingApprovalsTable({ limit = 5 }) {
  const router = useRouter();
  const params = useParams();
  const role = params.role;
  const { token } = useAuthStore();

  // Fetch pending approvals using existing universal service
  const { data, isLoading } = useQuery({
    queryKey: ["myApprovals", "pending"],
    queryFn: () =>
      universalService.getAll(token, "approvals", {
        approvalStatus: "pending,in-review",
        limit,
      }),
    enabled: !!token,
  });

  const approvals = data?.data || [];

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      "in-review":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    };
    return colors[status] || colors.pending;
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 border border-border rounded-lg"
              >
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-3">
        <CardTitle className="text-base sm:text-lg">
          Pending Approvals
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/${role}/my-approvals`)}
          className="w-full sm:w-auto"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending approvals</p>
            <p className="text-sm mt-1">You&apos;re all caught up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvals.slice(0, limit).map((approval) => (
              <div
                key={approval._id}
                className="flex items-start gap-2 sm:gap-4 p-2 sm:p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/${role}/approvals`)}
              >
                {/* Entity Type Icon */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">
                    {approval.entityType === "Report" && "📄"}
                    {approval.entityType === "Problem" && "⚠️"}
                    {approval.entityType === "FixAction" && "🔧"}
                    {approval.entityType === "AuditSession" && "🔍"}
                    {approval.entityType === "Template" && "📋"}
                    {approval.entityType === "Schedule" && "📅"}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground line-clamp-2 break-words flex-1">
                      {approval.title}
                    </h4>
                    <Badge
                      className={`${getPriorityColor(
                        approval.priority
                      )} self-start text-xs`}
                    >
                      {approval.priority}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                    <span className="break-words">
                      By {approval.requestedBy?.name || "Unknown"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="break-words">
                      {approval.timeline?.deadline
                        ? `Due ${formatDistanceToNow(
                            new Date(approval.timeline.deadline),
                            { addSuffix: true }
                          )}`
                        : "No deadline"}
                    </span>
                  </div>

                  <div className="mt-2">
                    <Badge
                      className={`${getStatusColor(
                        approval.approvalStatus
                      )} text-xs`}
                    >
                      {approval.approvalStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
