import { useState, useCallback } from "react";
import { transactionService } from "../services";
import { TransactionContext } from "../hooks/useTransaction";
import { parseAmount } from "../utils/financial";
import { Timestamp } from "firebase/firestore";

export const TransactionProvider = ({ children }) => {
  const [month, setMonth] = useState(
    (() => {
      const d = new Date();
      return d.toISOString().slice(0, 7);
    })(),
  );
  const [incomes, setIncomes] = useState({
    results: [],
    nextCursor: null,
  });
  const [expenses, setExpenses] = useState({
    results: [],
    nextCursor: null,
  });

  const [transactionCurrent, setTransactionCurrent] = useState([]);
  const [transactionPrev, setTransactionPrev] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy expenses của user, phân trang, sort theo ngày tạo mới nhất, có filter, search
  const GetExpense = useCallback(
    async (
      userId,

      { category, amountRange, sortBy, searchTerm },
      { limit: pageLimit = 5, cursor: cursorValue } = {},
    ) => {
      if (!userId) {
        setExpenses({ results: [], nextCursor: null });
        setLoading(false);
        return { results: [], nextCursor: null };
      }
      setLoading(true);
      try {
        let items;
        if (searchTerm) {
          items = await transactionService.searchTransactions(
            userId,
            searchTerm,
            { limit: pageLimit, cursor: cursorValue },
          );
        } else if (category || amountRange || sortBy) {
          items = await transactionService.filterTransactions(
            userId,
            "expense",
            category,
            amountRange,
            sortBy,
            month,
            { limit: pageLimit, cursor: cursorValue },
          );
        } else {
          items = await transactionService.filterTransactionsByMonth(
            userId,
            month,
            "expense",
            {
              limit: pageLimit,
              cursor: cursorValue,
            },
          );
        }
        const results = items.results ?? [];
        const nextCursor = items.nextCursor ?? null;
        setExpenses({ results, nextCursor });
        setLoading(false);
        return { results, nextCursor };
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    },
    [month],
  );

  const GetIncome = useCallback(
    async (userId, { limit: pageLimit = 5, cursor: cursorValue } = {}) => {
      if (!userId) {
        setIncomes({ results: [], nextCursor: null });
        setLoading(false);
        return { results: [], nextCursor: null };
      }
      setLoading(true);
      try {
        const items = await transactionService.filterTransactionsByMonth(
          userId,
          month,
          "income",
          {
            limit: pageLimit,
            cursor: cursorValue,
          },
        );
        const results = items.results ?? [];
        const nextCursor = items.nextCursor ?? null;
        setIncomes({ results, nextCursor });
        setLoading(false);
        return { results, nextCursor };
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    },
    [month],
  );

  // Lấy dữ liệu cho dashboard
  const fetchTransactionCurrent = useCallback(
    async (userId) => {
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
    [month],
  );
  // Lấy dữ liệu cho tháng trước
  const fetchTransactionPrev = useCallback(
    async (userId) => {
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
    [month],
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
        incomes,
        expenses,
        transactionCurrent,
        transactionPrev,
        loading,
        error,
        month,
        setMonth,
        fetchTransactionCurrent,
        fetchTransactionPrev,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,
        GetExpense,
        GetIncome,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
