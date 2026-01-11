export const monthlySummaryPrompt = ({ month, transactions }) => `
Create a financial summary for the month: ${month}

Include:
- Total income
- Total expenses
- Savings (income - expenses)
- Top 3 expense categories
- One short overall evaluation

Transactions:
${JSON.stringify(transactions, null, 2)}

Keep the summary concise and structured.
`;
