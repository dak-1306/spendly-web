import React, { useState, useEffect } from "react";
import { UserContext } from "../hooks/useUser";
import { subscribeAuth } from "../services/auth.service";
import { createUserIfNotExists } from "../services/user.service";

export function UserProvider({ children }) {
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth(async (authUser) => {
      console.debug("subscribeAuth -> authUser:", authUser);
      setLoading(true);
      if (authUser) {
        try {
          const doc = await createUserIfNotExists(authUser);
          console.debug("createUserIfNotExists returned:", doc);
          setUserDoc(doc);
        } catch (err) {
          console.error("UserProvider createUserIfNotExists failed:", err);
          setUserDoc(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUserDoc(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const authUser = (
        await import("../services/auth.service")
      ).getCurrentUser();
      if (authUser) {
        const doc = await createUserIfNotExists(authUser);
        setUserDoc(doc);
      } else {
        setUserDoc(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userDoc, loading, refresh }}>
      {children}
    </UserContext.Provider>
  );
}
