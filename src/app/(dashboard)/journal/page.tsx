"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, Users, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { FounderJournalEntry } from "@/types/database";

const activityLabels: Record<string, { label: string; icon: typeof Gamepad2; color: string }> = {
  pivot_game: { label: "Pivot Game", icon: Gamepad2, color: "text-[#7C3AED] bg-[#7C3AED]/10" },
  first_10: { label: "First 10 Users", icon: Users, color: "text-[#14B8A6] bg-[#14B8A6]/10" },
  user_interview: { label: "User Interview", icon: Users, color: "text-[#FB7185] bg-[#FB7185]/10" },
  dollar_question: { label: "$1 Question", icon: Zap, color: "text-[#F59E0B] bg-[#F59E0B]/10" },
  crash_test: { label: "Crash Test", icon: Zap, color: "text-[#F43F5E] bg-[#F43F5E]/10" },
  feedback_loop: { label: "Feedback Loop", icon: Users, color: "text-[#22C55E] bg-[#22C55E]/10" },
};

export default function JournalPage() {
  const [entries, setEntries] = useState<FounderJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("founder_journal")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setEntries(data);
      setLoading(false);
    }

    loadEntries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">
          Loading your journal...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Founder&apos;s Journal
        </h1>
        <p className="text-muted-foreground mt-1">
          Your product thinking portfolio — every challenge, every insight.
        </p>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold mb-2">No entries yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete Founder&apos;s Lab activities during a build to fill your journal!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const activity = activityLabels[entry.activity_type] || {
              label: entry.activity_type,
              icon: Zap,
              color: "text-gray-500 bg-gray-100",
            };
            const Icon = activity.icon;

            return (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${activity.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">
                          {activity.label}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Zap className="h-3 w-3" />
                      +{entry.xp_awarded} XP
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Challenge
                    </p>
                    <p className="text-sm">{entry.question}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Your Answer
                    </p>
                    <p className="text-sm bg-muted/50 rounded-lg p-3">
                      {entry.answer}
                    </p>
                  </div>
                  {entry.ai_feedback && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        AI Feedback
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.ai_feedback}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
