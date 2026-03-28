# STATE_MANAGEMENT.md

## Overview

- Primary store: `useTransactionStore` defined in `src/stores/transaction/index.js` using Zustand.
- Store composed from slices: `expenseSlice`, `incomeSlice`, `dashboardSlice` (files under `src/stores/transaction/`).
- Utilities: `makeKey` and `pendingRequests` in `src/stores/transaction/utils.js` used for request deduplication.

## Root state fields (in `useTransactionStore` common)

- `transactions`
  - `expenses`: { results: Array, nextCursor: DocumentSnapshot|null }
  - `incomes`: { results: Array, nextCursor: DocumentSnapshot|null }
  - `dashboard`: { current: Array, prev: Array }
- `expenses`: top-level mirror of `transactions.expenses`
- `incomes`: top-level mirror of `transactions.incomes`
- `transactionCurrent`: Array (dashboard current slice)
- `transactionPrev`: Array (dashboard previous slice)
- `month`: string (YYYY-MM) — default `new Date().toISOString().slice(0,7)`
- `loading`: boolean (derived)
- `loadingFlags`: object with booleans: `fetchExpenses`, `fetchIncomes`, `fetchDashboard`, `add`, `update`, `delete`
- `error`: any (last error)
- `__pendingRequests`: internal object tracking pending promises

## Root actions / helpers

- `setMonth(m)` — set month string
- `clearError()` — clear `error`
- `_setLoading(key, value)` — internal helper to set loading flag and aggregated `loading`
- `getTransactionById(id)` — wrapper calling `transactionService.getTransactionById` with error handling

## Slice actions (list of key actions)

- Expense slice (`expense.js`):
  - `fetchExpenses(userId, options, pageOptions)`
  - `addExpense(payload)` — optimistic creation, replaces temp id on success
  - `updateExpense(id, payload)` — optimistic update with rollback
  - `deleteExpense(id)` — optimistic delete with rollback
  - `filterExpenses(userId, category, amountRange, sortBy, pageOptions)`

- Income slice (`income.js`):
  - `fetchIncomes(userId, pageOptions)`
  - `addIncome(payload)`
  - `updateIncome(id, payload)`
  - `deleteIncome(id)`
  - `filterIncomes(userId, category, amountRange, sortBy, pageOptions)`

- Dashboard slice (`dashboard.js`):
  - `fetchDashboardData(userId)` — fetches `current` and `prev` month arrays from `transactionService.getDashboardData`

- Compatibility wrappers in `index.js`:
  - `addTransaction(a, b)` — accepts either `(payload)` or `(userId, formPayload)` and routes to income/expense accordingly.
  - `updateTransaction(id, payload)` — routes to income or expense update based on `payload.type`.
  - `deleteTransaction(id, userId, type)` — attempts type-based deletion or falls back to service deletion.
  - `fetchTransactionCurrent(userId)` and `fetchTransactionPrev(userId)` wrappers for dashboard compatibility.

## Which components use which store (examples)

- `src/App.jsx` — `TransactionInitializer` calls `fetchExpenses`, `fetchIncomes`, `fetchDashboardData` via `useTransactionStore.getState()`.
- `src/components/transaction/AddTransaction.jsx` — calls `useTransactionStore.getState().addTransaction(...)`.
- `src/components/transaction/EditTransaction.jsx` — calls `useTransactionStore.getState().updateTransaction(...)`.
- `src/components/transaction/DeleteTransaction.jsx` — calls `useTransactionStore.getState().deleteTransaction(...)`.
- `src/pages/Dashboard.jsx` — selects `loading`, `month`, `transactionCurrent`, `transactionPrev`, calls `fetchTransactionCurrent` / `fetchTransactionPrev` in effects.
- `src/pages/AI.jsx` — reads `transactionCurrent`, `month`, and uses `setMonth`.

(There are additional usages across transaction lists and detail pages — search for `useTransactionStore` imports to enumerate all components.)

## Patterns & best practices used

- Slice composition: small slice files export functions that are merged in `index.js` to build the store.
- Optimistic UI: `add`, `update`, `delete` implement optimistic mutations with rollback on failure.
- Loading flags: `loadingFlags` for fine-grained UI state and aggregated `loading` boolean.
- Request deduplication: `makeKey` + `pendingRequests` used to avoid duplicate concurrent calls.
- Cursor-based pagination: Stores and services return `nextCursor` (Firestore DocumentSnapshot) to enable incremental fetches.
- Keep actions accessible both via hook selectors and direct `useTransactionStore.getState()` for non-component call sites.

---

_See `src/stores/transaction/index.js`, `src/stores/transaction/expense.js`, `src/stores/transaction/income.js`, `src/stores/transaction/dashboard.js` for implementation details._
