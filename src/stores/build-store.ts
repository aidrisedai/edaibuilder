"use client";

import { create } from "zustand";
import type { PipelineStep } from "@/types/project";

interface BuildState {
  isBuilding: boolean;
  currentStep: PipelineStep | null;
  generatedCode: string;
  deployStatus: "idle" | "deploying" | "deployed" | "error";
  publishedUrl: string | null;
  githubRepoUrl: string | null;
  error: string | null;
  statusMessage: string;
  setBuilding: (building: boolean) => void;
  setCurrentStep: (step: PipelineStep | null) => void;
  appendCode: (chunk: string) => void;
  setGeneratedCode: (code: string) => void;
  setDeployStatus: (status: "idle" | "deploying" | "deployed" | "error") => void;
  setPublishedUrl: (url: string | null) => void;
  setGithubRepoUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  setStatusMessage: (message: string) => void;
  reset: () => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  isBuilding: false,
  currentStep: null,
  generatedCode: "",
  deployStatus: "idle",
  publishedUrl: null,
  githubRepoUrl: null,
  error: null,
  statusMessage: "",
  setBuilding: (isBuilding) => set({ isBuilding }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  appendCode: (chunk) =>
    set((state) => ({ generatedCode: state.generatedCode + chunk })),
  setGeneratedCode: (generatedCode) => set({ generatedCode }),
  setDeployStatus: (deployStatus) => set({ deployStatus }),
  setPublishedUrl: (publishedUrl) => set({ publishedUrl }),
  setGithubRepoUrl: (githubRepoUrl) => set({ githubRepoUrl }),
  setError: (error) => set({ error }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  reset: () =>
    set({
      isBuilding: false,
      currentStep: null,
      generatedCode: "",
      deployStatus: "idle",
      publishedUrl: null,
      githubRepoUrl: null,
      error: null,
      statusMessage: "",
    }),
}));
