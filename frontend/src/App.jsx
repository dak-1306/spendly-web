import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { UserProvider } from "./context/UserContext.jsx";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TransactionProvider>
          <AppRoutes />
        </TransactionProvider>
      </UserProvider>
    </AuthProvider>
  );
}
export default App;
