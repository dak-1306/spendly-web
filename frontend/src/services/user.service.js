import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import app from "../firebase/index.js";

const db = getFirestore(app);

/**
 * Ensure a user document exists in `users` collection after login.
 * If the document already exists, returns the existing data.
 * If not, creates it with provided defaults.
 *
 * @param {import('firebase/auth').User} user - Firebase Auth user object
 * @param {Object} [options] - Optional defaults: { currency, aiDaily, avatar, name }
 */
export async function createUserIfNotExists(user, options = {}) {
  if (!user || !user.uid) throw new Error("Invalid user object");

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };

  const payload = {
    name: user.displayName || options.name || "",
    email: user.email || "",
    avatar: user.photoURL || options.avatar || "",
    currency: options.currency || "usd",
    aiQuota: {
      daily: typeof options.aiDaily === "number" ? options.aiDaily : 10,
      usedToday: 0,
      lastReset: serverTimestamp(),
    },
    createdAt: serverTimestamp(),
    userId: user.uid,
  };

  try {
    // try create then re-read to return stored data
    await setDoc(ref, payload);
    const createdSnap = await getDoc(ref);
    if (!createdSnap.exists()) throw new Error("Failed to create user doc");
    return { id: createdSnap.id, ...createdSnap.data() };
  } catch (err) {
    console.error("createUserIfNotExists error:", err);
    throw err;
  }
}

/**
 * Update existing user document fields.
 * @param {string} uid
 * @param {Object} data
 */
export async function updateUser(uid, data) {
  if (!uid) throw new Error("Missing uid");
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export default {
  createUserIfNotExists,
  updateUser,
};
