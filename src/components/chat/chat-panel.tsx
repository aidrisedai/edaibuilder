"use client";

import { useRef, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { Sparkles } from "lucide-react";

interface ChatPanelProps {
  projectId: string;
  onReadyToBuild?: () => void;
}

export function ChatPanel({ projectId, onReadyToBuild }: ChatPanelProps) {
  const { messages, isLoading, addMessage, updateLastAssistantMessage, setLoading, setReadyToBuild, setProjectSpec } =
    useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend(content: string) {
    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setLoading(true);

    // Add placeholder assistant message
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: "",
      timestamp: new Date(),
    };
    addMessage(assistantMessage);

    try {
      // Build messages for API
      const apiMessages = useChatStore
        .getState()
        .messages.filter((m) => m.content)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // Remove the empty assistant message from API messages
      apiMessages.pop();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullContent = "";

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
                fullContent += parsed.text;
                updateLastAssistantMessage(fullContent);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Check if AI is ready to build
      if (fullContent.includes("[READY_TO_BUILD]")) {
        setReadyToBuild(true);

        // Extract project spec from JSON block
        const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            const spec = JSON.parse(jsonMatch[1]);
            setProjectSpec(spec);
            onReadyToBuild?.();
          } catch {
            // JSON parse error
          }
        }
      }
    } catch (error) {
      updateLastAssistantMessage(
        "Oops! Something went wrong. Can you try again?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              What do you want to build?
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Describe your dream website and I&apos;ll help you create it. Be as
              creative as you want!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && messages[messages.length - 1]?.content === "" && (
          <TypingIndicator />
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
