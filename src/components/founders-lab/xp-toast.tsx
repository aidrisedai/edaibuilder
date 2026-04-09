"use client";

import { Zap } from "lucide-react";

interface XpToastProps {
  amount: number;
}

export function XpToast({ amount }: XpToastProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-white shadow-lg shadow-amber-500/25">
        <Zap className="h-5 w-5 fill-white" />
        <span className="text-lg font-bold animate-xp-count">+{amount} XP</span>
      </div>
    </div>
  );
}
