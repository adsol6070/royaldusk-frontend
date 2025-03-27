import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { PREFIXES, ROUTES } from "@/config/route-paths.config";
import { NotFound } from "@/pages";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path={`${PREFIXES.AUTH}/*`} element={<AuthRoutes />} />
      <Route path={`${PREFIXES.PRIVATE}/*`} element={<PrivateRoutes />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
