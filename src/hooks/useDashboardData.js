// src/hooks/useDashboardData.js
"use client";

import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/dashboardService";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Custom hook for fetching dashboard statistics
 */
export const useDashboardStats = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => dashboardService.getDashboardStats(token),
    enabled: !!token, // Only run if token exists
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};

/**
 * Custom hook for fetching recent activity
 */
export const useRecentActivity = (limit = 20) => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["recentActivity", limit],
    queryFn: () => dashboardService.getRecentActivity(token, limit),
    enabled: !!token,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 20000,
  });
};

/**
 * Custom hook for fetching audit status distribution
 */
export const useAuditStatusDistribution = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["auditStatusDistribution"],
    queryFn: () => dashboardService.getAuditStatusDistribution(token),
    enabled: !!token,
    refetchInterval: 60000, // Auto-refresh every 60 seconds (less frequent)
    staleTime: 40000,
  });
};

export const useAuditProgress = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["auditProgress"],
    queryFn: () => dashboardService.getAuditProgress(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useProblemsBySeverity = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["problemsBySeverity"],
    queryFn: () => dashboardService.getProblemsBySeverity(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useRiskMatrix = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["riskMatrix"],
    queryFn: () => dashboardService.getRiskMatrix(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useSitePerformance = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["sitePerformance"],
    queryFn: () => dashboardService.getSitePerformance(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useUpcomingSchedules = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["upcomingSchedules"],
    queryFn: () => dashboardService.getUpcomingSchedules(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useTeamPerformance = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["teamPerformance"],
    queryFn: () => dashboardService.getTeamPerformance(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useApprovalFunnel = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["approvalFunnel"],
    queryFn: () => dashboardService.getApprovalFunnel(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};

export const useFixActionsStatus = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["fixActionsStatus"],
    queryFn: () => dashboardService.getFixActionsStatus(token),
    enabled: !!token,
    refetchInterval: 60000,
  });
};
