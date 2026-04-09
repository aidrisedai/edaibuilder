"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NodeCardProps {
  label: string;
  icon: LucideIcon;
  color: string;
  status: "waiting" | "active" | "complete";
  description: string;
}

export function NodeCard({
  label,
  icon: Icon,
  color,
  status,
}: NodeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-500",
        status === "waiting" && "opacity-40"
      )}
    >
      <div
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500",
          status === "active" && "animate-glow-pulse",
          status === "complete" && "scale-95"
        )}
        style={{
          backgroundColor:
            status === "waiting"
              ? "hsl(var(--muted))"
              : `${color}15`,
          boxShadow:
            status === "active"
              ? `0 0 20px ${color}40`
              : "none",
        }}
      >
        {status === "complete" ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <Icon
            className="h-5 w-5 transition-colors"
            style={{
              color: status === "waiting" ? "hsl(var(--muted-foreground))" : color,
            }}
          />
        )}
      </div>
      <span
        className={cn(
          "text-[10px] font-medium transition-colors",
          status === "active"
            ? "text-foreground"
            : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}
