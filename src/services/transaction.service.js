import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);
const colRef = collection(db, "transactions");

const getAllTransactions = async () => {
  const q = query(colRef, orderBy("createdAt", "desc"));
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
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

const deleteTransaction = async (id) => {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
};

const subscribeTransactions = (onUpdate, onError) => {
  const q = query(colRef, orderBy("createdAt", "desc"));
  const unsub = onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(items);
    },
    (err) => onError && onError(err)
  );
  return unsub;
};

export default {
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  subscribeTransactions,
};
