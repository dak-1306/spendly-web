export function buildFinancialPayload(
  transactions = [],
  monthlyBudget = 0,
  monthFilter = null
) {
  // Lọc theo month nếu cần (chuỗi "YYYY-MM")
  const items = monthFilter
    ? transactions.filter((t) => t.month === monthFilter)
    : transactions;

  const totalIncome = items
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const totalExpense = items
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // Tổng theo category (chỉ tính expense để báo cáo chi tiêu)
  const catMap = items
    .filter((t) => t.type === "expense")
    .reduce((m, t) => {
      const k = t.category || "Khác";
      m[k] = (m[k] || 0) + (Number(t.amount) || 0);
      return m;
    }, {});

  const categories = Object.entries(catMap).map(([category, total]) => ({
    category,
    total,
    percent: totalExpense > 0 ? +((total / totalExpense) * 100).toFixed(2) : 0,
    count: items.filter(
      (t) => t.type === "expense" && (t.category || "Khác") === category
    ).length,
  }));

  // Format categoryBreakdown là chuỗi để chèn vào prompt (Markdown/simple list)
  const categoryBreakdown =
    categories
      .map(
        (c) =>
          `- ${c.category}: ${c.total.toLocaleString("vi-VN")} VND (${
            c.percent
          }%) — ${c.count} giao dịch`
      )
      .join("\n") || "Không có giao dịch chi tiêu.";

  return {
    totalIncome,
    totalExpense,
    categoryBreakdown,
    monthlyBudget,
  };
}
