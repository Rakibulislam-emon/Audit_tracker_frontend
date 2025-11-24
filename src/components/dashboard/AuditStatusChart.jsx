// src/components/dashboard/AuditStatusChart.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditStatusDistribution } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

/**
 * Audit Status Chart Component
 * Displays donut chart of audit session distribution by status
 */
export default function AuditStatusChart() {
  const { data, isLoading } = useAuditStatusDistribution();

  const statusData = data?.data || {};

  // Transform data for Recharts
  const chartData = [
    { name: "Planned", value: statusData.planned || 0, color: "#6B7280" },
    {
      name: "In Progress",
      value: statusData["in-progress"] || 0,
      color: "#3B82F6",
    },
    { name: "Completed", value: statusData.completed || 0, color: "#10B981" },
    { name: "Cancelled", value: statusData.cancelled || 0, color: "#EF4444" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom label for center of donut
  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground"
      >
        <tspan x={cx} dy="-0.5em" className="text-3xl font-bold">
          {total}
        </tspan>
        <tspan x={cx} dy="1.5em" className="text-sm fill-muted-foreground">
          Total Audits
        </tspan>
      </text>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Audit Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-64 w-64 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Audit Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No audit sessions found</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => (
                  <span className="text-sm text-foreground">
                    {value}: {entry.payload.value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
