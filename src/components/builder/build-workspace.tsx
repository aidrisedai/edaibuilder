"use client";

import { useState, useCallback } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { LivePreview } from "@/components/builder/live-preview";
import { DeployButton } from "@/components/builder/deploy-button";
import { PipelineView } from "@/components/visualizer/pipeline-view";
import { LabContainer } from "@/components/founders-lab/lab-container";
import { useBuildStore } from "@/stores/build-store";
import { useChatStore } from "@/stores/chat-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, Monitor, Gamepad2 } from "lucide-react";

interface BuildWorkspaceProps {
  projectId: string;
  projectTitle: string;
}

export function BuildWorkspace({ projectId, projectTitle }: BuildWorkspaceProps) {
  const { isBuilding, setBuilding, setCurrentStep, appendCode, setGeneratedCode } =
    useBuildStore();
  const { projectSpec, messages } = useChatStore();
  const [showFoundersLab, setShowFoundersLab] = useState(false);

  const handleReadyToBuild = useCallback(async () => {
    if (!projectSpec) return;

    setBuilding(true);
    setCurrentStep("planning");
    setShowFoundersLab(true);
    setGeneratedCode("");

    // Brief pause to show planning step
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep("coding");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSpec,
          conversationHistory: messages
            .filter((m) => m.content)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                appendCode(parsed.text);
              }
            } catch {
              // Skip
            }
          }
        }
      }

      setCurrentStep("testing");
      await new Promise((r) => setTimeout(r, 1500));
      setCurrentStep("deploying");
      await new Promise((r) => setTimeout(r, 500));
      setCurrentStep(null);
    } catch (error) {
      console.error("Build error:", error);
    } finally {
      setBuilding(false);
    }
  }, [projectSpec, messages, setBuilding, setCurrentStep, appendCode, setGeneratedCode]);

  return (
    <div className="flex h-full flex-col">
      {/* Pipeline Visualizer */}
      <PipelineView />

      {/* Desktop: split pane */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-[45%] min-w-[360px] border-r flex flex-col">
          <ChatPanel projectId={projectId} onReadyToBuild={handleReadyToBuild} />
        </div>
        <div className="flex-1 flex flex-col relative">
          <LivePreview />
          {/* Deploy button */}
          <div className="absolute bottom-4 right-4 z-10">
            <DeployButton projectTitle={projectTitle} />
          </div>
        </div>
      </div>

      {/* Mobile: tabs */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="chat" className="flex-1 gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 gap-1.5">
              <Monitor className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex-1 gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5" />
              Lab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 overflow-hidden">
            <ChatPanel projectId={projectId} onReadyToBuild={handleReadyToBuild} />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden relative">
            <LivePreview />
            <div className="absolute bottom-4 right-4 z-10">
              <DeployButton projectTitle={projectTitle} />
            </div>
          </TabsContent>
          <TabsContent value="lab" className="flex-1 overflow-hidden">
            <LabContainer projectTitle={projectTitle} projectDescription="" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Founder's Lab overlay (desktop) */}
      {showFoundersLab && isBuilding && (
        <div className="hidden md:block fixed bottom-0 left-64 right-0 z-20 animate-slide-up">
          <div className="mx-4 mb-4 rounded-xl border bg-card shadow-2xl max-h-[40vh] overflow-hidden">
            <LabContainer
              projectTitle={projectTitle}
              projectDescription={projectSpec?.description || ""}
              onClose={() => setShowFoundersLab(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
