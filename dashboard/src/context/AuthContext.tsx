import { authApi, LoginPayload, RegisterPayload, ResetPasswordPayload } from "@/api";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
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
  userLogin: (data: LoginPayload) => Promise<boolean>;
  userRegister: (data: RegisterPayload) => Promise<boolean>;
  logoutUser: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordPayload) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // Function to decode JWT and store user info
  const storeUser = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem("user", JSON.stringify(decoded));
      setUser(decoded);
      scheduleAutoLogout(decoded.exp);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      logoutUser();
    }
  };

  // Schedule auto-logout based on token expiration
  const scheduleAutoLogout = (exp: number) => {
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    const timeout = (exp - currentTime) * 1000; // Convert to milliseconds

    if (timeout > 0) {
      setTimeout(() => {
        toast.error("Session expired. Logging out.");
        logoutUser();
      }, timeout);
    } else {
      logoutUser();
    }
  };

    // Forgot Password function
    const forgotPassword = async (email: string): Promise<boolean> => {
      try {
        const response = await authApi.forgotPassword(email);
        if(response.success) {
        toast.success(response.message);
        }else{
          toast.error(response.message);
        }
        return true;
      } catch (error) {
        console.error("Forgot password failed", error);
        toast.error("Failed to send password reset email.");
        return false;
      }
    };

    const resetPassword = async (data: ResetPasswordPayload): Promise<boolean> => {
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

  // Check authentication status on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: DecodedToken = JSON.parse(storedUser);
      setUser(parsedUser);
      scheduleAutoLogout(parsedUser.exp);
    }
  }, []);

  // Login function
  const userLogin = async (data: LoginPayload) => {
    try {
      const response = await authApi.login(data);
      storeUser(response.token);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  // Register function
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

  // Logout function
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, userLogin, userRegister, logoutUser, forgotPassword, resetPassword }}>
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