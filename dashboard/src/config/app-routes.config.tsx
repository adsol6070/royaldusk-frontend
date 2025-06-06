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
  TourList,
  TourForm,
  TourDetails,
  ForgotPassword,
  ResetPassword,
  InvoicePreview,
  InvoiceList,
  PackageList,
  PackageDetails,
  PackageForm,
  PackageMeta,
  PackageEnquiry,
  ResendVerification,
  VerifyEmail,
  BookingList,
  BookingDetail,
} from "@/pages";

export const AUTH_ROUTES = [
  { path: ROUTE_PATHS.LOGIN, element: <Login /> },
  { path: ROUTE_PATHS.REGISTER, element: <Register /> },
  { path: ROUTE_PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTE_PATHS.RESET_PASSWORD, element: <ResetPassword /> },
  { path: ROUTE_PATHS.RESEND_VERIFICATION, element: <ResendVerification /> },
  { path: ROUTE_PATHS.VERIFY_EMAIL, element: <VerifyEmail /> },
];

export const PRIVATE_ROUTES = [
  { path: ROUTE_PATHS.HOME, element: <Dashboard /> },
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

  { path: ROUTE_PATHS.INVOICE_LIST, element: <InvoiceList /> },
  { path: ROUTE_PATHS.INVOICE_PREVIEW(), element: <InvoicePreview /> },

  { path: ROUTE_PATHS.TOUR_LIST, element: <TourList /> },
  { path: ROUTE_PATHS.TOUR_DETAILS(), element: <TourDetails /> },
  { path: ROUTE_PATHS.CREATE_TOUR, element: <TourForm /> },
  { path: ROUTE_PATHS.EDIT_TOUR(), element: <TourForm /> },

  { path: ROUTE_PATHS.PACKAGE_LIST, element: <PackageList /> },
  { path: ROUTE_PATHS.PACKAGE_DETAILS(), element: <PackageDetails /> },
  { path: ROUTE_PATHS.CREATE_PACKAGE, element: <PackageForm /> },
  { path: ROUTE_PATHS.EDIT_PACKAGE(), element: <PackageForm /> },
  { path: ROUTE_PATHS.PACKAGE_META, element: <PackageMeta /> },
  { path: ROUTE_PATHS.PACKAGE_ENQUIRY, element: <PackageEnquiry /> },

  { path: ROUTE_PATHS.BOOKING_LIST, element: <BookingList /> },
  { path: ROUTE_PATHS.BOOKING_DETAILS(), element: <BookingDetail /> },
];
