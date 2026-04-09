export type PipelineStep =
  | "planning"
  | "designing"
  | "coding"
  | "testing"
  | "deploying";

export type PipelineNodeStatus = "waiting" | "active" | "complete" | "error";

export interface PipelineNode {
  id: PipelineStep;
  label: string;
  description: string;
  status: PipelineNodeStatus;
  color: string;
}

export interface BuildState {
  isBuilding: boolean;
  currentStep: PipelineStep | null;
  generatedCode: string;
  deployStatus: "idle" | "deploying" | "deployed" | "error";
  publishedUrl: string | null;
  error: string | null;
}
