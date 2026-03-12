/* Formatter nhỏ cho phần trăm */
const formatPercent = (v) => Number(v.toFixed(2));
// helper lấy chuỗi tháng 'YYYY-MM' từ transaction (nếu không có month)
const transactionToMonth = (t) => {
  if (!t) return "";
  if (t.month) return t.month;
  // t.date có thể là Firestore Timestamp hoặc Date
  const d =
    t.date && typeof t.date.toDate === "function"
      ? t.date.toDate()
      : t.date instanceof Date
        ? t.date
        : null;
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// tổng thu nhập và chi tiêu cho tháng (memoized)
const totalIncome = ({ monthData }) =>
  monthData.incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);

const totalExpense = ({ monthData }) =>
  monthData.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

// số dư hiện tại
const balance = ({ monthData }) =>
  totalIncome({ monthData }) - totalExpense({ monthData });

// tính chi tiêu tháng trước để so sánh (memoized)
const prevExpense = ({ prevDataExpenses }) =>
  prevDataExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

// tính tháng trước để so sánh (memoized)
const prevMonth = ({ month }) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// hàm chuyển đổi timestamp (Firestore hoặc ISO string) thành Date object để hiển thị / xử lý
function toDateObject(ts) {
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (typeof ts.seconds === "number") {
    const millis = ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6);
    return new Date(millis);
  }
  if (typeof ts === "string") {
    const d = new Date(ts);
    return isNaN(d) ? null : d;
  }
  return null;
}
// hàm định dạng ngày cho input type="date" (YYYY-MM-DD)
function formatForInputDate(ts) {
  const d = toDateObject(ts);
  return d ? d.toISOString().slice(0, 10) : "";
}
// hàm định dạng ngày cho hiển thị (mặc định: "1 Jan 2024")`
function formatForDisplay(ts, locale = undefined, opts) {
  const d = toDateObject(ts);
  if (!d) return "";
  return d.toLocaleDateString(locale, opts || { year: "numeric", month: "short", day: "numeric" });
}
export {
  formatPercent,
  transactionToMonth,
  totalIncome,
  totalExpense,
  balance,
  prevMonth,
  prevExpense,
  
  formatForInputDate,
  formatForDisplay,
};
