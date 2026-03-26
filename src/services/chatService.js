import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";

const REGION = "asia-southeast1";

export async function sendChat(message) {
  const functions = getFunctions(app, REGION);
  const fn = httpsCallable(functions, "chat");
  const res = await fn({ message });
  return res.data;
}

export default { sendChat };
