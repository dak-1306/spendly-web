import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { TransactionProvider } from "./context/TransactionContext";
import { UserProvider } from "./context/UserContext.jsx";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <TransactionProvider>
            <AppRoutes />
          </TransactionProvider>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
export default App;
