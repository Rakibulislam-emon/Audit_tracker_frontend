// src/components/dashboard/RecentActivityFeed.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentActivity } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Recent Activity Feed Component
 * Displays timeline of recent activities
 */
export default function RecentActivityFeed({ limit = 10 }) {
  const { data, isLoading } = useRecentActivity(limit);
  const router = useRouter();
  const params = useParams();
  const role = params.role;

  const activities = data?.data || [];

  const getActivityLink = (activity) => {
    const entityType = activity.entity?.type;
    const entityId = activity.entity?.id;

    const routeMap = {
      AuditSession: `/dashboard/${role}/auditsessions/${entityId}`,
      Observation: `/dashboard/${role}/observations`,
      Problem: `/dashboard/${role}/problems`,
      FixAction: `/dashboard/${role}/fix-actions`,
      Report: `/dashboard/${role}/reports`,
      Approval: `/dashboard/${role}/approvals`,
    };

    return routeMap[entityType] || "#";
  };

  const getActivityColor = (type) => {
    const colorMap = {
      audit_session_created: "text-blue-600 dark:text-blue-400",
      observation_created: "text-purple-600 dark:text-purple-400",
      problem_identified: "text-red-600 dark:text-red-400",
      fix_action_created: "text-orange-600 dark:text-orange-400",
      report_generated: "text-green-600 dark:text-green-400",
      approval_granted: "text-green-600 dark:text-green-400",
      approval_rejected: "text-red-600 dark:text-red-400",
    };
    return colorMap[type] || "text-gray-600 dark:text-gray-400";
  };

  const getActivityLabel = (type) => {
    const labelMap = {
      audit_session_created: "started an audit",
      observation_created: "recorded an observation",
      problem_identified: "identified a problem",
      fix_action_created: "created a fix action",
      report_generated: "generated a report",
      approval_granted: "approved",
      approval_rejected: "rejected",
    };
    return labelMap[type] || "performed an action";
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/${role}/auditsessions`)}
          className="w-full sm:w-auto"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 pb-3 border-b border-border last:border-0 cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors"
                  onClick={() => router.push(getActivityLink(activity))}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 text-xl sm:text-2xl">
                    {activity.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium text-foreground break-words">
                        {activity.user?.name || "Unknown User"}
                      </span>
                      <span className="text-muted-foreground mx-1">
                        {getActivityLabel(activity.type)}
                      </span>
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-medium ${getActivityColor(
                        activity.type
                      )} line-clamp-2 break-words`}
                    >
                      {activity.entity?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
