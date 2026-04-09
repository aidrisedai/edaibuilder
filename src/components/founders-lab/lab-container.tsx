"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PivotGame } from "@/components/founders-lab/pivot-game";
import { FirstTenUsers } from "@/components/founders-lab/first-ten-users";
import { XpToast } from "@/components/founders-lab/xp-toast";
import { X, Gamepad2, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabContainerProps {
  projectTitle: string;
  projectDescription: string;
  onClose?: () => void;
}

export function LabContainer({
  projectTitle,
  projectDescription,
  onClose,
}: LabContainerProps) {
  const [earnedXp, setEarnedXp] = useState<number | null>(null);

  function handleXpEarned(amount: number) {
    setEarnedXp(amount);
    setTimeout(() => setEarnedXp(null), 2000);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14B8A6]/10">
            <Sparkles className="h-4 w-4 text-[#14B8A6]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Founder&apos;s Lab</h3>
            <p className="text-xs text-muted-foreground">
              Level up while your site builds
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="pivot">
          <TabsList className="w-full">
            <TabsTrigger value="pivot" className="flex-1 gap-1.5 text-xs">
              <Gamepad2 className="h-3.5 w-3.5" />
              Pivot Game
            </TabsTrigger>
            <TabsTrigger value="first10" className="flex-1 gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              First 10 Users
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pivot" className="mt-4">
            <PivotGame
              projectTitle={projectTitle}
              projectDescription={projectDescription}
              onXpEarned={handleXpEarned}
            />
          </TabsContent>
          <TabsContent value="first10" className="mt-4">
            <FirstTenUsers
              projectTitle={projectTitle}
              projectDescription={projectDescription}
              onXpEarned={handleXpEarned}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* XP notification */}
      {earnedXp !== null && <XpToast amount={earnedXp} />}
    </div>
  );
}
