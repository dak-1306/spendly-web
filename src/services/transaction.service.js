import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
  startAfter,
} from "firebase/firestore";

import app from "../firebase";

const db = getFirestore(app);
const colRef = collection(db, "transactions");

// Lấy dữ liệu cho dashboard
const getDashboardData = async (userId, month) => {
  // Return dashboard data for current month and previous month so callers
  // can render comparisons without issuing multiple requests.
  const toResults = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Prefer using the `month` string field (YYYY-MM) to avoid range queries
  // on `createdAt` which can lead to multiple-range queries requiring
  // composite indexes. Documents are expected to include a `month` field.
  const qCurrent = query(
    colRef,
    where("userId", "==", userId),
    where("month", "==", month),
    orderBy("createdAt", "desc"),
  );
  const snapCurrent = await getDocs(qCurrent);

  // previous month
  const prevMonth = new Date(month + "-01");
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  const prevMonthStr = `${prevMonth.getFullYear()}-${String(
    prevMonth.getMonth() + 1,
  ).padStart(2, "0")}`;

  const qPrev = query(
    colRef,
    where("userId", "==", userId),
    where("month", "==", prevMonthStr),
    orderBy("createdAt", "desc"),
  );
  const snapPrev = await getDocs(qPrev);

  return {
    current: toResults(snapCurrent),
    prev: toResults(snapPrev),
  };
};

// Lấy tất cả transaction của user, sort theo ngày tạo mới nhất
const getAllTransactions = async (
  userId,
  { limit: pageLimit = 5, cursor: cursorValue } = {},
) => {
  let q = query(
    colRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  if (cursorValue) {
    const cursorSnap = await getDoc(doc(db, "transactions", cursorValue));
    if (cursorSnap.exists()) q = query(q, startAfter(cursorSnap));
  }
  q = query(q, limit(pageLimit));
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Return the last DocumentSnapshot as cursor for consistency with other
  // filtering functions (avoids extra getDoc calls).
  const lastDoc = snap.docs[snap.docs.length - 1] || null;
  return { results, nextCursor: lastDoc };
};

const getTransactionById = async (id) => {
  const ref = doc(db, "transactions", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

const addTransaction = async (data) => {
  // Ensure `month` field exists (format YYYY-MM). Prefer provided `data.month`,
  // otherwise derive from `data.date` when possible or use current month.
  let monthField = data.month;
  if (!monthField) {
    const d =
      data.date && typeof data.date.toDate === "function"
        ? data.date.toDate()
        : data.date instanceof Date
          ? data.date
          : data.date
            ? new Date(data.date)
            : new Date();
    monthField = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  // Ensure `amount` is stored as a number. Client inputs (type=number) may
  // still arrive as strings; normalize here.
  let amountNum = data.amount;
  if (typeof amountNum === "string") {
    // remove thousand separators if present
    amountNum = Number(amountNum.replace(/,/g, ""));
  } else if (amountNum == null) {
    amountNum = 0;
  }
  if (Number.isNaN(amountNum)) amountNum = 0;

  const payload = {
    ...data,
    amount: amountNum,
    month: monthField,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(colRef, payload);
  return ref.id;
};

const updateTransaction = async (id, data) => {
  console.log("updateTransaction called with id:", id, "and data:", data);
  const ref = doc(db, "transactions", id);
  // Normalize amount if provided
  const cleaned = { ...data };
  if (cleaned.amount !== undefined) {
    if (typeof cleaned.amount === "string") {
      cleaned.amount = Number(cleaned.amount.replace(/,/g, ""));
    }
    if (Number.isNaN(cleaned.amount)) cleaned.amount = 0;
  }
  await updateDoc(ref, { ...cleaned, updatedAt: serverTimestamp() });
};

const deleteTransaction = async (id) => {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
};

const filterTransactionsByMonth = async (
  userId,
  month,
  type,
  { limit: pageLimit = 5, cursor: cursorValue } = {},
) => {
  // Use `month` equality to avoid range queries on `createdAt`.
  let q = query(
    colRef,
    where("userId", "==", userId),
    where("month", "==", month),
    where("type", "==", type),
    orderBy("createdAt", "desc"),
    limit(pageLimit),
  );

  // dùng trực tiếp lastDoc
  if (cursorValue) {
    q = query(q, startAfter(cursorValue));
  }

  const snap = await getDocs(q);

  const results = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  //  trả về document thật
  const lastDoc = snap.docs[snap.docs.length - 1] || null;

  return {
    results,
    nextCursor: lastDoc,
  };
};

// Search transaction
const searchTransactions = async (
  userId,
  searchTerm,
  month,
  { limit: pageLimit = 5, cursor: cursorValue } = {},
) => {
  if (!searchTerm || !searchTerm.trim())
    return { results: [], nextCursor: null };
  const term = searchTerm;
  // Apply month equality when provided so searches are scoped to the selected month
  let q = query(
    colRef,
    where("userId", "==", userId),
    ...(month ? [where("month", "==", month)] : []),
    where("title", ">=", term),
    where("title", "<=", term + "\uf8ff"),
    orderBy("title"),
  );
  if (cursorValue) {
    q = query(q, startAfter(cursorValue));
  }
  q = query(q, limit(pageLimit));
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  //  trả về document thật
  const lastDoc = snap.docs[snap.docs.length - 1] || null;

  return { results, nextCursor: lastDoc };
};

// Filter transaction theo thể loại, theo khoảng giá, sort theo ngày tặng dần/giảm dần và pagination (nếu cần)
const filterTransactions = async (
  userId,
  type,
  category,
  amountRange,
  sortBy,
  month, // thêm month: ví dụ "2026-03"
  { limit: pageLimit = 5, cursor: cursorValue } = {},
) => {
  console.log("filterTransactions called with:", {
    userId,
    type,
    category,
    amountRange,
    sortBy,
    month,
    pageLimit,
    cursorValue,
  });
  let q = query(colRef, where("userId", "==", userId));

  // ===== 0) Filter theo month trước =====
  // If `month` was provided, filter by the `month` field (YYYY-MM) to ensure
  // all filter paths are scoped to the selected month.
  if (month) {
    q = query(q, where("month", "==", month));
  }

  // ===== 1) Filter type =====
  if (type) q = query(q, where("type", "==", type));

  // ===== 2) Filter category =====
  if (category) q = query(q, where("category", "==", category));

  // ===== 3) Filter amount range =====
  let rangeArr = null;
  if (amountRange) {
    if (typeof amountRange === "string") {
      const map = {
        lt100: [0, 100000],
        "100-500": [100000, 500000],
        "500-1M": [500000, 1000000],
        gt1M: [1000000, Infinity],
      };
      rangeArr = map[amountRange] ?? null;
    } else if (Array.isArray(amountRange)) {
      rangeArr = amountRange;
    }
  }

  // ===== 4) Order =====
  // Normalize sortBy into createdAt order direction. Accept UI values like
  // 'asc' / 'desc' (or legacy 'newest'). Default to 'desc' when not provided.
  const createdAtOrder =
    sortBy === "desc" || sortBy === "newest" ? "desc" : "asc";

  if (rangeArr) {
    // If user specifically requested a date sort, honor it (order by createdAt).
    // Otherwise, default to ordering by amount (desc) then createdAt (desc).
    if (sortBy) {
      q = query(
        q,
        where("amount", ">=", rangeArr[0]),
        where("amount", "<=", rangeArr[1]),
        orderBy("createdAt", createdAtOrder),
      );
    } else {
      q = query(
        q,
        where("amount", ">=", rangeArr[0]),
        where("amount", "<=", rangeArr[1]),
        orderBy("amount", "desc"),
        orderBy("createdAt", "desc"),
      );
    }
  } else {
    q = query(q, orderBy("createdAt", createdAtOrder));
  }

  // ===== 5) Pagination =====
  if (cursorValue) {
    q = query(q, startAfter(cursorValue));
  }

  q = query(q, limit(pageLimit));

  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const lastDoc = snap.docs[snap.docs.length - 1] || null;

  return { results, nextCursor: lastDoc };
};

export default {
  getDashboardData,
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  filterTransactionsByMonth,
  searchTransactions,
  filterTransactions,
};
