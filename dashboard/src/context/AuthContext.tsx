import { authApi, AuthResponse, LoginPayload } from "@/api";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginPayload) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  const login = async (data: LoginPayload) => {
    try {
      const response = await authApi.login(data);
      setUser(response);
    } catch (error) {}
  };

  const logoutUser = () => {};

  return (
    <AuthContext.Provider value={{ isAuthenticated: true, login, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
