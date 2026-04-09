import { getCompletion } from "@/lib/ai/claude";
import {
  PIVOT_GAME_PROMPT,
  PIVOT_GAME_FEEDBACK_PROMPT,
  FIRST_10_USERS_PROMPT,
} from "@/lib/ai/founders-lab";

export async function POST(request: Request) {
  try {
    const { activity, projectTitle, projectDescription, userInput, choice } =
      await request.json();

    let result: string;

    switch (activity) {
      case "pivot_game_scenario": {
        result = await getCompletion(
          PIVOT_GAME_PROMPT,
          `The student's project: "${projectTitle}" — ${projectDescription}`
        );
        // Parse JSON from response
        try {
          const parsed = JSON.parse(result);
          return Response.json({ scenario: parsed });
        } catch {
          // Try to extract JSON from the response
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return Response.json({ scenario: JSON.parse(jsonMatch[0]) });
          }
          return Response.json(
            { error: "Failed to parse scenario" },
            { status: 500 }
          );
        }
      }

      case "pivot_game_feedback": {
        const prompt = PIVOT_GAME_FEEDBACK_PROMPT.replace("{choice}", choice);
        result = await getCompletion(
          prompt,
          `Project: "${projectTitle}"\nScenario: ${userInput}\nStudent chose option: ${choice}`
        );
        return Response.json({ feedback: result });
      }

      case "first_10_users": {
        result = await getCompletion(
          FIRST_10_USERS_PROMPT,
          `Project: "${projectTitle}" — ${projectDescription}\n\nStudent's ideas for getting first 10 users:\n${userInput}`
        );
        return Response.json({ feedback: result });
      }

      default:
        return Response.json(
          { error: "Unknown activity type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Founders Lab API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
