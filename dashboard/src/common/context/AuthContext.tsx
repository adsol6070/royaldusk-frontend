import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "..";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextProps {
  user: any;
  authToken: string | null;
  loginUser: (data: { email: string; password: string }) => Promise<void>;
  logoutUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(() =>
    localStorage.getItem("authToken")
      ? jwtDecode(localStorage.getItem("authToken") as string)
      : null
  );

  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("authToken") ? localStorage.getItem("authToken") : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const extractTokenFromURL = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setUser(jwtDecode(token));

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  useEffect(() => {
    if (!authToken) {
      extractTokenFromURL();
    }
    setLoading(false);
  }, [location]);

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await authApi.login({ email, password });

    if (
      response.status === 200 &&
      response.statusText === "OK" &&
      response.data
    ) {
      const { access } = response.data;
      localStorage.setItem("authToken", access);
      setAuthToken(access);
      setUser(jwtDecode(access));
      navigate("/");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
    navigate("/login");
  };

  const contextData = {
    user,
    authToken,
    loginUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
