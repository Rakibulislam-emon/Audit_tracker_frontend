"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProblemsBySeverity } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Problems by Severity Chart Component
 * Visualizes problems grouped by severity and status (Open, In Progress, Resolved)
 */
export default function ProblemsSeverityChart() {
  const { data, isLoading } = useProblemsBySeverity();
  const rawData = data?.data || {};

  // Transform object data to array for Recharts
  const chartData = Object.keys(rawData).map((severity) => ({
    name: severity,
    open: rawData[severity].open,
    inProgress: rawData[severity].inProgress,
    resolved: rawData[severity].resolved,
  }));

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle>Problems by Severity</CardTitle>
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
        <CardTitle>Problems by Severity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 40,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  className="text-xs text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  className="text-xs text-muted-foreground font-medium"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.2 }}
                />
                <Legend />
                <Bar
                  dataKey="open"
                  name="Open"
                  stackId="a"
                  fill="#EF4444"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="inProgress"
                  name="In Progress"
                  stackId="a"
                  fill="#F59E0B"
                />
                <Bar
                  dataKey="resolved"
                  name="Resolved"
                  stackId="a"
                  fill="#10B981"
                  radius={[4, 0, 0, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
