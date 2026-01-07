import React, { useEffect, useState } from "react";
import {
  registerWithEmail,
  loginWithEmail,
  logout as svcLogout,
  signInWithGoogle,
  subscribeAuth,
  getCurrentUser,
} from "../services/auth.service";
import { AuthContext } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const u = await loginWithEmail(email, password);
      setUser(u);
      return { user: u };
    } catch (err) {
      return { error: err?.message || err?.code || err };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const u = await registerWithEmail(name, email, password);
      setUser(u);
      return { user: u };
    } catch (err) {
      return { error: err?.message || err?.code || err };
    }
  };

  const logout = async () => {
    try {
      await svcLogout();
    } catch {
      /* ignore */
    } finally {
      setUser(null);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const u = await signInWithGoogle();
      setUser(u);
      return { user: u };
    } catch (err) {
      return { error: err?.message || err?.code || err };
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const u = getCurrentUser();
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refresh,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
