require("dotenv").config();

const required = ["MONGO_URI", "GEMINI_API_KEY"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,
  // thêm biến khác nếu cần
};
