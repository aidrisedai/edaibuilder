"use client";

import { create } from "zustand";
import type { Message, ProjectSpec } from "@/types/chat";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isGenerating: boolean;
  projectSpec: ProjectSpec | null;
  readyToBuild: boolean;
  addMessage: (message: Message) => void;
  updateLastAssistantMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setGenerating: (generating: boolean) => void;
  setProjectSpec: (spec: ProjectSpec | null) => void;
  setReadyToBuild: (ready: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  isGenerating: false,
  projectSpec: null,
  readyToBuild: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIdx = messages.length - 1;
      if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
        messages[lastIdx] = { ...messages[lastIdx], content };
      }
      return { messages };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setProjectSpec: (projectSpec) => set({ projectSpec }),
  setReadyToBuild: (readyToBuild) => set({ readyToBuild }),
  reset: () =>
    set({
      messages: [],
      isLoading: false,
      isGenerating: false,
      projectSpec: null,
      readyToBuild: false,
    }),
}));
