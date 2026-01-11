const { genkit } = require("genkit");
const { gemini15Flash, googleAI } = require("@genkit-ai/googleai");
const env = require("../config/env");

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: env.geminiApiKey || process.env.GOOGLE_API_KEY,
    }),
  ],
  model: gemini15Flash,
});

async function generateText(prompt, opts = {}) {
  // adjust call shape if genkit API differs in your version
  const resp = await ai.generate(prompt, opts);
  // return text payload (adapt if resp shape different)
  return resp.text || resp.output || resp;
}

module.exports = { ai, generateText };
