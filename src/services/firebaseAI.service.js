import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

// Đảm bảo object luôn ra một chuỗi JSON duy nhất dù thứ tự key thay đổi
function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return (
    "{" +
    keys
      .map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k]))
      .join(",") +
    "}"
  );
}

async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateKey(payload) {
  try {
    const snapshotStr = stableStringify(payload);
    const key = await sha256Hex(snapshotStr);
    const snapshot = JSON.parse(snapshotStr);
    return { key, snapshotStr, snapshot };
  } catch (error) {
    console.error("Lỗi khi tạo key:", error);
    throw error;
  }
}

export async function getCachedAnalysis(key, userId) {
  try {
    const ref = doc(db, "aiAnalysis", key);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    // Bảo mật: Chỉ trả về nếu đúng userId sở hữu cache này
    return data.userId === userId ? data : null;
  } catch (error) {
    console.error("Lỗi khi lấy cache:", error);
    return null;
  }
}
export async function saveAnalysis(key, userId, snapshot, result) {
  try {
    const ref = doc(db, "aiAnalysis", key);

    await setDoc(
      ref,
      {
        key,
        userId,
        payloadSnapshot: snapshot,
        result,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Lỗi khi lưu cache:", error);
  }
}
// export async function saveAnalysis(key, userId, snapshot, result) {
//   console.log(
//     "Lưu cache với key:",
//     key,
//     "và userId:",
//     userId,
//     "payloadSnapshot:",
//     snapshot,
//     "result:",
//     result,
//   );
//   const ref = doc(db, "aiAnalysis", key);
//   const snap = await getDoc(ref);
//   console.log("ref:", ref);
//   console.log("snap:", snap);

//   try {
//     const ref = doc(db, "aiAnalysis", key);

//     const snap = await getDoc(ref);
//     if (snap.exists()) {
//       console.log(
//         "cập nhật document với key:",
//         key,
//         "userId:",
//         userId,
//         "payloadSnapshot:",
//         snapshot,
//         "result:",
//         result,
//       );
//       // Cập nhật fields cần thay đổi, giữ nguyên `createdAt`
//       await setDoc(
//         ref,
//         {
//           result,
//           payloadSnapshot: snapshot,
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true },
//       );
//     } else {
//       console.log(
//         "tạo mới document với key:",
//         key,
//         "userId:",
//         userId,
//         "payloadSnapshot:",
//         snapshot,
//         "result:",
//         result,
//       );
//       // Tạo mới document với createdAt
//       await setDoc(
//         ref,
//         {
//           key,
//           userId,
//           payloadSnapshot: snapshot,
//           result,
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true },
//       );
//     }
//   } catch (error) {
//     console.error("Lỗi khi lưu cache:", error);
//   }
// }
