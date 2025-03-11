import { lazy } from "react";

export const Dashboard = lazy(() => import("./Dashboard"));

// User Management Pages
export const UserList = lazy(() => import("./users/UserList"));
export const UserDetails = lazy(() => import("./users/UserDetails"));
export const UserEdit = lazy(() => import("./users/UserEdit"));

// Blog Management Pages
export const BlogList = lazy(() => import("./blogs/BlogList"));
export const BlogDetails = lazy(() => import("./blogs/BlogDetails"));
export const CreateBlog = lazy(() => import("./blogs/CreateBlog"));
export const EditBlog = lazy(() => import("./blogs/EditBlog"));
