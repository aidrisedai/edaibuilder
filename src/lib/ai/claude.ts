import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function streamChat(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return stream;
}

export async function streamGeneration(
  systemPrompt: string,
  userMessage: string
) {
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return stream;
}

export async function getCompletion(
  systemPrompt: string,
  userMessage: string
) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? "";
}
