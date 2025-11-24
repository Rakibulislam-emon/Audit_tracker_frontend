"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSitePerformance } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/**
 * Site Performance Table Component
 * Displays top performing sites based on compliance score
 */
export default function SitePerformanceTable() {
  const { data, isLoading } = useSitePerformance();
  const sites = data?.data || [];

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (score) => {
    if (score >= 90) return "bg-green-600 dark:bg-green-400";
    if (score >= 75) return "bg-yellow-600 dark:bg-yellow-400";
    return "bg-red-600 dark:bg-red-400";
  };

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle>Site Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-2 w-1/3" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <CardTitle>Site Performance Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {sites.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              <div className="col-span-4">Site Name</div>
              <div className="col-span-4 text-center">Compliance</div>
              <div className="col-span-2 text-center">Audits</div>
              <div className="col-span-2 text-right">Score</div>
            </div>

            <div className="space-y-4">
              {sites.map((site, index) => (
                <div
                  key={site.siteId || index}
                  className="grid grid-cols-12 items-center gap-2 px-2 py-1 hover:bg-accent/50 rounded-md transition-colors"
                >
                  {/* Site Name */}
                  <div
                    className="col-span-4 font-medium truncate"
                    title={site.siteName}
                  >
                    {site.siteName}
                  </div>

                  {/* Progress Bar */}
                  <div className="col-span-4 px-2">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(
                          site.complianceScore
                        )}`}
                        style={{ width: `${site.complianceScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Audit Count */}
                  <div className="col-span-2 text-center text-sm text-muted-foreground">
                    {site.auditCount}
                  </div>

                  {/* Score Badge */}
                  <div className="col-span-2 text-right">
                    <span
                      className={`font-bold ${getScoreColor(
                        site.complianceScore
                      )}`}
                    >
                      {site.complianceScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
