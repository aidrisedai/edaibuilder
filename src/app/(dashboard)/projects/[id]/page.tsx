"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BuildWorkspace } from "@/components/builder/build-workspace";
import type { Project } from "@/types/database";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (data) setProject(data);
      setLoading(false);
    }

    if (projectId) loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Project not found</h2>
          <p className="text-sm text-muted-foreground">
            This project doesn&apos;t exist or you don&apos;t have access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BuildWorkspace projectId={project.id} projectTitle={project.title} />
  );
}
