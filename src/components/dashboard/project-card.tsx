"use client";

import Link from "next/link";
import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  drafting: "secondary",
  building: "warning",
  deployed: "success",
  error: "destructive" as "default",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer overflow-hidden">
        {/* Preview thumbnail */}
        <div className="h-36 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 flex items-center justify-center border-b relative overflow-hidden">
          {project.generated_html ? (
            <iframe
              srcDoc={project.generated_html}
              className="w-full h-full pointer-events-none scale-50 origin-top-left"
              style={{ width: "200%", height: "200%" }}
              sandbox=""
              tabIndex={-1}
              title={`Preview of ${project.title}`}
            />
          ) : (
            <div className="text-4xl opacity-20">
              {project.title.charAt(0).toUpperCase()}
            </div>
          )}
          {project.published_url && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={project.published_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm line-clamp-1">
              {project.title}
            </h3>
            <Badge variant={statusColors[project.status] || "secondary"} className="shrink-0 text-[10px]">
              {project.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {project.description || "No description yet"}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(project.updated_at)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
