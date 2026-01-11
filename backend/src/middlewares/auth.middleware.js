const admin = require("../config/firebaseAdmin");

/**
 * requireAuth middleware - verifies Firebase ID token and attaches req.user
 * Usage: router.post('/analyze', requireAuth(), ...);
 */
module.exports = function requireAuth() {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const m = header.match(/^Bearer (.+)$/);
      if (!m) return res.status(401).json({ error: "no_token" });

      const idToken = m[1];
      const decoded = await admin.auth().verifyIdToken(idToken, true);
      req.user = {
        uid: decoded.uid,
        email: decoded.email || null,
        claims: decoded,
      };
      return next();
    } catch (err) {
      console.error("auth middleware error:", err);
      return res.status(401).json({ error: "unauthorized" });
    }
  };
};
