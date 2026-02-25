import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { APIUser } from "../api/api-types";
import { API } from "../api/api";

interface AuthContext {
  user: APIUser | null;
  createUser: (
    username: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  createUser: async () => {},
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

interface BracketProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: BracketProviderProps) => {
  const [user, setUser] = useState<APIUser | null>(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const createUser = useCallback(
    async (username: string, password: string, displayName: string) => {
      setUser(await API.createUser({ username, password, displayName }));
    },
    []
  );

  const login = useCallback(async (username: string, password: string) => {
    setUser(await API.login({ username, password }));
  }, []);

  const logout = useCallback(async () => {
    await API.logout();
    setUser(null);
  }, []);

  API.onAuthExpired = useCallback(async () => {
    setUser(null);
  }, [logout]);

  const checkAuth = useCallback(async () => {
    setUser(await API.checkAuth());
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        createUser,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
