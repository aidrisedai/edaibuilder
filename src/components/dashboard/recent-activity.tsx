"use client";

import { BookOpen, Rocket, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "project_created" | "project_deployed" | "xp_earned";
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const icons = {
  project_created: BookOpen,
  project_deployed: Rocket,
  xp_earned: Zap,
};

const colors = {
  project_created: "text-[#7C3AED] bg-[#7C3AED]/10",
  project_deployed: "text-[#22C55E] bg-[#22C55E]/10",
  xp_earned: "text-[#F59E0B] bg-[#F59E0B]/10",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No activity yet. Start building to see your progress here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => {
          const Icon = icons[activity.type];
          const colorClass = colors[activity.type];
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.description} &middot;{" "}
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
