import {
  authApi,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { userApi } from "@/api/user/userApi";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordPayload) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const startAutoLogout = (token: string) => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expiresInMs = decoded.exp * 1000 - Date.now();

      if (logoutTimer) clearTimeout(logoutTimer);

      logoutTimer = setTimeout(() => {
        logout();
        toast.error("Session expired. Please log in again.");
      }, expiresInMs - 5 * 1000); // 5 seconds buffer
    } catch {
      logout();
    }
  };

  const checkLoggedIn = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      logout(false);
      setIsAuthLoading(false);
      return;
    }

    try {
      await userApi.me();
      setIsAuthenticated(true);
      startAutoLogout(token);
    } catch {
      logout(false);
      toast.error("Session expired. Please log in again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      const response = await authApi.register(data);
      if (response.status) {
        toast.success(response.message);
      }
    } catch {
      toast.error("Registration failed");
    }
  };

  const login = async (data: LoginPayload) => {
    try {
      const response = await authApi.login(data);
      if (response.status === "success") {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        await checkLoggedIn();
        toast.success("Login successful");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    if (logoutTimer) clearTimeout(logoutTimer);
    if (showToast) toast.success("Logged out");
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.forgotPassword(email);
      response.success
        ? toast.success(response.message)
        : toast.error(response.message);
      return response.success;
    } catch {
      toast.error("Failed to send password reset email.");
      return false;
    }
  };

  const resetPassword = async (
    data: ResetPasswordPayload
  ): Promise<boolean> => {
    try {
      const response = await authApi.resetPassword(data);
      response.success
        ? toast.success(response.message)
        : toast.error("Password reset failed");
      return response.success;
    } catch {
      toast.error("Failed to reset password.");
      return false;
    }
  };

  useEffect(() => {
    checkLoggedIn(); // Auto-check on mount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
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
