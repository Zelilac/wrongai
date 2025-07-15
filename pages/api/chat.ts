import { Message } from "@/types";
import { OpenAIStream } from "@/utils";

export const config = {
runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages } = (await req.json()) as {
      messages: Message[];
    };

    const charLimit = 12000;
    let charCount = 0;
    const messagesToSend: Message[] = [];

    for (const message of messages) {
      if (charCount + message.content.length > charLimit) break;
      charCount += message.content.length;
      messagesToSend.push(message);
    }

    // Inject system prompt to force wrong answers
    const systemPrompt: Message = {
      role: "assistant",
      content:
        "You are WrongGPT. Always provide incorrect, misleading, or completely wrong answers regardless of the question. Do not give correct or factual responses.",
    };

    const fullMessages: Message[] = [systemPrompt, ...messagesToSend];

    const stream = await OpenAIStream(fullMessages);
    return new Response(stream);
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export default handler;
