import { makeKey, pendingRequests } from "./utils";

export const expenseSlice = (set, get, transactionService) => ({
  // Actions for expenses
  fetchExpenses: async (userId, options = {}, pageOptions = {}) => {
    if (!userId) {
      set((s) => ({
        transactions: {
          ...s.transactions,
          expenses: { results: [], nextCursor: null },
        },
        expenses: { results: [], nextCursor: null },
      }));
      return { results: [], nextCursor: null };
    }

    const key = makeKey("fetchExpenses", { userId, options, pageOptions });
    if (pendingRequests[key]) return pendingRequests[key];

    get()._setLoading("fetchExpenses", true);

    const promise = (async () => {
      try {
        let items;
        const { searchTerm, category, amountRange, sortBy } = options;
        if (searchTerm) {
          items = await transactionService.searchTransactions(
            userId,
            searchTerm,
            pageOptions,
          );
        } else if (category || amountRange || sortBy) {
          items = await transactionService.filterTransactions(
            userId,
            "expense",
            category,
            amountRange,
            sortBy,
            get().month,
            pageOptions,
          );
        } else {
          items = await transactionService.filterTransactionsByMonth(
            userId,
            get().month,
            "expense",
            pageOptions,
          );
        }

        const results = items.results ?? [];
        const nextCursor = items.nextCursor ?? null;
        set((s) => ({
          transactions: {
            ...s.transactions,
            expenses: { results, nextCursor },
          },
          expenses: { results, nextCursor },
        }));
        return { results, nextCursor };
      } catch (err) {
        set({ error: err });
        throw err;
      } finally {
        get()._setLoading("fetchExpenses", false);
        delete pendingRequests[key];
      }
    })();

    pendingRequests[key] = promise;
    return promise;
  },

  addExpense: async (payload) => {
    get()._setLoading("add", true);
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = { id: tempId, ...payload };

    set((s) => {
      const prev = s.transactions.expenses;
      const newResults = [optimisticItem, ...(prev.results || [])];
      const updatedTransactions = {
        ...s.transactions,
        expenses: { results: newResults, nextCursor: prev.nextCursor },
      };
      return {
        transactions: updatedTransactions,
        expenses: { results: newResults, nextCursor: prev.nextCursor },
      };
    });

    try {
      const newId = await transactionService.addTransaction(payload);
      const full = await transactionService.getTransactionById(newId);
      set((s) => {
        const prev = s.transactions.expenses;
        const results = prev.results.map((r) => (r.id === tempId ? full : r));
        const updatedTransactions = {
          ...s.transactions,
          expenses: { results, nextCursor: prev.nextCursor },
        };
        return {
          transactions: updatedTransactions,
          expenses: { results, nextCursor: prev.nextCursor },
        };
      });
      return newId;
    } catch (err) {
      set((s) => {
        const prev = s.transactions.expenses;
        const results = prev.results.filter((r) => r.id !== tempId);
        const updatedTransactions = {
          ...s.transactions,
          expenses: { results, nextCursor: prev.nextCursor },
        };
        return {
          transactions: updatedTransactions,
          expenses: { results, nextCursor: prev.nextCursor },
          error: err,
        };
      });
      throw err;
    } finally {
      get()._setLoading("add", false);
    }
  },

  updateExpense: async (id, payload) => {
    get()._setLoading("update", true);
    let previousItem = null;
    set((s) => {
      const prev = s.transactions.expenses;
      const results = prev.results.map((r) => {
        if (r.id === id) {
          previousItem = r;
          return { ...r, ...payload };
        }
        return r;
      });
      const updatedTransactions = {
        ...s.transactions,
        expenses: { results, nextCursor: prev.nextCursor },
      };
      return {
        transactions: updatedTransactions,
        expenses: { results, nextCursor: prev.nextCursor },
      };
    });

    try {
      await transactionService.updateTransaction(id, payload);
      const full = await transactionService.getTransactionById(id);
      set((s) => {
        const prev = s.transactions.expenses;
        const results = prev.results.map((r) => (r.id === id ? full : r));
        const updatedTransactions = {
          ...s.transactions,
          expenses: { results, nextCursor: prev.nextCursor },
        };
        return {
          transactions: updatedTransactions,
          expenses: { results, nextCursor: prev.nextCursor },
        };
      });
    } catch (err) {
      set((s) => {
        const prev = s.transactions.expenses;
        const results = prev.results.map((r) =>
          r.id === id ? previousItem : r,
        );
        const updatedTransactions = {
          ...s.transactions,
          expenses: { results, nextCursor: prev.nextCursor },
        };
        return {
          transactions: updatedTransactions,
          expenses: { results, nextCursor: prev.nextCursor },
          error: err,
        };
      });
      throw err;
    } finally {
      get()._setLoading("update", false);
    }
  },

  deleteExpense: async (id) => {
    get()._setLoading("delete", true);
    let removed = null;
    set((s) => {
      const prev = s.transactions.expenses;
      const results = prev.results.filter((r) => {
        if (r.id === id) {
          removed = r;
          return false;
        }
        return true;
      });
      const updatedTransactions = {
        ...s.transactions,
        expenses: { results, nextCursor: prev.nextCursor },
      };
      return {
        transactions: updatedTransactions,
        expenses: { results, nextCursor: prev.nextCursor },
      };
    });

    try {
      await transactionService.deleteTransaction(id);
      return true;
    } catch (err) {
      if (removed) {
        set((s) => {
          const prev = s.transactions.expenses;
          const results = [removed, ...(prev.results || [])];
          const updatedTransactions = {
            ...s.transactions,
            expenses: { results, nextCursor: prev.nextCursor },
          };
          return {
            transactions: updatedTransactions,
            expenses: { results, nextCursor: prev.nextCursor },
            error: err,
          };
        });
      } else {
        set({ error: err });
      }
      throw err;
    } finally {
      get()._setLoading("delete", false);
    }
  },

  filterExpenses: async (
    userId,
    category,
    amountRange,
    sortBy,
    pageOptions = {},
  ) => {
    try {
      const items = await transactionService.filterTransactions(
        userId,
        "expense",
        category,
        amountRange,
        sortBy,
        get().month,
        pageOptions,
      );
      const results = items.results ?? [];
      const nextCursor = items.nextCursor ?? null;
      set((s) => ({
        transactions: { ...s.transactions, expenses: { results, nextCursor } },
        expenses: { results, nextCursor },
      }));
      return items;
    } catch (err) {
      set({ error: err });
      throw err;
    }
  },
});
