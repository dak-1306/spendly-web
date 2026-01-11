/**
 * Chuẩn hóa giao dịch trước khi xây prompt / phân tích
 * Input tx có thể từ frontend (Firestore snapshot) với fields như:
 *  { id, amount, currency, date, description, category, type }
 */
const DEFAULT_CURRENCY = "usd";

function parseAmount(v) {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function parseDate(v) {
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d)) return null;
  return d.toISOString();
}

function inferType(tx) {
  // simple heuristic: negative amount or keywords
  const amt = parseAmount(tx.amount);
  if (amt < 0) return "expense";
  const desc = (tx.description || "").toLowerCase();
  if (/(refund|income|salary|payroll|deposit)/i.test(desc)) return "income";
  return "expense";
}

function inferCategory(tx) {
  if (tx.category) return tx.category;
  const desc = (tx.description || "").toLowerCase();
  const map = [
    { k: ["uber", "grab", "taxi", "ride"], c: "transport" },
    { k: ["coffee", "starbucks", "cafe"], c: "coffee" },
    { k: ["grocery", "supermarket", "mart"], c: "groceries" },
    { k: ["rent", "lease"], c: "rent" },
    { k: ["netflix", "spotify", "subscription"], c: "subscription" },
    { k: ["restaurant", "phở", "eat", "dinner", "lunch"], c: "dining" },
  ];
  for (const m of map) {
    if (m.k.some((kw) => desc.includes(kw))) return m.c;
  }
  return "other";
}

function normalizeTransaction(tx, opts = {}) {
  const currency = (
    tx.currency ||
    opts.defaultCurrency ||
    DEFAULT_CURRENCY
  ).toLowerCase();
  const amount = parseAmount(tx.amount);
  const date = parseDate(tx.date || tx.createdAt || tx.timestamp);
  const type = inferType(tx);
  const category = inferCategory(tx);

  return {
    id: tx.id || tx.transactionId || tx._id || null,
    raw: tx,
    amount,
    currency,
    date,
    type,
    category,
    description: tx.description || tx.note || "",
    metadata: tx.metadata || {},
  };
}

function normalizeTransactions(list = [], opts = {}) {
  return list.map((tx) => normalizeTransaction(tx, opts));
}

function aggregateByPeriod(list = [], { period = "month" } = {}) {
  // period = 'day' | 'month'
  const buckets = {};
  for (const tx of list) {
    if (!tx.date) continue;
    const d = new Date(tx.date);
    const key =
      period === "day"
        ? d.toISOString().slice(0, 10)
        : d.toISOString().slice(0, 7);
    buckets[key] = buckets[key] || {
      date: key,
      totalExpense: 0,
      totalIncome: 0,
      byCategory: {},
    };
    if (tx.type === "income") buckets[key].totalIncome += tx.amount;
    else buckets[key].totalExpense += Math.abs(tx.amount);
    const cat = tx.category || "other";
    buckets[key].byCategory[cat] =
      (buckets[key].byCategory[cat] || 0) + Math.abs(tx.amount);
  }
  return Object.values(buckets).sort((a, b) => (a.date < b.date ? -1 : 1));
}

function topCategories(list = [], limit = 5) {
  const counter = {};
  for (const tx of list) {
    const c = tx.category || "other";
    counter[c] = (counter[c] || 0) + Math.abs(tx.amount);
  }
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, total]) => ({ category, total }));
}

function toPromptFormat(list = [], opts = {}) {
  // return compact JSON-ready summary for prompt or storage
  const normalized = normalizeTransactions(list, opts);
  const totals = normalized.reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.totalIncome += tx.amount;
      else acc.totalExpense += Math.abs(tx.amount);
      acc.count += 1;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, count: 0 }
  );

  return {
    summary: {
      totalIncome: totals.totalIncome,
      totalExpense: totals.totalExpense,
      transactionCount: totals.count,
      currency: opts.defaultCurrency || DEFAULT_CURRENCY,
      topCategories: topCategories(normalized, opts.topCategoriesLimit || 3),
    },
    transactions: normalized.slice(0, opts.maxTransactions || 200), // limit for prompt size
    aggregatesByMonth: aggregateByPeriod(normalized, { period: "month" }),
  };
}

module.exports = {
  normalizeTransaction,
  normalizeTransactions,
  aggregateByPeriod,
  topCategories,
  toPromptFormat,
};
