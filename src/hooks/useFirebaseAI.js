import { getAuth } from "firebase/auth";
import {
  generateKey,
  getCachedAnalysis,
  saveAnalysis,
} from "../services/firebaseAI.service";

export function useFirebaseAI() {
  async function fetchOrCompute(payload, computeFn) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Vui lòng đăng nhập");
    const { key, snapshot } = await generateKey(payload);
    const cached = await getCachedAnalysis(key, userId);
    console.log(
      "Cache check for key:",
      key,
      "and uid:",
      userId,
      "result:",
      cached,
    );
    if (cached) return cached.result;
    const result = await computeFn(payload);
    console.log(
      "Computed new result for key:",
      key,
      "and uid:",
      userId,
      "result:",
      result,
    );
    await saveAnalysis(key, userId, snapshot, result);
    return result;
  }
  return { fetchOrCompute, generateKey, getCachedAnalysis, saveAnalysis };
}
