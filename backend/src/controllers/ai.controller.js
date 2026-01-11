const { toPromptFormat } = require("../utils/normalizeTransactions");
const { generateText } = require("../services/genkit.service");

/**
 * POST /api/ai/analyze
 * Body: { transactions: [...], options: {...} }
 * Returns: { normalized, ai: <parsed json or raw text> }
 */
exports.analyze = async (req, res) => {
  try {
    const transactions = Array.isArray(req.body.transactions)
      ? req.body.transactions
      : [];
    const options = req.body.options || {};

    const normalized = toPromptFormat(transactions, options);

    const prompt = `You are a helpful personal finance assistant.
Given the transaction summary and aggregates (JSON) produce a JSON response with keys:
- insights: array of short bullets (1-2 sentence each)
- anomalies: array of { id, reason } for suspicious transactions
- recommendations: array of actionable suggestions
- metrics: small object with notable numbers (eg. topCategory, avgDailyExpense)
Respond ONLY with valid JSON.

SUMMARY:
${JSON.stringify(normalized.summary)}

AGGREGATES:
${JSON.stringify(normalized.aggregatesByMonth)}

SAMPLE_TRANSACTIONS (first 20):
${JSON.stringify(normalized.transactions.slice(0, 20))}`;

    const aiText = await generateText(prompt, { maxTokens: 800 });

    let aiParsed;
    try {
      aiParsed = typeof aiText === "string" ? JSON.parse(aiText) : aiText;
    } catch (err) {
      aiParsed = { raw: aiText };
    }

    return res.json({ ok: true, data: { normalized, ai: aiParsed } });
  } catch (err) {
    console.error("ai.analyze error:", err);
    return res
      .status(500)
      .json({ ok: false, error: err.message || "internal_error" });
  }
};

/**
 * POST /api/ai/chat
 * Body: { message: "..." }
 * Simple relay using genkit; returns text reply
 */
exports.chat = async (req, res) => {
  try {
    const message = (req.body && req.body.message) || "";
    if (!message)
      return res.status(400).json({ ok: false, error: "missing_message" });

    const prompt = `User: ${message}\nAssistant:`;
    const aiText = await generateText(prompt, { maxTokens: 512 });

    return res.json({ ok: true, reply: aiText });
  } catch (err) {
    console.error("ai.chat error:", err);
    return res
      .status(500)
      .json({ ok: false, error: err.message || "internal_error" });
  }
};
