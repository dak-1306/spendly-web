import {totalIncome, totalExpense} from "../utils/financial.js";
export function buildFinancialPayload({transactions = [], monthlyBudget = 0}) {
  const budgetNumber = Number(monthlyBudget || 0);

  // 1. Tính tổng thu nhập và chi tiêu
  const incomes= totalIncome({ data: transactions.filter((t) => t.type === "income") });
  const expenses = totalExpense({ data: transactions.filter((t) => t.type === "expense") });

  // 2. Gom nhóm theo Category
  const catMap = transactions
    .filter((t) => t.type === "expense")
    .reduce((m, t) => {
      const k = t.category || "Khác";
      m[k] = (m[k] || 0) + (Number(t.amount) || 0);
      return m;
    }, {});

  // 3. QUAN TRỌNG: Sắp xếp category theo tên (A-Z) để Hash luôn cố định
  const sortedCategories = Object.entries(catMap)
    .sort((a, b) => a[0].localeCompare(b[0])) // Sắp xếp theo tên category
    .map(([category, total]) => {
      const count = transactions.filter(
        (t) => t.type === "expense" && (t.category || "Khác") === category,
      ).length;

      return {
        category,
        total,
        percent:
          expenses > 0 ? +((total / expenses) * 100).toFixed(2) : 0,
        count,
      };
    });

  // 4. Tạo chuỗi breakdown (đã được sắp xếp)
  const categoryBreakdown =
    sortedCategories
      .map(
        (c) =>
          `- ${c.category}: ${c.total.toLocaleString("vi-VN")} VND (${c.percent}%) — ${c.count} giao dịch`,
      )
      .join("\n") || "Không có giao dịch chi tiêu.";

  return {
    totalIncome: incomes,
    totalExpense: expenses,
    categoryBreakdown,
    monthlyBudget: budgetNumber,
  };
}
