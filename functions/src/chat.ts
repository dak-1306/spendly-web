import { googleAI } from "@genkit-ai/googleai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { genkit } from "genkit";
import { z } from "zod";
import * as logger from "firebase-functions/logger";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");
enableFirebaseTelemetry();

const ai = genkit({
  plugins: [googleAI()],
});

const MODEL_2026 = "googleai/gemini-2.5-flash-lite";

const chatFlow = ai.defineFlow(
  {
    name: "chatFlow",
    inputSchema: z.object({ message: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const message = (input.message || "").trim();
    if (!message)
      return "Xin chào! Bạn có thể gửi câu hỏi hoặc yêu cầu để AI trả lời.";

    try {
      const prompt = `You are a helpful personal finance assistant. Respond concisely and helpfully to the user's message.\n\nUser: ${message}\nAssistant:`;

      // Retry with exponential backoff for transient server errors (e.g., 503)
      const maxAttempts = 3;
      let attempt = 0;
      while (true) {
        try {
          const { text } = await ai.generate({
            model: MODEL_2026,
            prompt,
            config: { temperature: 0.3 },
          });
          return text;
        } catch (err: any) {
          attempt += 1;
          logger.warn(
            `chatFlow attempt ${attempt} failed: ${err?.message || err}`,
          );
          // If we've exhausted attempts, rethrow to be handled by outer catch
          if (attempt >= maxAttempts) throw err;
          // Backoff: 500ms * 2^(attempt-1) + jitter
          const base = 500 * Math.pow(2, attempt - 1);
          const jitter = Math.floor(Math.random() * 300);
          const delayMs = base + jitter;
          await new Promise((res) => setTimeout(res, delayMs));
        }
      }
    } catch (err: any) {
      logger.error("chatFlow ERROR:", err);
      return `Lỗi khi xử lý yêu cầu: ${err?.message || String(err)}`;
    }
  },
);

export const chat = onCallGenkit(
  {
    secrets: [apiKey],
    maxInstances: 5,
    region: "asia-southeast1",
    invoker: "public",
  },
  chatFlow,
);
