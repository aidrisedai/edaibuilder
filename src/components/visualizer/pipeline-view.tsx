"use client";

import { useBuildStore } from "@/stores/build-store";
import { NodeCard } from "@/components/visualizer/node-card";
import { ClipboardList, Blocks, Code2, TestTube2, Rocket } from "lucide-react";
import type { PipelineStep } from "@/types/project";

const nodes: {
  id: PipelineStep;
  label: string;
  icon: typeof ClipboardList;
  color: string;
  description: string;
}[] = [
  {
    id: "planning",
    label: "Plan",
    icon: ClipboardList,
    color: "#7C3AED",
    description: "Planning your app architecture...",
  },
  {
    id: "designing",
    label: "Design",
    icon: Blocks,
    color: "#14B8A6",
    description: "Designing the structure...",
  },
  {
    id: "coding",
    label: "Code",
    icon: Code2,
    color: "#FB7185",
    description: "Writing your website code...",
  },
  {
    id: "testing",
    label: "Test",
    icon: TestTube2,
    color: "#F59E0B",
    description: "Testing everything works...",
  },
  {
    id: "deploying",
    label: "Deploy",
    icon: Rocket,
    color: "#22C55E",
    description: "Launching to the internet...",
  },
];

export function PipelineView() {
  const { currentStep, isBuilding } = useBuildStore();

  if (!isBuilding && !currentStep) return null;

  const currentIndex = currentStep
    ? nodes.findIndex((n) => n.id === currentStep)
    : -1;

  return (
    <div className="border-b bg-card/50 px-4 py-3">
      <div className="flex items-center justify-center gap-2 overflow-x-auto">
        {nodes.map((node, index) => {
          let status: "waiting" | "active" | "complete" = "waiting";
          if (index < currentIndex) status = "complete";
          else if (index === currentIndex) status = "active";

          return (
            <div key={node.id} className="flex items-center gap-2">
              <NodeCard
                label={node.label}
                icon={node.icon}
                color={node.color}
                status={status}
                description={node.description}
              />
              {index < nodes.length - 1 && (
                <div
                  className={`h-0.5 w-6 rounded-full transition-colors duration-500 ${
                    index < currentIndex
                      ? "bg-green-500"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {currentStep && (
        <p className="text-center text-xs text-muted-foreground mt-2 animate-pulse">
          {nodes.find((n) => n.id === currentStep)?.description}
        </p>
      )}
    </div>
  );
}
