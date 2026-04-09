"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { XpBar } from "@/components/dashboard/xp-bar";
import { ProjectCard } from "@/components/dashboard/project-card";
import { QuickStart } from "@/components/dashboard/quick-start";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import type { Project, User } from "@/types/database";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const [userRes, projectsRes] = await Promise.all([
        supabase.from("users").select("*").eq("id", authUser.id).single(),
        supabase
          .from("projects")
          .select("*")
          .eq("user_id", authUser.id)
          .order("updated_at", { ascending: false }),
      ]);

      if (userRes.data) setUser(userRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hey{user ? `, ${user.display_name}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to build something awesome today?
        </p>
      </div>

      {/* XP Bar */}
      {user && <XpBar xp={user.founder_xp} />}

      {/* Projects grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickStart />
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            No projects yet. Click above to create your first one!
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={[]} />
    </div>
  );
}
