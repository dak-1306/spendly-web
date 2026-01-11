export const chatPrompt = ({ question, userContext }) => `
User question:
"${question}"

User financial context (optional):
${userContext ? JSON.stringify(userContext, null, 2) : "No data"}

Rules:
- Answer clearly and directly
- Do not hallucinate data
- If question is unrelated to finance, respond briefly and redirect back
`;
