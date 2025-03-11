import { Navigate } from "react-router-dom";
import { useAuthContext } from "../common/context/AuthContext";
import { ReactNode } from "react";
import { ROUTES } from "../common/constants/routes";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
