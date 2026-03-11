# frontend

## Mô tả

## Công nghệ sử dụng

## Cài đặt

## Cấu trúc

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

## Hình ảnh

## Tác giả

Trần Hải Đăng
