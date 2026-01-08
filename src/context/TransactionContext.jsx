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
    const unsub = transactionService.subscribeTransactions(
      (items) => {
        setTransactions(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub && unsub();
  }, []);

  // addTransaction nhận payload thuần từ TransactionForm và chuyển thành payload cho Firestore
  const addTransaction = async (formPayload) => {
    try {
      // formPayload.date là string 'YYYY-MM-DD' (hoặc ISO); chuyển sang Date
      const jsDate = new Date(formPayload.date);
      const payload = {
        userId: formPayload.userId || currentUid || null,
        type: formPayload.type,
        title: formPayload.title,
        amount: Number(formPayload.amount),
        currency: formPayload.currency || "VND",
        date: Timestamp.fromDate(jsDate),
        month: jsDate.toISOString().slice(0, 7),
      };

      if (formPayload.type === "income") payload.source = formPayload.source;
      else payload.category = formPayload.category;

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
