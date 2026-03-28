# FOLDER_STRUCTURE.md

## Top-level tree (key folders/files)

- `src/` — Main frontend source.
  - `components/` — Reusable UI components grouped by responsibility.
  - `pages/` — Route pages (Home, Dashboard, AI, Transaction pages, auth pages).
  - `stores/` — Zustand stores (transaction store slices under `stores/transaction`).
  - `services/` — API wrapper functions for Firebase operations and callable functions.
  - `context/` — React context providers (`AuthContext.jsx`, `ThemeContext.jsx`, `LanguageContext.jsx`, `UserContext.jsx`).
  - `hooks/` — Small hooks that consume context or provide logic (e.g., `useAuth.js`, `useUser.js`, `useLanguage.js`).
  - `firebase/` — Firebase initialization and config files (`index.js`, `config.js`).
  - `utils/` — Utility helpers (date, currency, financial computations, AI transforms).
  - `assets/` — Image and static asset references.

- `functions/` — Firebase Cloud Functions (TypeScript). Contains AI callable functions and prompts.
  - `src/financial.ts` — `getFinancialReport` genkit flow using `FINANCIAL_REPORT_PROMPT`.
  - `src/chat.ts` — `chat` genkit flow with retry/backoff.
  - `src/prompt/` — Prompt templates (`advisor.ts`, `categorizer.ts`).

- `public/`, `index.html`, `vite.config.js`, `package.json`, `README.md` — standard project config and static assets.

## Purpose of important folders/files

- `src/services/`:
  - `transaction.service.js` — All Firestore queries for `transactions` collection (filters, search, add/update/delete, pagination).
  - `auth.service.js` — Firebase Auth wrappers: register/login/logout, Google sign-in, auth subscription.
  - `user.service.js` — Create/update/delete user docs in `users` collection.
  - `ai.service.js`, `chatService.js` — Call Firebase Functions for AI features.
  - `firebaseAI.service.js` — Client-side caching helpers for AI analysis (`aiAnalysis` collection helpers).

- `src/stores/transaction/`:
  - `index.js` — Root `useTransactionStore` with common state and slice composition.
  - `expense.js`, `income.js`, `dashboard.js` — Slices implementing actions and optimistic updates.
  - `utils.js` — `makeKey` and `pendingRequests` utilities used for request deduplication.

- `functions/src/`:
  - `financial.ts` — Defines `financeAnalysisFlow` and exports `getFinancialReport` callable genkit function.
  - `chat.ts` — Defines `chatFlow` with retry/backoff and exports `chat` callable function.
  - `prompt/` — Prompt template constants used by genkit flows.

- `src/context/AuthContext.jsx` — Centralizes auth behavior: registers a listener, ensures a Firestore `users` doc (`createUserIfNotExists`), and exposes `login`, `register`, `logout`, `deleteUserContext`, and `loginWithGoogle`.

Note: `src/services/index.js` currently only re-exports `transactionService`. Other service modules (auth, user, ai, chat, firebaseAI) are imported directly by consumers. Consider centralizing all service exports for consistency.

- `src/components/transaction/TransactionForm.jsx` — Shared form used by add/edit components; references translations for categories and currency.

## Important files (entry points)

- `src/main.jsx` — Application bootstrap (ReactDOM render), provider initialization.
- `src/App.jsx` — App composition with providers and `TransactionInitializer` (pre-fetches transactions on user doc availability).
- `src/routes.jsx` — Route definitions used by the app.

---

_Refer to individual files for detailed logic: [src/services/transaction.service.js](src/services/transaction.service.js), [src/stores/transaction/index.js](src/stores/transaction/index.js)._
