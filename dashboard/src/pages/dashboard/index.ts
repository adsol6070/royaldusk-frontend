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

// Package Management Pages
export const PackageList = lazy(() => import("./tour-package/PackageList"));
export const PackageDetails = lazy(
  () => import("./tour-package/PackageDetails")
);
export const PackageForm = lazy(() => import("./tour-package/PackageForm"));
export const PackageCategories = lazy(
  () => import("./tour-package/packageMeta/PackageCategories")
);
export const PackageServices = lazy(
  () => import("./tour-package/packageMeta/PackageServices")
);
export const PackageFeatures = lazy(
  () => import("./tour-package/packageMeta/PackageFeatures")
);
export const PackageItenaries = lazy(
  () => import("./tour-package/packageMeta/PackageItenaries")
);
export const PackageMeta = lazy(
  () => import("./tour-package/packageMeta/PackageMetaManagement")
);
export const PackageEnquiry = lazy(() => import("./tour-package/EnquiryList"));

export const BookingList = lazy(() => import("./bookings/BookingList"));
export const BookingDetail = lazy(() => import("./bookings/BookingDetail"));
