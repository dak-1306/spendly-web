import { googleAI } from "@genkit-ai/googleai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";

// SỬA TẠI ĐÂY: Import từ đúng thư viện mới nhất
import { genkit } from "genkit";
import { z } from "zod";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

enableFirebaseTelemetry();

const ai = genkit({
  plugins: [googleAI()],
});

// Define a simple flow
const menuSuggestionFlow = ai.defineFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string().describe("A restaurant theme").default("seafood"),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  // THÊM KIỂU DỮ LIỆU: Để tránh lỗi 'any' type (TS7006/TS7031)
  async (subject: string, { sendChunk }) => {
    const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;

    // Gọi stream từ model
    const { response, stream } = ai.generateStream({
      model: "googleai/gemini-1.5-flash",
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    for await (const chunk of stream) {
      if (sendChunk && chunk.text) {
        sendChunk(chunk.text);
      }
    }

    const result = await response;
    return result.text;
  }
);

export const menuSuggestion = onCallGenkit(
  {
    secrets: [apiKey],
  },
  menuSuggestionFlow
);
