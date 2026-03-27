export const dashboardSlice = (set, get, transactionService) => ({
  fetchDashboardData: async (userId) => {
    if (!userId) {
      set((s) => ({
        transactions: {
          ...s.transactions,
          dashboard: { current: [], prev: [] },
        },
        transactionCurrent: [],
        transactionPrev: [],
      }));
      return;
    }

    const key = `fetchDashboardData|${userId}|${get().month}`;
    const pending = get().__pendingRequests || {};
    if (pending[key]) return pending[key];

    get()._setLoading("fetchDashboard", true);

    const promise = (async () => {
      try {
        const items = await transactionService.getDashboardData(
          userId,
          get().month,
        );
        const current = items.current ?? [];
        const prev = items.prev ?? [];
        set((s) => ({
          transactions: { ...s.transactions, dashboard: { current, prev } },
          transactionCurrent: current,
          transactionPrev: prev,
        }));
        return items;
      } catch (err) {
        set({ error: err });
        throw err;
      } finally {
        get()._setLoading("fetchDashboard", false);
        if (get().__pendingRequests) delete get().__pendingRequests[key];
      }
    })();

    // ensure __pendingRequests exists on root
    set((s) => ({
      __pendingRequests: { ...(s.__pendingRequests || {}), [key]: promise },
    }));
    return promise;
  },
});
