export type ActivityType =
  | "pivot_game"
  | "user_interview"
  | "first_10"
  | "dollar_question"
  | "crash_test"
  | "feedback_loop";

export interface Activity {
  id: ActivityType;
  name: string;
  description: string;
  xpReward: number;
  icon: string;
}

export interface PivotGameScenario {
  scenario: string;
  options: {
    label: string;
    text: string;
  }[];
}

export interface ActivityResult {
  activityType: ActivityType;
  question: string;
  answer: string;
  aiFeedback: string;
  xpAwarded: number;
}
