import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider} from "./context/LanguageContext.jsx";
import { TransactionProvider } from "./context/TransactionContext";
import { UserProvider } from "./context/UserContext.jsx";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <TransactionProvider>
              <AppRoutes />
            </TransactionProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
export default App;
