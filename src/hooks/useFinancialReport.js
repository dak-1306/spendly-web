import { useState } from "react";
import { getFinancialReport } from "../services/ai.service";

export function useFinancialReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Chỉ hỗ trợ payload prebuilt:
  // { totalIncome, totalExpense, categoryBreakdown, monthlyBudget }
  async function run(input = {}) {
    setLoading(true);
    setError(null);
    try {
      const {
        totalIncome = 0,
        totalExpense = 0,
        categoryBreakdown = "",
        monthlyBudget = 0,
      } = input;

      const payload = {
        totalIncome: Number(totalIncome || 0),
        totalExpense: Number(totalExpense || 0),
        categoryBreakdown: categoryBreakdown || "",
        monthlyBudget: Number(monthlyBudget || 0),
      };

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
