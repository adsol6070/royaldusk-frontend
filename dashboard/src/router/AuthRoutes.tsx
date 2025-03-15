import { Routes, Route } from "react-router-dom";
import { AuthLayout } from "../layout";
import { AUTH_ROUTES } from "./routesConfig";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {AUTH_ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
