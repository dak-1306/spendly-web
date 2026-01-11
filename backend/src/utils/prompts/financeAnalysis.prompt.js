export const financeAnalysisPrompt = ({ transactions }) => `
Analyze the following personal finance transactions.

Tasks:
1. Calculate total income
2. Calculate total expenses
3. Identify main expense categories
4. Detect unusual or high expenses
5. Comment on spending balance

Transactions:
${JSON.stringify(transactions, null, 2)}

Return result in clear bullet points.
`;
