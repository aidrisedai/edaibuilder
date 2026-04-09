"use client";

import { useBuildStore } from "@/stores/build-store";
import { Monitor, Smartphone, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LivePreview() {
  const { generatedCode } = useBuildStore();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex h-full flex-col bg-card border-l">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "desktop" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => { setViewMode("desktop"); setShowCode(false); }}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "mobile" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => { setViewMode("mobile"); setShowCode(false); }}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button
            variant={showCode ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowCode(!showCode)}
          >
            <Code2 className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          {generatedCode ? "Live Preview" : "Preview will appear here"}
        </span>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4 flex items-start justify-center">
        {showCode ? (
          <pre className="w-full max-h-full overflow-auto bg-card border rounded-lg p-4 text-xs font-mono text-foreground whitespace-pre-wrap">
            {generatedCode || "// Code will appear here as the AI writes it..."}
          </pre>
        ) : generatedCode ? (
          <div
            className={cn(
              "bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300",
              viewMode === "mobile" ? "w-[375px]" : "w-full"
            )}
            style={{ height: viewMode === "mobile" ? "667px" : "100%" }}
          >
            <iframe
              srcDoc={generatedCode}
              className="w-full h-full"
              sandbox="allow-scripts"
              title="Live Preview"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Monitor className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Your website will appear here</p>
            <p className="text-xs mt-1">Start chatting to begin building</p>
          </div>
        )}
      </div>
    </div>
  );
}
