const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const aiController = require("../controllers/ai.controller");

// health / status
router.get("/status", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// analyze: protected, consume quota
router.post(
  "/analyze",
  requireAuth({ checkQuota: true }),
  aiController.analyze
);

// chat relay: protected, may not consume analyze quota
router.post("/chat", requireAuth(), aiController.chat);

module.exports = router;
