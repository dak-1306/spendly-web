# API_STRUCTURE.md

## Service files (client-side)

- `src/services/transaction.service.js` — Firestore queries for `transactions` collection.
- `src/services/auth.service.js` — Firebase Auth wrapper functions.
- `src/services/user.service.js` — `users` collection helpers.
- `src/services/ai.service.js` — Callable function wrapper for financial report (`getFinancialReport`).
- `src/services/chatService.js` — Callable function wrapper for `chat` function.
- `src/services/firebaseAI.service.js` — Helpers to compute stable cache key and manage `aiAnalysis` documents.

Note: only `transactionService` is re-exported from `src/services/index.js` as a named default export (`export { default as transactionService } from './transaction.service'`). Other service modules are imported directly where used (they are not all aggregated in `src/services/index.js`).

## Functions and signatures (summary)

- transaction.service (default export object)
  - `getDashboardData(userId: string, month: string) => { current: Array, prev: Array }`
  - `getAllTransactions(userId: string, { limit, cursor }?) => { results: Array, nextCursor }`
  - `getTransactionById(id: string) => object | null`
  - `addTransaction(data: object) => newDocId (string)`
  - `updateTransaction(id: string, data: object) => void` (sets `updatedAt` serverTimestamp)
  - `deleteTransaction(id: string) => void`
  - `filterTransactionsByMonth(userId: string, month: string, type: string, { limit, cursor }?) => { results, nextCursor }`
  - `searchTransactions(userId: string, searchTerm: string, month?: string, { limit, cursor }?) => { results, nextCursor }`
  - `filterTransactions(userId, type, category, amountRange, sortBy, month, { limit, cursor }?) => { results, nextCursor }`

- auth.service (named exports)
  Note: `src/services/auth.service.js` exposes the functions as named exports (e.g., `registerWithEmail`) and also exports a default object containing the same functions.
  - `registerWithEmail(name: string, email: string, password: string) => firebase.User`
  - `loginWithEmail(email: string, password: string) => firebase.User`
  - `logout() => void`
  - `deleteUserService() => void`
  - `signInWithGoogle() => firebase.User`
  - `subscribeAuth(callback) => unsubscribe()` — `callback` receives `User|null`.
  - `getCurrentUser() => auth.currentUser | null`

- user.service (named exports)
  Note: `src/services/user.service.js` also exports a default object containing the same named functions.
  - `createUserIfNotExists(user: firebase.User, options = {}) => { id, ...data }`
  - `updateUser(uid: string, data: object) => void`
  - `deleteUserDocService(uid: string) => void`

- ai.service
  - `getFinancialReport(payload: object) => Promise<any>` (named export; calls callable `getFinancialReport`)

- chatService
  - `sendChat(message: string) => Promise<string>` (calls callable `chat`)

- firebaseAI.service
  - `generateKey(payload: object) => { key, snapshotStr, snapshot }` (stable SHA256 key)
  - `getCachedAnalysis(key: string, userId: string) => doc | null`
  - `saveAnalysis(key: string, userId: string, snapshot, result) => void`

## Input / output details & shapes (observed from code)

- Transaction object (returned by `getTransactionById` and query methods):
  - Fields typically include: `id`, `userId`, `title`, `amount`, `type` (`income`|`expense`), `category`, `source`, `currency`, `date`, `month`, `createdAt`, `updatedAt`.
  - Some date fields may be Firestore Timestamps; components normalize with `.toDate()` when needed.

- `getDashboardData(userId, month)` => returns `{ current: Array<transaction>, prev: Array<transaction> }` representing transactions in the given month and previous month.

- `filterTransactions` supports the following inputs:
  - `type` string: `income` or `expense`.
  - `category` string.
  - `amountRange`: string token (e.g., `lt100`, `100-500`, `500-1M`, `gt1M`) or `[min,max]` array.
  - `sortBy`: `newest` or other, affects `orderBy` usage.
  - `month`: `YYYY-MM` string.

## Error handling pattern

- Services generally throw Firebase errors directly; callers (stores) catch and set `error` in the store state.
- `auth.service` and `user.service` wrap some operations in try/catch at higher layers (e.g., `AuthContext` returns `{ error }` shaped responses).
- Cloud Functions (server-side) return friendly strings on caught errors rather than throwing (to avoid 500 responses), and log errors for diagnostics (`functions/src/financial.ts`, `functions/src/chat.ts`).
- Stores typically `set({ error: err })` on service call failures and rethrow the error for UI code to handle.

## Usage examples

- Call financial report from client:

```js
import { getFinancialReport } from "./services/ai.service";
const report = await getFinancialReport({
  totalIncome: 1000000,
  totalExpense: 500000,
  categoryBreakdown: "Food: 500000; Rent: 300000",
});
```

- Add transaction via store:

```js
useTransactionStore.getState().addTransaction(userId, {
  title: "Coffee",
  amount: 30000,
  type: "expense",
  category: "food",
});
```

---

_See source files for exact behavior: [src/services/transaction.service.js](src/services/transaction.service.js), [src/stores/transaction/expense.js](src/stores/transaction/expense.js)._
