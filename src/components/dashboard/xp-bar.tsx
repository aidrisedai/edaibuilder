"use client";

import { Progress } from "@/components/ui/progress";
import { getXpLevel } from "@/lib/utils";
import { Zap } from "lucide-react";

interface XpBarProps {
  xp: number;
}

export function XpBar({ xp }: XpBarProps) {
  const level = getXpLevel(xp);
  const progress = (level.currentXp / level.xpForNextLevel) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <span className="font-medium">
            Level {level.level}: {level.name}
          </span>
        </div>
        <span className="text-muted-foreground">
          {level.currentXp} / {level.xpForNextLevel} XP
        </span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
