const admin = require("../config/firebaseAdmin");

/**
 * checkQuota middleware - reads users/{uid}.aiQuota and optionally consumes quota.
 * Assumes req.user is set by auth middleware.
 * Options: { consume = 1 }
 *
 * Usage:
 *   const requireAuth = require('./auth.middleware');
 *   const { checkQuota } = require('./quota.middleware');
 *   router.post('/analyze', requireAuth(), checkQuota({ consume: 1 }), controller.analyze);
 */
function checkQuota({ consume = 1 } = {}) {
  return async (req, res, next) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: "unauthorized" });

      const db = admin.firestore();
      const docRef = db.collection("users").doc(uid);

      await db.runTransaction(async (tx) => {
        const snap = await tx.get(docRef);
        if (!snap.exists) throw { code: "USER_NOT_FOUND" };

        const data = snap.data() || {};
        const q = data.aiQuota || {};
        const daily = typeof q.daily === "number" ? q.daily : 0;
        let usedToday = typeof q.usedToday === "number" ? q.usedToday : 0;
        const lastResetTs = q.lastReset || null;
        const now = new Date();

        // handle daily reset (compare date string)
        let lastResetDate =
          lastResetTs && lastResetTs.toDate
            ? lastResetTs.toDate()
            : lastResetTs
            ? new Date(lastResetTs)
            : null;
        const needReset =
          !lastResetDate || lastResetDate.toDateString() !== now.toDateString();
        if (needReset) usedToday = 0;

        if (daily > 0 && usedToday + consume > daily) {
          throw { code: "QUOTA_EXCEEDED" };
        }

        const newAiQuota = {
          ...(q || {}),
          usedToday: usedToday + consume,
          lastReset: admin.firestore.Timestamp.fromDate(
            needReset ? now : lastResetDate || now
          ),
        };

        tx.update(docRef, { aiQuota: newAiQuota });
      });

      return next();
    } catch (err) {
      if (err && err.code === "QUOTA_EXCEEDED")
        return res.status(429).json({ error: "ai_quota_exceeded" });
      if (err && err.code === "USER_NOT_FOUND")
        return res.status(404).json({ error: "user_not_found" });
      console.error("quota middleware error:", err);
      return res.status(500).json({ error: "quota_check_failed" });
    }
  };
}

module.exports = { checkQuota };
