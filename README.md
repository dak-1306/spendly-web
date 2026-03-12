# Spendly - Web quản lý tài chính cá nhân

## Mô tả

Tổng quan: Spendly (quản lý chi tiêu cá nhân) — một mini project được xây dựng nhằm mục đích học tập

Tính năng chính:

- Đăng nhập/đăng ký
- Quản lý giao dịch
- Dashboard thống kê
- Tích hợp AI để gợi ý

## Công nghệ sử dụng

- React + Vite
- Tailwind CSS
- axios
- State & Context: React Context / custom hooks cho auth, transactions
- Firebase - backend (Auth, firestore, cloud functions, AI logic, Genkit)
- lucide-react
- recharts
- react-router-dom

## Cài đặt

Clone và cài:

```bash
git clone <repo>
npm install
```

Chạy:

```bash
npm run dev
```

Firebase functions:

```bash
cd functions && npm install
```

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

<table align="center">
<tr>
<td align="center">
<img src="src/assets/images/dashboard_img.png" width="400"><br>
<b>Dashboard</b>
</td>

<td align="center">
<img src="src/assets/images/expense_img.png" width="400"><br>
<b>Expense</b>
</td>
</tr>

<tr>
<td align="center">
<img src="src/assets/images/profile_img.png" width="400"><br>
<b>Profile</b>
</td>

<td align="center">
<img src="src/assets/images/AI_img.png" width="400"><br>
<b>AI Assistant</b>
</td>
</tr>
</table>

## Tác giả

Trần Hải Đăng
