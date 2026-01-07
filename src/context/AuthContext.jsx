// import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//   loadTokenFromStorage,
//   getProfile,
//   login as svcLogin,
//   logout as svcLogout,
//   register as svcRegister,
// } from "../services/auth.service";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       loadTokenFromStorage();
//       try {
//         const profile = await getProfile();
//         setUser(profile);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const login = async (credentials) => {
//     const res = await svcLogin(credentials);
//     if (res?.user) setUser(res.user);
//     return res;
//   };

//   const register = async (payload) => {
//     const res = await svcRegister(payload);
//     if (res?.user) setUser(res.user);
//     return res;
//   };

//   const logout = async () => {
//     await svcLogout().catch(() => {});
//     setUser(null);
//   };

//   const refresh = async () => {
//     setLoading(true);
//     try {
//       const profile = await getProfile();
//       setUser(profile);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, register, logout, refresh }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
