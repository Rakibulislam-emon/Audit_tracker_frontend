"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFixActionsStatus } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";

/**
 * Fix Actions Tracker Component
 * Displays status of corrective actions (Total, Completed, In Progress, Overdue)
 */
export default function FixActionsTracker() {
  const { data, isLoading } = useFixActionsStatus();
  const stats = data?.data || {
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0,
  };

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle>Fix Actions Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <CardTitle>Fix Actions Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">
                Completion Rate
              </span>
              <span className="font-bold">{stats.completionRate}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg border border-border flex flex-col items-center justify-center text-center">
              <ListTodo className="h-5 w-5 text-primary mb-2" />
              <span className="text-2xl font-bold">{stats.total}</span>
              <span className="text-xs text-muted-foreground">
                Total Actions
              </span>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.completed}
              </span>
              <span className="text-xs text-green-600/80 dark:text-green-400/80">
                Completed
              </span>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex flex-col items-center justify-center text-center">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mb-2" />
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.inProgress}
              </span>
              <span className="text-xs text-yellow-600/80 dark:text-yellow-400/80">
                In Progress
              </span>
            </div>

            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mb-2" />
              <span className="text-2xl font-bold text-red-700 dark:text-red-300">
                {stats.overdue}
              </span>
              <span className="text-xs text-red-600/80 dark:text-red-400/80">
                Overdue
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
