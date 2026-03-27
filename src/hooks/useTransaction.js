import {
  useTransactionStore,
  useTransactionStoreSelector,
} from "../stores/transaction";

// Compatibility wrapper: keep previous `useTransaction` hook name but
// delegate to the zustand store selector. Components can continue using
// `useTransaction(selector)` or import `useTransactionStore` directly.
export function useTransaction(selector = (s) => s, equalityFn) {
  return useTransactionStore(selector, equalityFn);
}

export { useTransactionStore, useTransactionStoreSelector };

export default useTransaction;
