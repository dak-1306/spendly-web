import React, { useState, useEffect } from "react";
import { TransactionContext } from "./TransactionContextValue";
import { transactionService } from "../services";
import { useAuth } from "../hooks/useAuth";
import { Timestamp } from "firebase/firestore";

export const TransactionProvider = ({ children }) => {
  const auth = useAuth?.();
  const currentUid = auth?.user?.uid ?? auth?.uid ?? null;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("TransactionContext: currentUid =", currentUid);

    if (!currentUid) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = transactionService.subscribeTransactions(
      currentUid,
      (items) => {
        setTransactions(items);
        setLoading(false);
      },
      (err) => {
        console.error("Subscribe error:", err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub && unsub();
  }, [currentUid]);

  // addTransaction nhận payload từ TransactionForm với đầy đủ các trường
  const addTransaction = async (formPayload) => {
    try {
      const jsDate = new Date(formPayload.date);
      const payload = {
        userId: formPayload.userId || currentUid,
        type: formPayload.type,
        title: formPayload.title,
        amount: Number(formPayload.amount),
        currency: formPayload.currency,
        source: formPayload.source,
        category: formPayload.category,
        date: Timestamp.fromDate(jsDate),
        month: formPayload.month,
      };

      return await transactionService.addTransaction(payload);
    } catch (e) {
      setError(e);
      throw e;
    }
  };

  const updateTransaction = async (id, payload) => {
    try {
      await transactionService.updateTransaction(id, payload);
    } catch (e) {
      setError(e);
      throw e;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
    } catch (e) {
      setError(e);
      throw e;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
