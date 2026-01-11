import { createContext, useContext } from "react";

export const UserContext = createContext({
  userDoc: null,
  loading: true,
  refresh: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export default useUser;
