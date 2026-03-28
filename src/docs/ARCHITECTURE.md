# ARCHITECTURE.md

## Overall architecture

- Client-only SPA built with React; Firebase provides backend features (Auth, Firestore, Functions).
- Layers:
  - UI (React components in `src/components/` and `src/pages/`).
  - State layer (Zustand `useTransactionStore` under `src/stores/transaction/`).
  - Services layer (`src/services/*`) which are thin wrappers over Firebase SDK calls and callable functions.
  - Serverless flows (Cloud Functions in `functions/src/`) implementing AI features via Genkit and Google GenAI.
  - Persistence: Firestore collections (transactions, users, aiAnalysis).

## Data flow (Component → Store → Service → Database)

- Components dispatch user actions to the store:
  - Example: `AddTransaction.jsx` calls `useTransactionStore.getState().addTransaction(userId, payload)`.
- Store actions perform optimistic updates and then call service functions:
  - Example: `expense.addExpense` creates optimistic `temp-<ts>` item, calls `transactionService.addTransaction`, then replaces temp item with full object from `getTransactionById`.
- Services call Firebase SDK to execute operations against Firestore or Firebase Functions:
  - Example: `transactionService.filterTransactions` composes Firestore `query`, executes `getDocs`.
- Firestore is source-of-truth. Stores update UI state based on results.

## Authentication flow

- `AuthProvider` (`src/context/AuthContext.jsx`) subscribes to Firebase auth state via `subscribeAuth` (from `src/services/auth.service.js`).
- On auth state change when user exists, it calls `createUserIfNotExists` (`src/services/user.service.js`) to ensure a corresponding `users` document.
- `AuthProvider` exposes `login`, `register`, `logout`, `loginWithGoogle`, and `refresh` to the app via `AuthContext`.
- Components read current user from `useAuth()` hook.

Provider order and initialization details:

- At app startup `src/App.jsx` composes providers in this order: `LanguageProvider` → `AuthProvider` → `ThemeProvider` → `UserProvider`. `AuthProvider` provides auth state which `UserProvider` uses to create/refresh a Firestore `users` document.
- `App.jsx` contains `TransactionInitializer` (inside `src/App.jsx`) which listens to `userDoc` from `useUser()` and triggers initial transaction fetches (`fetchExpenses`, `fetchIncomes`, `fetchDashboardData`) when `userDoc` becomes available.

## Transaction / data flow details

- Creating a transaction:
  - UI form builds a payload with fields (title, amount, category, date, month, source, currency, type).
  - Store `addExpense`/`addIncome` does optimistic insert and calls `transactionService.addTransaction(payload)`.
  - Service writes doc to `transactions` collection with `createdAt: serverTimestamp()` and returns new doc id.
  - Store fetches full doc via `getTransactionById` to replace optimistic entry.

- Updating a transaction:
  - Store updates item locally optimistically (keeps `previousItem`), calls `transactionService.updateTransaction(id, payload)` which sets `updatedAt: serverTimestamp()`.
  - On success the store reloads the full doc; on failure it restores `previousItem`.

- Deleting a transaction:
  - Store removes from local list and calls `transactionService.deleteTransaction(id)`.
  - On failure it restores the removed item.

- Pagination & filtering:
  - Service functions use Firestore `query`, `limit`, and `startAfter` with `DocumentSnapshot` cursors.
  - Store exposes `fetchExpenses`, `fetchIncomes`, `filterExpenses`, `filterIncomes`, `searchTransactions`, and returns `{ results, nextCursor }` when relevant.

Notes on data normalization and client-side responsibilities:

- Firestore `Timestamp` fields are normalized in UI code (for example, `Dashboard.jsx` checks for `date.toDate` or `instanceof Date` before converting). Components should handle `date` fields that may be `Timestamp`, `Date`, or ISO string.
- Stores implement optimistic updates and rollbacks; services remain thin wrappers around Firestore/Functions.

## Cloud Functions / AI flow

- Frontend calls `getFinancialReport` (`src/services/ai.service.js`) and `sendChat` (`src/services/chatService.js`) which call callable functions deployed to region `asia-southeast1`.
- `functions/src/financial.ts` defines a genkit flow `financeAnalysisFlow` that receives numeric totals and a category breakdown string, renders the prompt (`prompt/advisor.ts`), invokes GenAI, and returns a string output.
- `functions/src/chat.ts` defines `chatFlow` with retry/backoff and returns generated chat text.
- Caching: `src/services/firebaseAI.service.js` implements stable key generation, `getCachedAnalysis`, and `saveAnalysis` to store / retrieve `aiAnalysis` documents in Firestore.

Suggestions / Improvements:

- Consolidate service exports: add a single `src/services/index.js` export surface for all services (currently it only re-exports `transactionService`). This simplifies imports and makes testing/mocking easier.
- Separate callable-function clients: move `ai.service.js` and `chatService.js` into `src/services/functions/` to clearly separate Firestore services from callable Function clients.
- Introduce a small domain/mapping layer (e.g., `src/domain/transaction.js`) to centralize validation and mapping between UI payloads and Firestore documents (ensures consistent shape and reduces duplication across components and stores).
- Consider adding TypeScript types or JSDoc for service and store function signatures to improve IDE support and reduce errors when adding new fields.

---

_See `src/stores/transaction/index.js` and `src/services/transaction.service.js` for canonical flow examples._
