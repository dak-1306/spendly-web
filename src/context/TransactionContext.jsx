import { useState, useCallback } from "react";
import { transactionService } from "../services";
import { TransactionContext } from "../hooks/useTransaction";
import { parseAmount } from "../utils/financial";
import { Timestamp } from "firebase/firestore";

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionCurrent, setTransactionCurrent] = useState([]);
  const [transactionPrev, setTransactionPrev] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu transaction từ Firebase kèm filter, search
  const fetchTransactions = useCallback(
    async (userId, month, { category, amountRange, sortBy, searchTerm }) => {
      console.log("fetchTransactions called with:", {
        userId,
        month,
        category,
        amountRange,
        sortBy,
        searchTerm,
      });
      if (!userId) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        if (searchTerm) {
          const items = await transactionService.searchTransactions(
            userId,
            searchTerm,
          );
          setTransactions(items);
          console.log("Search results:", items);
          setLoading(false);
          return;
        }
        if (category || amountRange || sortBy) {
          const items = await transactionService.filterTransactions(
            userId,
            category,
            amountRange,
            sortBy,
          );
          setTransactions(items);
          console.log("Filter results:", items);
          setLoading(false);
          return;
        }
        if (month) {
          const items = await transactionService.filterTransactionsByMonth(
            userId,
            month,
          );
          setTransactions(items);
          console.log("Filter by month results:", items);
          setLoading(false);
          return;
        }
        const items = await transactionService.getAllTransactions(userId);
        setTransactions(items);
        console.log("All transactions:", items);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Lấy dữ liệu cho dashboard 
  const fetchTransactionCurrent = useCallback(
    async (userId, month) => {
      console.log("fetchDashboardData called with:", {
        userId,
        month,
      });
      if (!userId) {
        setTransactionCurrent([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const items = await transactionService.getDashboardData(userId, month);
        setTransactionCurrent(items);
        console.log("Dashboard data:", items);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  // Lấy dữ liệu cho tháng trước
  const fetchTransactionPrev = useCallback(
    async (userId, month) => {
      console.log("fetchDashboardData called with:", {
        userId,
        month,
      });
      if (!userId) {
        setTransactionPrev([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const items = await transactionService.getDashboardData(userId, month);
        setTransactionPrev(items);
        console.log("Dashboard data:", items);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get transaction by ID
  const getTransactionById = async (id) => {
    try {
      return await transactionService.getTransactionById(id);
    } catch (e) {
      setError(e);
      throw e;
    }
  };
  // addTransaction nhận payload từ TransactionForm với đầy đủ các trường
  const addTransaction = async (userId, formPayload) => {
    try {
      console.log("addTransaction received payload:", formPayload);
      console.log("Current UID in addTransaction:", userId);
      const jsDate = new Date(formPayload.date);
      const payload = {
        userId: formPayload.userId || userId,
        type: formPayload.type || "expense",
        title: formPayload.title || "",
        amount: parseAmount(formPayload.amount) || 0,
        currency: formPayload.currency || "VND",
        source: formPayload.source || "",
        category: formPayload.category || "",
        date: Timestamp.fromDate(jsDate) || "",
        month: formPayload.month || "",
      };
      console.log("Constructed payload for addTransaction:", payload);

      return await transactionService.addTransaction(payload);
    } catch (e) {
      setError(e);
      throw e;
    }
  };

  const updateTransaction = async (id, payload) => {
    try {
      const parsePayload = {
        ...payload,
        amount: parseAmount(payload.amount),
      };
      console.log("updateTransaction received payload:", payload);
      console.log("Parsed payload for updateTransaction:", parsePayload);
      await transactionService.updateTransaction(id, parsePayload);
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
        transactionCurrent,
        transactionPrev,
        loading,
        error,
        fetchTransactionCurrent,
        fetchTransactionPrev,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,
        fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
