import { createContext, useContext } from "react";

export const TransactionContext = createContext(null);
export function useTransaction() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransaction must be used within a TransactionProvider");
  return ctx;
}
