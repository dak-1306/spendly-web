import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/index.js";

/**
 * Register user with email/password and set displayName.
 * Returns firebase User object.
 */
export async function registerWithEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
    if (typeof cred.user.reload === "function") {
      await cred.user.reload();
    }
  }
  return cred.user;
}

/**
 * Sign in with email/password.
 * Returns firebase User object.
 */
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/**
 * Sign out current user.
 */
export async function logout() {
  await signOut(auth);
}

// Delete user
export async function deleteUserService() {
  const user = getCurrentUser();
  if (!user) return;
  await deleteUser(user);
}

/**
 * Sign in with Google popup. Returns firebase User object.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/**
 * Subscribe to auth state changes. Returns unsubscribe function.
 * callback receives firebase.User | null
 */
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user (may be null).
 */
export function getCurrentUser() {
  return auth.currentUser;
}

export default {
  registerWithEmail,
  loginWithEmail,
  logout,
  deleteUserService,
  signInWithGoogle,
  subscribeAuth,
  getCurrentUser,
};
