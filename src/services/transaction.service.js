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
  const start = new Date(month + "-01");
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  const q = query(
    colRef,
    where("userId", "==", userId),
    where("createdAt", ">=", start),
    where("createdAt", "<", end),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
  const nextCursor = snap.docs.length
    ? snap.docs[snap.docs.length - 1].id
    : null;
  return { results, nextCursor };
};

const getTransactionById = async (id) => {
  const ref = doc(db, "transactions", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

const addTransaction = async (data) => {
  const payload = { ...data, createdAt: serverTimestamp() };
  const ref = await addDoc(colRef, payload);
  return ref.id;
};

const updateTransaction = async (id, data) => {
  console.log("updateTransaction called with id:", id, "and data:", data);
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
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
  const start = new Date(month + "-01");
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

  let q = query(
    colRef,
    where("userId", "==", userId),
    where("createdAt", ">=", start),
    where("createdAt", "<", end),
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
  { limit: pageLimit = 5, cursor: cursorValue } = {},
) => {
  if (!searchTerm || !searchTerm.trim())
    return { results: [], nextCursor: null };
  const term = searchTerm;
  let q = query(
    colRef,
    where("userId", "==", userId),
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
  let q = query(colRef, where("userId", "==", userId));

  // ===== 0) Filter theo month trước =====
  if (month) {
    const [year, m] = month.split("-");

    const startOfMonth = new Date(year, m - 1, 1);
    const endOfMonth = new Date(year, m, 1);

    q = query(
      q,
      where("createdAt", ">=", startOfMonth),
      where("createdAt", "<", endOfMonth),
    );
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
  if (rangeArr) {
    q = query(
      q,
      where("amount", ">=", rangeArr[0]),
      where("amount", "<=", rangeArr[1]),
      orderBy("amount", "desc"),
      orderBy("createdAt", sortBy === "newest" ? "desc" : "asc"),
    );
  } else {
    q = query(q, orderBy("createdAt", sortBy === "newest" ? "desc" : "asc"));
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
