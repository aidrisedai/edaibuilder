export interface User {
  id: string;
  username: string;
  display_name: string;
  grade_level: number | null;
  role: "student" | "teacher";
  teacher_id: string | null;
  class_code: string | null;
  founder_xp: number;
  journal_entries_count: number;
  created_at: string;
  last_active_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  phase: 1 | 2 | 3;
  deploy_target: "github_pages" | "render";
  published_url: string | null;
  github_repo_url: string | null;
  supabase_schema_name: string | null;
  step_index: number;
  status: "drafting" | "building" | "deployed" | "error";
  generated_html: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  project_id: string;
  user_id: string;
  messages: ChatMessage[];
  agent_node: string | null;
  token_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  agent_node?: string;
  timestamp: string;
}

export interface FounderJournalEntry {
  id: string;
  user_id: string;
  project_id: string;
  activity_type:
    | "pivot_game"
    | "user_interview"
    | "first_10"
    | "dollar_question"
    | "crash_test"
    | "feedback_loop";
  question: string;
  answer: string;
  ai_feedback: string;
  xp_awarded: number;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  filename: string;
  content: string;
  file_version: number;
  updated_at: string;
}

export interface TeacherClass {
  id: string;
  teacher_id: string;
  name: string;
  class_code: string;
  created_at: string;
}
