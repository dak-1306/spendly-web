import { googleAI } from "@genkit-ai/googleai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { genkit } from "genkit";
import { z } from "zod";
import * as logger from "firebase-functions/logger";

// Import Prompt từ file riêng
import { FINANCIAL_REPORT_PROMPT } from "./prompt/advisor";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");
enableFirebaseTelemetry();

const ai = genkit({
  plugins: [googleAI()],
});

const MODEL_2026 = "googleai/gemini-2.5-flash-lite";

const financeAnalysisFlow = ai.defineFlow(
  {
    name: "financeAnalysisFlow",
    inputSchema: z.object({
      totalIncome: z.number(),
      totalExpense: z.number(),
      categoryBreakdown: z.string(),
      monthlyBudget: z.number().optional(),
      // Optional metadata fields passed from client (ignored by AI generation)
      analysisType: z.string().optional(),
      month: z.string().optional(),
      year: z.number().optional(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // 1. CHỐT CHẶN: Nếu chưa có dữ liệu, trả về thông báo nhanh không gọi AI
    if (input.totalIncome === 0 && input.totalExpense === 0) {
      return "Chào bạn! Hiện tại Spendly chưa ghi nhận dữ liệu thu chi của bạn. Hãy nhập giao dịch để AI có thể phân tích tài chính giúp bạn nhé!";
    }

    try {
      const budgetLabel =
        input.monthlyBudget === undefined || input.monthlyBudget === null
          ? "(Không cung cấp ngân sách)"
          : input.monthlyBudget.toLocaleString("vi-VN");

      const prompt = FINANCIAL_REPORT_PROMPT.replace(
        "{{totalIncome}}",
        input.totalIncome.toLocaleString("vi-VN"),
      )
        .replace("{{totalExpense}}", input.totalExpense.toLocaleString("vi-VN"))
        .replace("{{categoryBreakdown}}", input.categoryBreakdown)
        .replace("{{monthlyBudget}}", budgetLabel);

      const { text } = await ai.generate({
        model: MODEL_2026,
        prompt: prompt,
        config: { temperature: 0.4 },
      });

      return text;
    } catch (err: any) {
      // Log chi tiết để debug trên Cloud Console
      console.error("financeAnalysisFlow ERROR:", err);
      // Trả về thông báo lỗi rõ ràng thay vì undefined (tránh gây 500)
      return `Lỗi nội bộ khi phân tích: ${err?.message || String(err)}`;
    }
  },
);

// 3. CẤU HÌNH EXPORT: Ép giới hạn 5 Instances ngay tại đây
export const getFinancialReport = onCallGenkit(
  {
    secrets: [apiKey],
    maxInstances: 5, // Giới hạn container bảo vệ thẻ Visa
    region: "asia-southeast1", // Đặt region gần VN để giảm độ trễ
    invoker: "public",
  },
  financeAnalysisFlow,
);
