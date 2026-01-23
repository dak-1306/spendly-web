import { useState } from "react";
import { buildFinancialPayload } from "../services/ai.transform";
import { getFinancialReport } from "../services/ai.service";

export function useFinancialReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // run hỗ trợ 2 dạng input:
  // - prebuilt payload: { totalIncome, totalExpense, categoryBreakdown, monthlyBudget }
  // - raw transactions: { transactions, monthlyBudget, monthFilter }
  async function run(input = {}) {
    setLoading(true);
    setError(null);
    try {
      let payload;

      const isPrebuilt =
        typeof input.totalIncome === "number" &&
        typeof input.totalExpense === "number";

      if (isPrebuilt) {
        payload = {
          totalIncome: Number(input.totalIncome || 0),
          totalExpense: Number(input.totalExpense || 0),
          categoryBreakdown: input.categoryBreakdown || "",
          monthlyBudget: Number(input.monthlyBudget || 0),
        };
      } else {
        const {
          transactions = [],
          monthlyBudget = 0,
          monthFilter = null,
        } = input;
        payload = buildFinancialPayload(
          transactions,
          monthlyBudget,
          monthFilter,
        );
      }

      // CHỐT CHẶN: Nếu không có tiền thu/chi, không gọi API
      if (payload.totalIncome === 0 && payload.totalExpense === 0) {
        const msg =
          "Bạn chưa có dữ liệu giao dịch trong tháng này để AI phân tích.";
        setResult(msg);
        return msg;
      }

      const res = await getFinancialReport(payload);
      setResult(res);
      return res;
    } catch (err) {
      // Xử lý lỗi Quota thân thiện
      const errorMsg = err.message?.includes("AI_LIMIT")
        ? "Hệ thống AI đang hết lượt dùng miễn phí. Vui lòng thử lại sau nhé!"
        : "Không thể kết nối với trí tuệ nhân tạo lúc này.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, error, result };
}
