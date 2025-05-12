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
  useState,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface DecodedToken {
  custom_claims: {
    email: string;
    user_id: string;
  };
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo?: DecodedToken | null;
  userLogin: (
    data: LoginPayload
  ) => Promise<{ success: boolean; message?: string }>;
  userRegister: (data: RegisterPayload) => Promise<boolean>;
  logoutUser: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordPayload) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Decode token only when needed
  const getDecodedToken = (): DecodedToken | null => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const storeUser = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem("token", token);
      setToken(token);
      scheduleAutoLogout(decoded.exp);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      logoutUser();
    }
  };

  const scheduleAutoLogout = (exp: number) => {
    const currentTime = Math.floor(Date.now() / 1000); // seconds
    const timeout = (exp - currentTime) * 1000; // milliseconds

    if (timeout > 0) {
      setTimeout(() => {
        toast.error("Session expired. Logging out.");
        logoutUser();
      }, timeout);
    } else {
      logoutUser();
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.forgotPassword(email);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      return true;
    } catch (error) {
      console.error("Forgot password failed", error);
      toast.error("Failed to send password reset email.");
      return false;
    }
  };

  const resetPassword = async (
    data: ResetPasswordPayload
  ): Promise<boolean> => {
    try {
      const response = await authApi.resetPassword(data);
      if (response.success) {
        toast.success(response.message);
        return true;
      } else {
        toast.error("Password reset failed");
        return false;
      }
    } catch (error) {
      console.error("Reset password failed", error);
      toast.error("Failed to reset password.");
      return false;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);
        setToken(storedToken);
        scheduleAutoLogout(decoded.exp);
      } catch (error) {
        console.error("Invalid stored token:", error);
        logoutUser();
      }
    }
  }, []);

  const userLogin = async (
    data: LoginPayload
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.login(data);
      storeUser(response.token);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      let message = "Login failed. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error
      ) {
        const axiosError = error as any;

        if (!axiosError.response) {
          message = "Network error. Please check your internet connection.";
        } else {
          const status = axiosError.response.status;
          const errorMsg = axiosError.response.data?.message;

          if (status === 401) {
            message = "Invalid credentials. Please try again.";
          } else if (status >= 500) {
            message = "Server error. Please try again later.";
          } else {
            message = errorMsg || `Login failed with status code ${status}`;
          }
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      return { success: false, message };
    }
  };

  const userRegister = async (data: RegisterPayload) => {
    try {
      const response = await authApi.register(data);
      await userLogin({ email: data.email, password: data.password });
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const logoutUser = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!getDecodedToken(),
        userInfo: getDecodedToken(),
        userLogin,
        userRegister,
        logoutUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
