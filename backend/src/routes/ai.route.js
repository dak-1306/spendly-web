const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const requireAuth = require("../middlewares/auth.middleware");
const { checkQuota } = require("../middlewares/quota.middleware");

// health / status
router.get("/status", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// analyze: protected, consume quota
router.post(
  "/analyze",
  requireAuth(),
  checkQuota({ consume: 1 }),
  aiController.analyze
);

// chat relay: protected (no quota)
router.post("/chat", requireAuth(), aiController.chat);

module.exports = router;
