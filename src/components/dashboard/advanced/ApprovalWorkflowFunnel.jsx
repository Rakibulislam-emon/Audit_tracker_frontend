"use client";

import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApprovalFunnel } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Approval Workflow Funnel Component
 * Visualizes the conversion rates between approval stages
 */
export default function ApprovalWorkflowFunnel() {
  const { data, isLoading } = useApprovalFunnel();
  const funnelData = data?.data || [];

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle>Approval Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <CardTitle>Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {funnelData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Funnel dataKey="count" data={funnelData} isAnimationActive>
                  <LabelList
                    position="right"
                    fill="currentColor"
                    stroke="none"
                    dataKey="stage"
                    className="text-xs font-medium fill-foreground"
                  />
                  <LabelList
                    position="center"
                    fill="#fff"
                    stroke="none"
                    dataKey="count"
                    className="text-sm font-bold"
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
