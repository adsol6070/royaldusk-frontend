import { lazy } from "react";

export const Dashboard = lazy(() => import("./Dashboard"));

// User Management Pages
export const UserList = lazy(() => import("./users/UserList"));
export const UserDetails = lazy(() => import("./users/UserDetails"));
export const UserEdit = lazy(() => import("./users/UserEdit"));

// Blog Management Pages
export const BlogList = lazy(() => import("./blogs/BlogList"));
export const BlogDetails = lazy(() => import("./blogs/BlogDetails"));
export const BlogForm = lazy(() => import("./blogs/BlogForm"));
export const BlogCategories = lazy(() => import("./blogs/BlogCategories"));

// Invoice Pages
export const InvoicePreview = lazy(() => import("./invoice/InvoicePreview"));
export const InvoiceList = lazy(() => import("./invoice/InvoiceList"));

// Tour Management Pages
export const TourList = lazy(() => import("./tours/TourList"));
export const TourDetails = lazy(() => import("./tours/TourDetails"));
export const TourForm = lazy(() => import("./tours/TourForm"));
