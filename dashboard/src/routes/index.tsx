import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
import { AuthLayout, MainLayout } from "../layout";
import { Dashboard, Home, Login, NotFound, Profile, Settings } from "../pages";
import { DetailFood, EditFood } from "../pages/food";
import { OrderDetail } from "../pages/orders";
import { AddFood, ListFood, Category } from "../pages/food";
import { OrdersList } from "../pages/orders";
import { AuthProvider } from "../common/context/AuthContext";
import {
  BarcodeList,
  CartDetail,
  MenuList,
  OrderList,
  Table,
} from "../pages/client";
import { Manager, Tenant } from "../pages/tenants";
import Permissions from "../pages/permissions";
import { PermissionProvider } from "../common/context/PermissionContext";

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <PermissionProvider>
          <Routes>
            {/* Public routes (AuthLayout) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<div>Register Page</div>} />
            </Route>

            {/* Protected routes (MainLayout) */}
            <Route
              element={
                // <PrivateRoute>
                  <MainLayout />
                // </PrivateRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/food/detail/:id" element={<DetailFood />} />
              <Route path="/food/edit/:id" element={<EditFood />} />
              <Route path="/food" element={<ListFood />} />
              <Route path="/food/create" element={<AddFood />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/orders/details/:id" element={<OrderDetail />} />
              <Route path="/tenants" element={<Tenant />} />
              <Route path="/managers" element={<Manager />} />
              <Route path="/food/createCategory" element={<Category />} />
              <Route path="/permissions" element={<Permissions />} />

              {/* Client Routes */}
              <Route path="/client/menu" element={<MenuList />} />
              <Route path="/client/orders" element={<OrderList />} />
              <Route path="/client/cart" element={<CartDetail />} />
              <Route path="/client/barcodes" element={<BarcodeList />} />
              <Route path="/client/tables" element={<Table />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PermissionProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
