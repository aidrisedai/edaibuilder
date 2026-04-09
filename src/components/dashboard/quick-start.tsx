"use client";

import { useRouter } from "next/navigation";
import { Rocket, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export function QuickStart() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleNewProject() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in first!");
        router.push("/login");
        return;
      }

      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: "Untitled Project",
          description: "",
          phase: 1,
          deploy_target: "github_pages",
          status: "drafting",
        })
        .select()
        .single();

      if (error) {
        toast.error("Couldn't create project. Try again!");
        return;
      }

      // Create conversation for the project
      await supabase.from("conversations").insert({
        project_id: project.id,
        user_id: user.id,
        messages: [],
      });

      router.push(`/projects/${project.id}`);
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/50 transition-colors group">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
          <Rocket className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Start a New Project</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Describe your idea and watch it come to life
        </p>
        <Button
          variant="glow"
          onClick={handleNewProject}
          disabled={loading}
          className="group/btn"
        >
          {loading ? "Creating..." : "Let's Build!"}
          {!loading && (
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
