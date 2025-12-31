"use client";

import React from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
import AuditStatusChart from "@/components/dashboard/AuditStatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, PlusCircle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditProgressChart from "@/components/dashboard/analytics/AuditProgressChart";
import ProblemsSeverityChart from "@/components/dashboard/analytics/ProblemsSeverityChart";
import RiskMatrixHeatmap from "@/components/dashboard/analytics/RiskMatrixHeatmap";
import UpcomingSchedulesCalendar from "@/components/dashboard/advanced/UpcomingSchedulesCalendar";
import FixActionsTracker from "@/components/dashboard/advanced/FixActionsTracker";

export default function AuditorDashboard({ userName, role = "auditor" }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Auditor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Focus on your assigned audits and
            findings.
          </p>
        </div>
        <Link href="/dashboard/auditor/auditsessions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Start New Audit
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Chart Area */}
            <div className="col-span-4">
              <AuditStatusChart />
            </div>

            {/* Quick Links / Actions */}
            <div className="col-span-3">
              <QuickActionsPanel role={role} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <RecentActivityFeed />
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
            {/* Auditor doesn't typically need SitePerformanceTable comparison of all sites, but controller scopes it to their sites. 
                 It might be just 1-2 sites. Safe to show. */}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <div className="h-[400px]">
              <UpcomingSchedulesCalendar />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            <div className="h-[400px]">
              <FixActionsTracker />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
