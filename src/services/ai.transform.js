export function buildFinancialPayload(
  transactions = [],
  monthlyBudget = 0,
  monthFilter = null
) {
  // 1. Lọc và Ép kiểu dữ liệu để tránh lỗi so sánh string/number
  const items = monthFilter
    ? transactions.filter((t) => t.month === monthFilter)
    : transactions;

  const budgetNumber = Number(monthlyBudget || 0);

  const totalIncome = items
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const totalExpense = items
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // 2. Gom nhóm theo Category
  const catMap = items
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
      const count = items.filter(
        (t) => t.type === "expense" && (t.category || "Khác") === category
      ).length;
      
      return {
        category,
        total,
        percent: totalExpense > 0 ? +((total / totalExpense) * 100).toFixed(2) : 0,
        count,
      };
    });

  // 4. Tạo chuỗi breakdown (đã được sắp xếp)
  const categoryBreakdown =
    sortedCategories
      .map(
        (c) =>
          `- ${c.category}: ${c.total.toLocaleString("vi-VN")} VND (${c.percent}%) — ${c.count} giao dịch`
      )
      .join("\n") || "Không có giao dịch chi tiêu.";

  return {
    totalIncome,
    totalExpense,
    categoryBreakdown,
    monthlyBudget: budgetNumber,
  };
}