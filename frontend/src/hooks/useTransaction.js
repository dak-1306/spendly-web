import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContextValue";

export default function useTransaction() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransaction must be used within a TransactionProvider");
  return ctx;
}
