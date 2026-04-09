"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, Send } from "lucide-react";

interface FirstTenUsersProps {
  projectTitle: string;
  projectDescription: string;
  onXpEarned: (amount: number) => void;
}

export function FirstTenUsers({
  projectTitle,
  projectDescription,
  onXpEarned,
}: FirstTenUsersProps) {
  const [ideas, setIdeas] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit() {
    if (!ideas.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/founders-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "first_10_users",
          projectTitle,
          projectDescription,
          userInput: ideas,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback || "Great brainstorming! You're thinking like a real founder. The best marketing is always creative and personal.");
    } catch {
      setFeedback("Love the creativity! Getting your first users is all about personal outreach and making something people genuinely want. You're on the right track!");
    } finally {
      setLoading(false);
      setCompleted(true);
      onXpEarned(60);
    }
  }

  if (completed && feedback) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold text-sm">+60 XP earned!</span>
        </div>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed">{feedback}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-1">The Challenge:</p>
        <p className="text-sm text-muted-foreground">
          How would you get your first 10 users for{" "}
          <span className="font-medium text-foreground">{projectTitle || "your project"}</span>{" "}
          — without spending any money?
        </p>
      </div>

      <Textarea
        value={ideas}
        onChange={(e) => setIdeas(e.target.value)}
        placeholder="Brainstorm your ideas here... (e.g., share on Instagram, ask friends to try it, post in school Discord...)"
        className="min-h-[100px] resize-none"
        disabled={loading}
      />

      <Button
        onClick={handleSubmit}
        disabled={!ideas.trim() || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Getting feedback...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit My Ideas
          </>
        )}
      </Button>
    </div>
  );
}
