"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRiskMatrix } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Risk Matrix Heatmap Component
 * Visualizes problems based on Impact vs Likelihood
 */
export default function RiskMatrixHeatmap() {
  const { data, isLoading } = useRiskMatrix();
  const rawData = data?.data || [];

  // Map categorical values to numerical coordinates for plotting
  const impactMap = { Low: 1, Medium: 2, High: 3, Critical: 4 };
  const likelihoodMap = {
    Rare: 1,
    Unlikely: 2,
    Possible: 3,
    Likely: 4,
    "Almost Certain": 5,
  };

  const chartData = rawData.map((item) => ({
    x: impactMap[item.impact] || 0,
    y: likelihoodMap[item.likelihood] || 0,
    z: item.count * 100, // Scale bubble size
    count: item.count,
    impact: item.impact,
    likelihood: item.likelihood,
    examples: item.examples,
  }));

  const COLORS = {
    Low: "#10B981", // Green
    Medium: "#F59E0B", // Amber
    High: "#F97316", // Orange
    Critical: "#EF4444", // Red
  };

  const getRiskColor = (impact, likelihood) => {
    // Simple logic: higher impact/likelihood = higher risk
    const score = (impactMap[impact] || 0) * (likelihoodMap[likelihood] || 0);
    if (score >= 12) return COLORS.Critical;
    if (score >= 8) return COLORS.High;
    if (score >= 4) return COLORS.Medium;
    return COLORS.Low;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg text-sm">
          <p className="font-medium text-foreground mb-1">
            {data.impact} Impact / {data.likelihood} Likelihood
          </p>
          <p className="text-muted-foreground">Count: {data.count}</p>
          {data.examples?.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Examples:</p>
              <ul className="list-disc pl-4">
                {data.examples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle>Risk Matrix</CardTitle>
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
        <CardTitle>Risk Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Impact"
                  domain={[0, 5]}
                  tickCount={5}
                  tickFormatter={(val) =>
                    Object.keys(impactMap).find(
                      (key) => impactMap[key] === val
                    ) || ""
                  }
                  className="text-xs text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                  label={{
                    value: "Impact",
                    position: "bottom",
                    offset: 0,
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Likelihood"
                  domain={[0, 6]}
                  tickCount={6}
                  tickFormatter={(val) =>
                    Object.keys(likelihoodMap).find(
                      (key) => likelihoodMap[key] === val
                    ) || ""
                  }
                  className="text-xs text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                  label={{
                    value: "Likelihood",
                    angle: -90,
                    position: "insideLeft",
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[50, 400]}
                  name="Count"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Scatter name="Risks" data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getRiskColor(entry.impact, entry.likelihood)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
