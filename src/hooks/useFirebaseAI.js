import { getAuth } from "firebase/auth";
import {
  generateKey,
  getCachedAnalysis,
  saveAnalysis,
} from "../services/firebaseAI.service";

export function useFirebaseAI() {
  async function fetchOrCompute(payload, computeFn) {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Vui lòng đăng nhập");
    const { key, snapshot } = await generateKey(payload);
    const cached = await getCachedAnalysis(key, uid);
    console.log(
      "Cache check for key:",
      key,
      "and uid:",
      uid,
      "result:",
      cached,
    );
    if (cached) return cached.result;
    const result = await computeFn(payload);
    console.log(
      "Computed new result for key:",
      key,
      "and uid:",
      uid,
      "result:",
      result,
    );
    await saveAnalysis(key, uid, snapshot, result);
    return result;
  }
  return { fetchOrCompute, generateKey, getCachedAnalysis, saveAnalysis };
}
