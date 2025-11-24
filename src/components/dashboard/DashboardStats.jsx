// src/components/dashboard/DashboardStats.jsx
"use client";

import KPICard from "./KPICard";
import { useDashboardStats } from "@/hooks/useDashboardData";
import {
  ActivityIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
} from "lucide-react";
import { useParams } from "next/navigation";

/**
 * Dashboard Statistics Component
 * Displays 5 KPI cards with key metrics
 */
export default function DashboardStats() {
  const { data, isLoading, error } = useDashboardStats();
  const params = useParams();
  const role = params.role;

  const stats = data?.data || {};

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Active Audit Sessions */}
      <KPICard
        title="Active Audits"
        value={stats.activeAuditSessions}
        subtitle="In progress"
        icon={ActivityIcon}
        color="blue"
        href={`/dashboard/${role}/auditsessions`}
        isLoading={isLoading}
      />

      {/* Pending Approvals */}
      <KPICard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        subtitle="Requiring your action"
        icon={CheckCircleIcon}
        color="orange"
        href={`/dashboard/${role}/my-approvals`}
        isLoading={isLoading}
      />

      {/* Open Problems */}
      <KPICard
        title="Open Problems"
        value={stats.openProblems}
        subtitle="Unresolved issues"
        icon={AlertTriangleIcon}
        color="red"
        href={`/dashboard/${role}/problems`}
        isLoading={isLoading}
      />

      {/* Compliance Score */}
      <KPICard
        title="Compliance Score"
        value={stats.complianceScore}
        subtitle="Last 30 days average"
        icon={TrendingUpIcon}
        color="green"
        href={`/dashboard/${role}/reports`}
        isLoading={isLoading}
      />

      {/* Overdue Items */}
      <KPICard
        title="Overdue Items"
        value={stats.overdueItems}
        subtitle="Immediate attention"
        icon={ClockIcon}
        color={stats.overdueItems > 0 ? "red" : "green"}
        href={`/dashboard/${role}/fix-actions`}
        isLoading={isLoading}
      />
    </div>
  );
}
