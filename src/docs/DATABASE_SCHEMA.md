# DATABASE_SCHEMA.md

This project uses Firestore. Below are the observed collections, fields and example objects.

## Collections

- `transactions` — primary transaction documents (income/expense)
- `users` — user profile documents
- `aiAnalysis` — cached AI analysis results

---

## `transactions` document

- Purpose: store individual income or expense entries for a user.
- Observed fields:
  - `userId` (string) — UID of Firebase Auth user.
  - `title` (string)
  - `amount` (number)
  - `type` (string) — `income` or `expense`.
  - `category` (string)
  - `source` (string) — source or payee.
  - `currency` (string)
  - `date` (Firestore Timestamp | ISO string | Date) — transaction date.
  - `month` (string) — `YYYY-MM` (optional; used for filtering).
  - `createdAt` (Firestore serverTimestamp)
  - `updatedAt` (Firestore serverTimestamp, optional)

- Example document (JSON-like):

```json
{
  "id": "abc123",
  "userId": "uid_0",
  "title": "Grocery shopping",
  "amount": 500000,
  "type": "expense",
  "category": "groceries",
  "source": "Supermarket",
  "currency": "VND",
  "date": "2026-03-14T00:00:00.000Z",
  "month": "2026-03",
  "createdAt": "<Firestore Timestamp>",
  "updatedAt": "<Firestore Timestamp>"
}
```

## `users` document

- Purpose: store user preferences and quotas
- Key fields (from `createUserIfNotExists`):
  - `name` (string)
  - `email` (string)
  - `avatar` (string URL)
  - `currency` (string) — default `usd` when created
  - `aiQuota` (object):
    - `daily` (number) — allowed daily AI calls
    - `usedToday` (number)
    - `lastReset` (Timestamp)
  - `createdAt` (serverTimestamp)
  - `userId` (string) — same as document id in most usage

- Example document:

```json
{
  "id": "uid_0",
  "name": "Alice",
  "email": "alice@example.com",
  "avatar": "https://...",
  "currency": "usd",
  "aiQuota": { "daily": 10, "usedToday": 0, "lastReset": "<Timestamp>" },
  "createdAt": "<Timestamp>",
  "userId": "uid_0"
}
```

## `aiAnalysis` document

- Purpose: cache AI analysis snapshot and result for quick reuse.
- Observed fields (from `firebaseAI.service.js` `saveAnalysis`):
  - `key` (string) — stable hash key
  - `userId` (string)
  - `type` (string) — analysis type label (e.g., `BUDGET_ANALYSIS`)
  - `month` (string | null)
  - `year` (number | null)
  - `payloadSnapshot` (object) — canonical snapshot used to generate key
  - `analysisText` (string) — plain string result
  - `result` (any) — full result object
  - `createdAt` / `updatedAt` (serverTimestamp)

- Example document:

```json
{
  "key": "a1b2c3...",
  "userId": "uid_0",
  "type": "BUDGET_ANALYSIS",
  "month": "2026-03",
  "year": 2026,
  "payloadSnapshot": { "totalIncome": 1000000, "totalExpense": 500000 },
  "analysisText": "...",
  "result": { ... },
  "createdAt": "<Timestamp>",
  "updatedAt": "<Timestamp>"
}
```

## Relationships

- One-to-many: `users` (document id = userId) → `transactions` (many docs referencing `userId`).
- `aiAnalysis` documents mapped by a stable `key` plus `userId` (single doc per key per user).

## Indexing considerations (observed queries)

- Compound queries and range filters used in `transaction.service.js` suggest these indexes (Firestore console):
  - `userId` + `createdAt` (range queries for month filtering + ordering)
  - `userId` + `title` (search using `>=` / `<=` title prefix)
  - `userId` + `type` + `createdAt`
  - `userId` + `amount` + `createdAt` (when ordering by amount and createdAt)

---

_This schema was inferred from Firestore access patterns in `src/services/_.js`and`src/stores/transaction/_`._

Notes:

- `createUserIfNotExists` sets `aiQuota.daily` default to `10` and `lastReset` to a server timestamp when creating new user docs.
- `month` is used extensively for filtering (format `YYYY-MM`) — ensure it is consistently set by client forms or mapped server-side.
