"use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DashboardStats from "@/components/dashboard/DashboardStats";
// import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
// import PendingApprovalsTable from "@/components/dashboard/PendingApprovalsTable";
// import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
// ("use client");

import React from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import PendingApprovalsTable from "@/components/dashboard/PendingApprovalsTable";
import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
import AuditStatusChart from "@/components/dashboard/AuditStatusChart";
import AuditProgressChart from "@/components/dashboard/analytics/AuditProgressChart";
import ProblemsSeverityChart from "@/components/dashboard/analytics/ProblemsSeverityChart";
import RiskMatrixHeatmap from "@/components/dashboard/analytics/RiskMatrixHeatmap";
import SitePerformanceTable from "@/components/dashboard/analytics/SitePerformanceTable";

import UpcomingSchedulesCalendar from "@/components/dashboard/advanced/UpcomingSchedulesCalendar";
import TeamPerformanceLeaderboard from "@/components/dashboard/advanced/TeamPerformanceLeaderboard";
import ApprovalWorkflowFunnel from "@/components/dashboard/advanced/ApprovalWorkflowFunnel";
import FixActionsTracker from "@/components/dashboard/advanced/FixActionsTracker";
import PDFExportButton from "@/components/dashboard/shared/PDFExportButton";
import {
  useDashboardStats,
  useAuditProgress,
  useRiskMatrix,
  useSitePerformance,
  useFixActionsStatus,
} from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const params = useParams();
  const role = params.role;

  // Capitalize role for display
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  // Fetch data for PDF Report
  const { data: statsData } = useDashboardStats();
  const { data: progressData } = useAuditProgress();
  const { data: riskData } = useRiskMatrix();
  const { data: siteData } = useSitePerformance();
  const { data: fixData } = useFixActionsStatus();

  const reportData = {
    stats: statsData?.data,
    auditProgress: progressData?.data,
    riskMatrix: riskData?.data,
    sitePerformance: siteData?.data,
    fixActions: fixData?.data,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {displayRole}! Here&apos;s what&apos;s happening
            today.
          </p>
        </div>
        <PDFExportButton data={reportData} userName={displayRole} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards Row */}
          <DashboardStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Chart Area - 4 columns */}
            <div className="col-span-4">
              <AuditStatusChart />
            </div>

            {/* Quick Actions - 3 columns */}
            <div className="col-span-3">
              <QuickActionsPanel />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity - 4 columns */}
            <div className="col-span-4">
              <RecentActivityFeed />
            </div>

            {/* Pending Approvals - 3 columns */}
            <div className="col-span-3">
              <PendingApprovalsTable />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-[400px]">
              <AuditProgressChart />
            </div>
            <div className="h-[400px]">
              <ProblemsSeverityChart />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-[400px]">
              <RiskMatrixHeatmap />
            </div>
            <div className="h-[400px]">
              <SitePerformanceTable />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 h-[400px]">
              <UpcomingSchedulesCalendar />
            </div>
            <div className="col-span-3 h-[400px]">
              <TeamPerformanceLeaderboard />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-[400px]">
              <ApprovalWorkflowFunnel />
            </div>
            <div className="h-[400px]">
              <FixActionsTracker />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
