import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";

type Role = "seeker" | "professional";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = storage.get("user");
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = (data: Partial<User>) => {
    const fakeUser: User = {
      id: "1",
      name: data.name || "Demo User",
      email: data.email || "demo@niamind.com",
      role: data.role || "seeker",
    };

    storage.set("user", fakeUser);
    storage.set("token", "fake-token");

    setUser(fakeUser);
  };

  const logout = () => {
    storage.remove("user");
    storage.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};