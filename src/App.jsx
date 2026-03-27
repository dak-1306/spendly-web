import { useEffect } from "react";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { UserProvider } from "./context/UserContext";
import { useUser as useUserHook } from "./hooks/useUser";
import { useTransactionStore } from "./stores/transaction";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <TransactionInitializer />
            <AppRoutes />
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
export default App;

function TransactionInitializer() {
  // useUser hook returns { userDoc, loading, refresh }
  const { userDoc } = useUserHook();

  useEffect(() => {
    if (!userDoc?.uid && !userDoc?.id) return;
    const uid = userDoc.uid ?? userDoc.id;
    const { fetchExpenses, fetchIncomes, fetchDashboardData } =
      useTransactionStore.getState();
    fetchExpenses(uid).catch(() => {});
    fetchIncomes(uid).catch(() => {});
    fetchDashboardData(uid).catch(() => {});
  }, [userDoc?.uid, userDoc?.id]);

  return null;
}
