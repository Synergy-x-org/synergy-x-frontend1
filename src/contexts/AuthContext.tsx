import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_USER = "synergyx_user";
const LS_TOKEN = "synergyx_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(LS_USER);
    const storedToken = localStorage.getItem(LS_TOKEN);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem(LS_USER);
        localStorage.removeItem(LS_TOKEN);
        setUser(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login: AuthContextType["login"] = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem(LS_USER, JSON.stringify(user));
    localStorage.setItem(LS_TOKEN, token);

    // optional legacy keys cleanup (avoid mismatch bugs)
    localStorage.removeItem("userEmail");
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // ✅ our current keys
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_TOKEN);

    // ✅ legacy keys you had before (prevents UI mismatch)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExpiration");
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(LS_USER, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
