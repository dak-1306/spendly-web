import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";

const REGION = "asia-southeast1";

export async function getFinancialReport(payload) {
  const functions = getFunctions(app, REGION);
  const fn = httpsCallable(functions, "getFinancialReport");
  const res = await fn(payload);
  return res.data;
}
