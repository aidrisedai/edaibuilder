import { streamGeneration } from "@/lib/ai/claude";
import { GENERATOR_PROMPT, buildGeneratorMessages } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const { projectSpec, conversationHistory } = await request.json();

    if (!projectSpec) {
      return Response.json(
        { error: "Project spec is required" },
        { status: 400 }
      );
    }

    const userMessage = buildGeneratorMessages(
      projectSpec,
      conversationHistory || []
    );

    const stream = await streamGeneration(GENERATOR_PROMPT, userMessage);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                )
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Generation failed" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
