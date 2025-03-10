import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
import { AuthLayout, MainLayout } from "../layout";
import { AuthProvider } from "../common/context/AuthContext";
import { PermissionProvider } from "../common/context/PermissionContext";
import { ROUTES } from "../common/constants/routes";
import {
  BlogDetails,
  BlogList,
  CreateBlog,
  Dashboard,
  EditBlog,
  Login,
  NotFound,
  Profile,
  Register,
  Settings,
  UserDetails,
  UserEdit,
  UserList,
} from "../pages";
import { Suspense } from "react";

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <PermissionProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
              </Route>

              <Route
                element={
                  // <PrivateRoute>
                  <MainLayout />
                  // </PrivateRoute>
                }
              >
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />

                <Route path={ROUTES.USER_LIST} element={<UserList />} />
                <Route path={ROUTES.USER_DETAILS()} element={<UserDetails />} />
                <Route path={ROUTES.USER_EDIT()} element={<UserEdit />} />

                <Route path={ROUTES.BLOG_LIST} element={<BlogList />} />
                <Route path={ROUTES.BLOG_DETAILS()} element={<BlogDetails />} />
                <Route path={ROUTES.CREATE_BLOG} element={<CreateBlog />} />
                <Route path={ROUTES.EDIT_BLOG()} element={<EditBlog />} />
              </Route>

              <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            </Routes>
          </Suspense>
        </PermissionProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
