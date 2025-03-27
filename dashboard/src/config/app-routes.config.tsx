import { ROUTE_PATHS } from "@/config/route-paths.config";
import {
  BlogCategories,
  BlogDetails,
  BlogList,
  BlogForm,
  Dashboard,
  Login,
  Profile,
  Register,
  Settings,
  UserDetails,
  UserEdit,
  UserList,
} from "@/pages";

export const AUTH_ROUTES = [
  { path: ROUTE_PATHS.LOGIN, element: <Login /> },
  { path: ROUTE_PATHS.REGISTER, element: <Register /> },
];

export const PRIVATE_ROUTES = [
  { path: ROUTE_PATHS.DASHBOARD, element: <Dashboard /> },
  { path: ROUTE_PATHS.PROFILE, element: <Profile /> },
  { path: ROUTE_PATHS.SETTINGS, element: <Settings /> },

  { path: ROUTE_PATHS.USER_LIST, element: <UserList /> },
  { path: ROUTE_PATHS.USER_DETAILS(), element: <UserDetails /> },
  { path: ROUTE_PATHS.USER_EDIT(), element: <UserEdit /> },

  { path: ROUTE_PATHS.BLOG_LIST, element: <BlogList /> },
  { path: ROUTE_PATHS.BLOG_DETAILS(), element: <BlogDetails /> },
  { path: ROUTE_PATHS.CREATE_BLOG, element: <BlogForm /> },
  { path: ROUTE_PATHS.EDIT_BLOG(), element: <BlogForm /> },
  { path: ROUTE_PATHS.BLOG_CATEGORIES, element: <BlogCategories /> },
];
