export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentNode?: string;
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  isGenerating: boolean;
  projectSpec: ProjectSpec | null;
  readyToBuild: boolean;
}

export interface ProjectSpec {
  title: string;
  description: string;
  features: string[];
  style: {
    colorScheme?: string;
    layout?: string;
    vibe?: string;
  };
}
