export const advicePrompt = ({ summary }) => `
Based on the following financial summary, give 3 practical suggestions
to improve personal financial management.

Rules:
- Suggestions must be realistic
- Avoid generic advice
- Each suggestion max 2 sentences

Financial summary:
${summary}
`;
