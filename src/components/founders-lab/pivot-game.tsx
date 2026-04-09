"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { PivotGameScenario } from "@/types/founders-lab";

interface PivotGameProps {
  projectTitle: string;
  projectDescription: string;
  onXpEarned: (amount: number) => void;
}

export function PivotGame({
  projectTitle,
  projectDescription,
  onXpEarned,
}: PivotGameProps) {
  const [scenario, setScenario] = useState<PivotGameScenario | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function loadScenario() {
    setLoading(true);
    try {
      const res = await fetch("/api/founders-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "pivot_game_scenario",
          projectTitle,
          projectDescription,
        }),
      });
      const data = await res.json();
      if (data.scenario) {
        setScenario(data.scenario);
      }
    } catch {
      // Fallback scenario
      setScenario({
        scenario: `A bigger company just launched a similar ${projectTitle} app. What do you do?`,
        options: [
          { label: "A", text: "Add unique features they don't have" },
          { label: "B", text: "Focus on a smaller, specific audience" },
          { label: "C", text: "Partner with local businesses for promotion" },
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleChoice(choice: string) {
    setSelectedChoice(choice);
    setLoadingFeedback(true);

    try {
      const res = await fetch("/api/founders-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "pivot_game_feedback",
          projectTitle,
          projectDescription,
          userInput: scenario?.scenario,
          choice,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback || "Great strategic thinking! Every choice teaches you something about building products.");
    } catch {
      setFeedback("Great choice! In the real startup world, there's rarely a single right answer — what matters is thinking through the tradeoffs, which you just did!");
    } finally {
      setLoadingFeedback(false);
      setCompleted(true);
      onXpEarned(50);
    }
  }

  if (completed && feedback) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold text-sm">+50 XP earned!</span>
        </div>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed">{feedback}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground mb-4">
          Test your strategic thinking with a real-world scenario about your project.
        </p>
        <Button onClick={loadScenario} disabled={loading} variant="outline">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Start the Pivot Game"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-1">The Scenario:</p>
          <p className="text-sm text-muted-foreground">{scenario.scenario}</p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          What&apos;s your move?
        </p>
        {scenario.options.map((option) => (
          <button
            key={option.label}
            onClick={() => handleChoice(option.label)}
            disabled={loadingFeedback}
            className="w-full text-left rounded-lg border p-3 text-sm hover:bg-secondary/50 transition-colors disabled:opacity-50 flex items-start gap-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {option.label}
            </span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>

      {loadingFeedback && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Analyzing your strategy...</span>
        </div>
      )}
    </div>
  );
}
