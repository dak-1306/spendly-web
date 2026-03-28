# PROJECT_OVERVIEW.md

## Project description

- Name: Spendly (personal finance tracker and AI assistant).
- Purpose: Track income/expenses, visualize monthly reports and enable AI-driven financial analysis and chat assistance.
- Primary audience: End users who want lightweight personal finance tracking and quick AI insights.

## Tech stack

- Frontend: React (JSX), Vite
- State: Zustand (useTransactionStore)
- Styling: Tailwind CSS classes (utility-first in components)
- Backend / Cloud functions: Firebase (Auth, Firestore, Functions, Cloud Functions genkit integrations)
- AI: Genkit + googleAI plugin (server-side Cloud Functions in `functions/`)
- Services: Firebase SDK (auth/firestore/functions)
  - Note: `src/services/index.js` currently re-exports only `transactionService`. Other service modules (auth, user, ai, chat, firebaseAI) are imported directly by consumers.
- Build config: vite.config.js

## Main features

- Authentication: Email/password, Google sign-in via Firebase (`src/services/auth.service.js`).
- Transaction CRUD: add/update/delete income & expense; optimistic UI updates (`src/services/transaction.service.js`, `src/stores/transaction`).
- Filtering & paging: search, filter by month/category/amount, cursor-based pagination.
- Dashboard: monthly summary, charts, previous-month comparison (`src/pages/Dashboard.jsx`, `src/components/dashboard/*`).
- AI features: Chat assistant and financial report generation via callable Cloud Functions (`src/services/chatService.js`, `src/services/ai.service.js`, `functions/src/`).
- User profile and settings stored in `users` Firestore collection (`src/services/user.service.js`).

## Application flow overview

- App mount: `src/App.jsx` wraps app with providers: `LanguageProvider`, `AuthProvider`, `ThemeProvider`, `UserProvider` and runs `TransactionInitializer` to prefetch transactions.
- Auth: `AuthProvider` subscribes to Firebase auth (`subscribeAuth`) and ensures user doc exists (`createUserIfNotExists`).
- UI → Store → Service: UI components (e.g., `AddTransaction.jsx`, `EditTransaction.jsx`, `Dashboard.jsx`) call actions from `useTransactionStore` (either via hook selectors or `useTransactionStore.getState()`) which call `transactionService` methods that interact with Firestore.
- AI: Frontend calls `getFinancialReport` or `sendChat` services which call Firebase callable functions in `functions/`.
- Data persistence: Firestore collections: `transactions`, `users`, `aiAnalysis` (see DATABASE_SCHEMA.md).

---

_Generated from code in repository at src/ and functions/ directories._
