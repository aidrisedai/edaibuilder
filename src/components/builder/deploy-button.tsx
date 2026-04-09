"use client";

import { useState } from "react";
import { Rocket, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/stores/build-store";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeployButtonProps {
  projectTitle: string;
}

export function DeployButton({ projectTitle }: DeployButtonProps) {
  const {
    generatedCode,
    deployStatus,
    publishedUrl,
    setDeployStatus,
    setPublishedUrl,
    setGithubRepoUrl,
  } = useBuildStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDeploy() {
    if (!generatedCode) {
      toast.error("Nothing to deploy yet! Build your site first.");
      return;
    }

    setDeployStatus("deploying");

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle,
          htmlContent: generatedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deployment failed");
      }

      setDeployStatus("deployed");
      setPublishedUrl(data.pagesUrl);
      setGithubRepoUrl(data.repoUrl);
      setShowSuccess(true);
      toast.success("Your site is LIVE!");
    } catch (error) {
      setDeployStatus("error");
      toast.error(`Deployment failed: ${error}`);
    }
  }

  function handleCopy() {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL copied!");
    }
  }

  return (
    <>
      <Button
        variant="glow"
        onClick={handleDeploy}
        disabled={!generatedCode || deployStatus === "deploying"}
        className="gap-2"
      >
        {deployStatus === "deploying" ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Launching...
          </>
        ) : deployStatus === "deployed" ? (
          <>
            <Check className="h-4 w-4" />
            Launched!
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4" />
            Launch My Site
          </>
        )}
      </Button>

      {/* Success dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl tracking-tight">
              Your Site is Live!
            </DialogTitle>
            <DialogDescription className="text-center">
              Share this link with your friends
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            {/* QR Code */}
            {publishedUrl && (
              <div className="rounded-xl bg-white p-4 shadow-md">
                <QRCodeSVG value={publishedUrl} size={160} />
              </div>
            )}

            {/* URL */}
            <div className="flex w-full items-center gap-2">
              <div className="flex-1 rounded-lg border bg-muted px-3 py-2 text-sm font-mono truncate">
                {publishedUrl}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Open link */}
            <Button
              variant="glow"
              className="w-full"
              onClick={() => window.open(publishedUrl!, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Visit My Site
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
