"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamPerformance } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

/**
 * Team Performance Leaderboard Component
 * Displays top auditors based on completed audits and observations
 */
export default function TeamPerformanceLeaderboard() {
  const { data, isLoading } = useTeamPerformance();
  const team = data?.data || [];

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-700" />;
    return (
      <span className="text-muted-foreground font-medium w-5 text-center">
        {index + 1}
      </span>
    );
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle>Team Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
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
        <CardTitle>Top Auditors</CardTitle>
      </CardHeader>
      <CardContent>
        {team.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="space-y-4">
            {team.map((member, index) => (
              <div
                key={member.id || index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                {/* Rank */}
                <div className="flex-shrink-0 flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>

                {/* Avatar */}
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="text-right">
                    <p className="font-medium">{member.audits}</p>
                    <p className="text-muted-foreground text-[10px]">Audits</p>
                  </div>
                  <div className="w-px h-6 bg-border mx-1" />
                  <div className="text-right">
                    <p className="font-medium">{member.observations}</p>
                    <p className="text-muted-foreground text-[10px]">Obs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
