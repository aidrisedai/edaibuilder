"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Strip [READY_TO_BUILD] and JSON spec from display
  let displayContent = message.content;
  if (!isUser) {
    displayContent = displayContent.replace(/\[READY_TO_BUILD\]/, "").trim();
    displayContent = displayContent.replace(/```json[\s\S]*?```/, "").trim();
  }

  if (!displayContent) return null;

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser
              ? "bg-gradient-to-br from-primary/80 to-primary text-white"
              : "bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-white"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card border rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p>{displayContent}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
