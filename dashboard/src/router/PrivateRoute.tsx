import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { ROUTES } from "@/config/route-paths.config";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={ROUTES.AUTH.LOGIN} replace />
  );
};

export default PrivateRoute;
