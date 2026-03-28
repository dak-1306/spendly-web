# CODING_RULES.md

## Naming conventions

- Components: PascalCase and `.jsx` extension (e.g., `AddTransaction.jsx`, `MainLayout.jsx`).
- Hooks: `useXxx` with camelCase and `.js` extension (e.g., `useAuth.js`, `useTransaction.js`).
- Services: camelCase with `.js` (e.g., `transaction.service.js`, `auth.service.js`).
- Stores: grouped by domain under `src/stores/` with `index.js` root and slice files (e.g., `src/stores/transaction/index.js`, `expense.js`).
- Firebase Cloud Functions: TypeScript files in `functions/src/` with meaningful flow names (e.g., `financial.ts`, `chat.ts`).

## Folder conventions

- Group by responsibility: `components/` by feature, `services/` for data layer, `stores/` for state, `context/` for React providers, `hooks/` for small consumers.
- Keep prompts and server logic in `functions/src/prompt/` and library flows in `functions/src/`.

## Code style

- Use modern ES modules and async/await.
- Prefer explicit `try/catch` in async boundaries and propagate errors to stores or return friendly error objects in contexts (e.g., `AuthContext` returns `{ error }`).
- Keep small pure utilities in `src/utils/` (date formatters, financial computations).

## State management rules

- Use slice functions to modularize state (`expenseSlice`, `incomeSlice`, `dashboardSlice`).
- Keep optimistic updates in stores for `add`, `update`, `delete` flows, and always implement rollback on failure.
- Track in-flight requests with `pendingRequests` and `makeKey` to deduplicate identical requests.
- Expose store actions both via hook selectors and via `useTransactionStore.getState()` for non-component call sites (e.g., initializers).

## API calling rules

- Services should be thin wrappers around Firebase SDK operations; normalise responsibilities:
  - Query composition and Firestore API usage in services.
  - Business orchestration and optimistic UI in stores.
- Use serverTimestamp for `createdAt` and `updatedAt` fields.
- For pagination, return `nextCursor` as the last `DocumentSnapshot` so callers can pass it to `startAfter`.
- For text search, use range queries (`where('title', '>=', term)` + `<= term + '\uf8ff'`) and `orderBy('title')`.

## Error handling rules

- Services throw errors to be handled by callers.
- Stores should catch service errors, set `error` state and rethrow when appropriate so the UI can react.
- Cloud Functions should log server errors and return descriptive strings rather than letting the function return undefined or raw thrown errors (pattern used in `functions/src/chat.ts` and `functions/src/financial.ts`).

## Security & data rules (observed)

- `firebaseAI.service.getCachedAnalysis` checks `data.userId === userId` before returning cached data to avoid cross-user leaks.
- Client-side code assumes security rules and server-side checks exist; avoid storing sensitive API keys client-side (cloud functions use `defineSecret`).

## Recommended improvements

- Add a central `src/services/index.js` that re-exports all services to simplify imports and enable easier mocking in tests.
- Consider migrating critical modules to TypeScript (or add JSDoc types) for stronger type safety across services and stores.
- Add unit tests for store slices (mocking `transactionService`) and integration tests for key flows (auth → user creation → transaction fetch).

---

_Follow these rules when contributing. They reflect patterns already present in the codebase._
