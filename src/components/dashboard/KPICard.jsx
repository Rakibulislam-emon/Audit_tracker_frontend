// src/components/dashboard/KPICard.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

/**
 * KPI Card Component
 * Displays a key performance indicator with trend and navigation
 */
export default function KPICard({
  title,
  value,
  subtitle,
  trend, // 'up' | 'down' | 'neutral'
  trendValue, // e.g., "+12%" or "-5%"
  icon: Icon,
  color = "blue", // 'blue' | 'green' | 'red' | 'orange' | 'purple'
  href, // Navigation link
  isLoading = false,
}) {
  const router = useRouter();

  // Color mappings for different states
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-600 dark:text-blue-400",
      icon: "text-blue-500 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-600 dark:text-green-400",
      icon: "text-green-500 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-600 dark:text-red-400",
      icon: "text-red-500 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      text: "text-orange-600 dark:text-orange-400",
      icon: "text-orange-500 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      text: "text-purple-600 dark:text-purple-400",
      icon: "text-purple-500 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-5 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-border transition-all duration-200 ${
        href ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""
      }`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`h-4 w-4 ${colors.icon}`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.text}`}>
          {value?.toLocaleString() ?? "0"}
        </div>

        {/* Subtitle and Trend */}
        <div className="flex items-center gap-2 mt-2">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}

          {trend && trendValue && (
            <div className="flex items-center gap-1">
              {trend === "up" && (
                <ArrowUpIcon className="h-3 w-3 text-green-500" />
              )}
              {trend === "down" && (
                <ArrowDownIcon className="h-3 w-3 text-red-500" />
              )}
              {trend === "neutral" && (
                <TrendingUpIcon className="h-3 w-3 text-gray-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : trend === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
