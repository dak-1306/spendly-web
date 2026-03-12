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
- UI / CSS: Tailwind CSS
- State & Context: React Context / custom hooks cho auth, transactions
- Backend / Auth / DB: Firebase (Authentication, Firestore, Storage, Cloud Functions).
- Charting: thư viện biểu đồ (sử dụng các component chart trong dashboard).
- Tools dev: ESLint

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

 <section style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width:1100px; margin:0 auto; padding:1rem;" aria-label="Bộ sưu tập ảnh">
  <figure style="margin:0; overflow:hidden; border-radius:8px; background:#f7f7f7;">
    <img src="/src/assets/images/dashboard_img.png" alt="Dashboard" style="width:100%; height:220px; object-fit:cover; display:block;">
  </figure>

  <figure style="margin:0; overflow:hidden; border-radius:8px; background:#f7f7f7;">
    <img src="/src/assets/images/expense_img.png" alt="Expense" style="width:100%; height:220px; object-fit:cover; display:block;">
  </figure>

  <figure style="margin:0; overflow:hidden; border-radius:8px; background:#f7f7f7;">
    <img src="/src/assets/images/profile_img.png" alt="Profile" style="width:100%; height:220px; object-fit:cover; display:block;">
  </figure>

  <figure style="margin:0; overflow:hidden; border-radius:8px; background:#f7f7f7;">
    <img src="/src/assets/images/AI_img.png" alt="AI" style="width:100%; height:220px; object-fit:cover; display:block;">
  </figure>
</section>
## Tác giả

Trần Hải Đăng

```

```
