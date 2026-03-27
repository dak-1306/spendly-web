import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { transactionService } from "../../services";
import { makeKey, pendingRequests } from "./utils";
import { expenseSlice } from "./expense";
import { incomeSlice } from "./income";
import { dashboardSlice } from "./dashboard";

export const useTransactionStore = create((set, get) => {
  // root common state
  const common = {
    // canonical nested structure
    transactions: {
      expenses: { results: [], nextCursor: null },
      incomes: { results: [], nextCursor: null },
      dashboard: { current: [], prev: [] },
    },
    // backwards-compatible top-level fields
    expenses: { results: [], nextCursor: null },
    incomes: { results: [], nextCursor: null },
    transactionCurrent: [],
    transactionPrev: [],
    month: new Date().toISOString().slice(0, 7),
    loading: false,
    loadingFlags: {
      fetchExpenses: false,
      fetchIncomes: false,
      fetchDashboard: false,
      add: false,
      update: false,
      delete: false,
    },
    error: null,
    __pendingRequests: pendingRequests,

    // utils
    setMonth: (m) => set({ month: m }),
    clearError: () => set({ error: null }),
    _setLoading: (key, value) =>
      set((s) => {
        const newFlags = { ...s.loadingFlags, [key]: value };
        const any = Object.values(newFlags).some(Boolean);
        return { loadingFlags: newFlags, loading: any };
      }),

    // basic service helper
    getTransactionById: async (id) => {
      try {
        return await transactionService.getTransactionById(id);
      } catch (err) {
        set({ error: err });
        throw err;
      }
    },
  };

  // compose slices; slices will return actions (not override common root keys)
  const slices = {
    ...expenseSlice(set, get, transactionService),
    ...incomeSlice(set, get, transactionService),
    ...dashboardSlice(set, get, transactionService),
  };

  // compatibility wrappers
  const compatibility = {
    // accept either (payload) or (userId, formPayload)
    addTransaction: async (a, b) => {
      const payload = typeof a === "string" && b ? { userId: a, ...b } : a;
      const type = (payload && payload.type) || "expense";
      if (type === "income") return get().addIncome(payload);
      return get().addExpense(payload);
    },

    updateTransaction: async (id, payload) => {
      const type = payload && payload.type ? payload.type : "expense";
      if (type === "income") return get().updateIncome(id, payload);
      return get().updateExpense(id, payload);
    },

    deleteTransaction: async (id, userId, type) => {
      // if type provided, call appropriate
      if (type) {
        return type === "income"
          ? get().deleteIncome(id)
          : get().deleteExpense(id);
      }
      // try find
      const s = get();
      if ((s.transactions.expenses.results || []).some((r) => r.id === id))
        return get().deleteExpense(id);
      if ((s.transactions.incomes.results || []).some((r) => r.id === id))
        return get().deleteIncome(id);
      // fallback
      return transactionService.deleteTransaction(id);
    },

    fetchTransactionCurrent: async (userId) => {
      return get().fetchDashboardData(userId);
    },
    fetchTransactionPrev: async (userId, _month) => {
      return get().fetchDashboardData(userId);
    },
  };

  return { ...common, ...slices, ...compatibility };
});

export function useTransactionStoreSelector(selector, equalityFn = shallow) {
  return useTransactionStore(selector, equalityFn);
}

export default useTransactionStore;
