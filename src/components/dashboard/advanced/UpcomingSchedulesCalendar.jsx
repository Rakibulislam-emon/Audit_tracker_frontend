"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingSchedules } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User } from "lucide-react";

/**
 * Upcoming Schedules Calendar Component
 * Displays a list of upcoming audits for the next 30 days
 */
export default function UpcomingSchedulesCalendar() {
  const { data, isLoading } = useUpcomingSchedules();
  const schedules = data?.data || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    }).format(date);
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Upcoming Audits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Upcoming Audits (30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
            <p>No upcoming audits scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule._id}
                className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-primary/10 rounded-lg text-primary border border-primary/20">
                  <span className="text-xs font-medium uppercase">
                    {new Date(schedule.plannedDate).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-xl font-bold">
                    {new Date(schedule.plannedDate).getDate()}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-medium text-sm truncate"
                    title={schedule.title}
                  >
                    {schedule.title}
                  </h4>

                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[100px]">
                        {schedule.site?.name || "Unknown Site"}
                      </span>
                    </div>
                    {schedule.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">
                          {schedule.assignedTo.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status/Time Badge */}
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-xs font-normal">
                    {getDaysUntil(schedule.plannedDate)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
