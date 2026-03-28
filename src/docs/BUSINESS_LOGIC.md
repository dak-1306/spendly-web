# BUSINESS_LOGIC.md

## Core business logic

- Domain: Personal finance tracking with monthly reporting and AI-assisted analysis.
- Core entities: `User`, `Transaction` (income/expense), `AI Analysis` cache.
- Primary operations:
  - Create / read / update / delete transactions with optimistic updates in the client store.
  - Filter and paginate transactions by userId, month, category, amount range, and search term.
  - Generate AI financial reports and chat responses via server-side GenAI flows.

## How transactions work

- Transaction payloads (client) include fields: `title`, `amount`, `type` (`income`|`expense`), `category`, `source`, `currency`, `date`, `month`, `userId`.
- Write path:
  1. Client form constructs `payload` and calls store action (e.g. `addExpense`).
  2. Store performs an optimistic insert with a temporary id (`temp-<timestamp>`).
  3. Store calls `transactionService.addTransaction(payload)` which `addDoc` to Firestore with `createdAt: serverTimestamp()`.
  4. Store fetches the persisted doc via `getTransactionById` and replaces the optimistic entry with the real document.
  5. On failure, store rolls back changes and sets `error`.

- Update path:
  - Store applies optimistic merge locally, calls `transactionService.updateTransaction(id, payload)` (which sets `updatedAt`), reloads the full doc on success or restores previous item on failure.

- Delete path:
  - Store removes item locally and calls `transactionService.deleteTransaction(id)`. On failure, the removed item is reinserted.

- Pagination & cursors:
  - Service methods return `nextCursor` (the actual Firestore `DocumentSnapshot`) for subsequent `startAfter` calls.

## How reports work

- Dashboard data:
  - `transactionService.getDashboardData(userId, month)` queries current month and previous month transactions and returns both arrays.
  - `dashboardSlice.fetchDashboardData` stores values in `transactions.dashboard.current|prev` and in `transactionCurrent`/`transactionPrev` for page-level consumption.

- Charts & metrics:
  - `src/utils/financial.js` provides helpers: `transactionToMonth`, `balance`, `totalIncome`, `totalExpense`, `prevMonth`, `formatPercent`, etc., used by `Dashboard.jsx` to compute totals and percentage changes.

## How authentication works

- `AuthProvider` subscribes to Firebase Auth state via `subscribeAuth` (from `src/services/auth.service.js`).
- On login (any provider), `AuthProvider` calls `createUserIfNotExists(user)` to create a `users` Firestore document if missing.
- `AuthContext` exposes `login`, `register`, `logout`, `loginWithGoogle`, `deleteUserContext`, and `refresh`.
- `AuthContext` stores `user` and `loading` flags and returns `{ error }` objects for failed operations.

## Important rules and business constraints

- AI quota and user metadata:
  - `users` documents include `aiQuota` structure: `{ daily, usedToday, lastReset }`. These fields are created by `createUserIfNotExists` and intended to limit AI usage (implementation of enforcement would be server-side / security rules or cloud functions).

- Empty-data handling in AI flows:
  - `financeAnalysisFlow` checks totals; if both `totalIncome` and `totalExpense` are zero it returns a friendly message and avoids calling the AI model.

- Resilience & retries:
  - `chatFlow` server-side implements retry with exponential backoff for transient model/service errors (up to 3 attempts) and returns informative strings on failure.

- Data normalization:
  - `Dashboard.jsx` normalizes `date` fields that may be Firestore `Timestamp` vs `Date` or ISO string by checking `date.toDate` or `instanceof Date` before converting.

- Pagination cursor note: store and service methods return `nextCursor` as the actual Firestore `DocumentSnapshot`. When calling fetch functions that accept `cursor`, pass the `DocumentSnapshot` (not the document id string) for correct `startAfter` behavior.

- Amount range tokens: `transaction.service.filterTransactions` maps string tokens to numeric ranges. Observed tokens: `lt100`, `100-500`, `500-1M`, `gt1M` — these are client-visible and should be kept in sync with any UI filters.

## Recommended business improvements

- Enforce AI quota server-side (Cloud Function or Firestore security rules) instead of relying solely on client-side `aiQuota` fields in `users` documents.
- Standardize `month` field population: ensure all transaction writes include `month: YYYY-MM` server-side or via a shared domain mapping to avoid inconsistent filters.
- Add Firestore security rules and sample rules documentation to enforce `userId` ownership across `transactions` and restrict access to `aiAnalysis` documents by `userId`.

- Security best practices observed:
  - Cloud function secrets are defined via `defineSecret` and not exposed on the client.
  - `firebaseAI.service.getCachedAnalysis` enforces `data.userId === userId` to avoid cross-user cache leakage.

---

_This file summarizes business rules discovered in the code. For implementation details, review the referenced source files in the repository._
