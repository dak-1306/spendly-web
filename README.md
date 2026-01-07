# frontend

## Các thư viện đã cài đặt

Dependencies:

- @tailwindcss/vite — npm install @tailwindcss/vite@^4.1.18

```bash
npm install @tailwindcss/vite
```

- axios — npm install axios@^1.13.2

```bash
npm install axios
```

- clsx — npm install clsx@^2.1.1

```bash
npm install clsx
```

- react-dom — npm install react-dom@^19.2.3

```bash
npm install react-dom
```

- react-router-dom — npm install react-router-dom@^7.11.0

```bash
npm install react-router-dom
```

- recharts — npm install recharts@^3.6.0

```bash
npm install recharts
```

## Cây thư mục (đã format lại, không đổi nội dung)

```
frontend/
├── public/
│ └── favicon.svg
│
├── src/
│ ├── assets/
│ │ ├── icons/
│ │ └── images/
│
│ ├── components/
│ │ ├── common/
│ │ │ ├── Button.jsx
│ │ │ ├── Input.jsx
│ │ │ ├── Modal.jsx
│ │ │ ├── Card.jsx
│ │ │ └── Loader.jsx
│ │ │
│ │ ├── layout/
│ │ │ ├── Header.jsx
│ │ │ ├── FooterNav.jsx # thanh công cụ footer
│ │ │ └── ProtectedLayout.jsx
│ │ │
│ │ ├── charts/
│ │ │ ├── CashFlowChart.jsx
│ │ │ ├── ExpensePie.jsx
│ │ │ └── BudgetUsedBar.jsx
│ │ │
│ │ └── ai/
│ │ ├── AIInsightCard.jsx
│ │ └── AISuggestionBox.jsx
│
│ ├── pages/
│ │ ├── Home/
│ │ │ └── Home.jsx
│ │ │
│ │ ├── Auth/
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ │
│ │ ├── Dashboard/
│ │ │ └── Dashboard.jsx
│ │ │
│ │ ├── Expenses/
│ │ │ ├── ExpensePage.jsx
│ │ │ ├── CategoryCard.jsx
│ │ │ └── ExpenseList.jsx
│ │ │
│ │ ├── AI/
│ │ │ └── AIAnalysis.jsx
│ │ │
│ │ └── Settings/
│ │ └── Settings.jsx
│
│ ├── canvas/
│ │ └── AnimatedGradient.jsx # canvas gradient động
│
│ ├── hooks/
│ │ ├── useAuth.js
│ │ ├── useTheme.js
│ │ └── useExpenses.js
│
│ ├── context/
│ │ ├── AuthContext.jsx
│ │ ├── ThemeContext.jsx
│ │ └── FinanceContext.jsx
│
│ ├── services/
│ │ ├── api.js
│ │ ├── auth.service.js
│ │ ├── expense.service.js
│ │ └── ai.service.js
│
│ ├── utils/
│ │ ├── formatCurrency.js
│ │ ├── date.js
│ │ └── constants.js
│
│ ├── styles/
│ │ └── index.css
│
│ ├── App.jsx
│ ├── main.jsx
│ └── routes.jsx
│
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── package.json
└── README.md
```
