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
const getAllTransactions = async (userId) => {
  const q = query(
    colRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

// Filter transaction theo tháng năm
const filterTransactionsByMonth = async (userId, month) => {
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

// Search transaction
const searchTransactions = async (userId, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return [];
  const term = searchTerm;
  const q = query(
    colRef,
    where("userId", "==", userId),
    where("title", ">=", term),
    where("title", "<=", term + "\uf8ff"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Filter transaction theo thể loại, theo khoảng giá, sort theo ngày tặng dần/giảm dần và pagination (nếu cần)
const filterTransactions = async (userId, category, amountRange, sortBy) => {
  console.log("filterTransactions params:", {
    userId,
    category,
    amountRange,
    sortBy,
  });
  let q = query(colRef, where("userId", "==", userId));

  if (category) q = query(q, where("category", "==", category));

  // normalize amountRange: accept ["lt100"] id or [min,max]
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

  console.log("Normalized rangeArr:", rangeArr);
  if (rangeArr) {
    q = query(
      q,
      where("amount", ">=", rangeArr[0]),
      where("amount", "<=", rangeArr[1]),
    );
  }

  if (sortBy) {
    // nếu có inequality trên amount thì orderBy(amount) trước để thỏa rule của Firestore
    if (rangeArr) {
      q = query(q, orderBy("amount", "desc"));
    }
    q = query(q, orderBy("createdAt", sortBy === "newest" ? "desc" : "asc"));
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
