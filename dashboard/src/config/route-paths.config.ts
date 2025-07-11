const PREFIXES = {
  PRIVATE: "/app",
  AUTH: "/auth",
};

const ROUTE_PATHS = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgotpassword",
  RESET_PASSWORD: "/resetpassword/:token",
  RESEND_VERIFICATION: "/resendverification",
  VERIFY_EMAIL: "/verifyemail/:token",
  NOT_FOUND: "*",

  USER_LIST: "/dashboard/users/list",
  USER_DETAILS: (userId = ":userId") => `/dashboard/users/details/${userId}`,
  USER_EDIT: (userId = ":userId") => `/dashboard/users/edit/${userId}`,

  BLOG_LIST: "/dashboard/blogs/list",
  BLOG_DETAILS: (blogId = ":id") => `/dashboard/blogs/details/${blogId}`,
  CREATE_BLOG: "/dashboard/blogs/create",
  EDIT_BLOG: (blogId = ":id") => `/dashboard/blogs/edit/${blogId}`,
  BLOG_CATEGORIES: `/dashboard/blogs/categories`,

  INVOICE_LIST: "/dashboard/invoice/list",
  INVOICE_PREVIEW: (invoiceId = ":id") =>
    `/dashboard/invoice/details/${invoiceId}`,

  TRAVEL_CATEGORY: `/dashboard/travelmeta/category`,
  TRAVEL_LOCATION: `/dashboard/travelmeta/location`,

  TOUR_LIST: "/dashboard/tours/list",
  TOUR_DETAILS: (tourId = ":id") => `/dashboard/tours/details/${tourId}`,
  CREATE_TOUR: "/dashboard/tours/create",
  EDIT_TOUR: (tourId = ":id") => `/dashboard/tours/edit/${tourId}`,

  PACKAGE_LIST: "/dashboard/package/list",
  PACKAGE_DETAILS: (packageId = ":id") =>
    `/dashboard/package/details/${packageId}`,
  CREATE_PACKAGE: "/dashboard/package/create",
  EDIT_PACKAGE: (packageId = ":id") => `/dashboard/package/edit/${packageId}`,
  PACKAGE_META: `/dashboard/package/packagemeta`,
  PACKAGE_ENQUIRY: `/dashboard/package/packageenquiry`,

  BOOKING_LIST: "/dashboard/bookings/list",
  BOOKING_DETAILS: (bookingId = ":id") =>
    `/dashboard/bookings/details/${bookingId}`,

  NEWSLETTER_LIST: "/dashboard/newsletter/list",
  CONTACT_FORM_LIST: "/dashboard/contact/list"
};

const getFullPath = <T extends string | ((...args: any[]) => string)>(
  prefix: string,
  route: T
): T extends (...args: any[]) => string
  ? (...args: Parameters<T>) => string
  : string => {
  return (
    typeof route === "function"
      ? (...args: any[]) => `${prefix}${(route as any)(...args)}`
      : (`${prefix}${route}` as any)
  ) as any;
};

const ROUTES = {
  AUTH: Object.keys(ROUTE_PATHS)
    .filter((key): key is keyof typeof ROUTE_PATHS =>
      [
        "LOGIN",
        "REGISTER",
        "FORGOT_PASSWORD",
        "RESET_PASSWORD",
        "RESEND_VERIFICATION",
        "VERIFY_EMAIL",
      ].includes(key)
    )
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: getFullPath(PREFIXES.AUTH, ROUTE_PATHS[key]),
      }),
      {} as Record<
        | "LOGIN"
        | "REGISTER"
        | "FORGOT_PASSWORD"
        | "RESET_PASSWORD"
        | "RESEND_VERIFICATION"
        | "VERIFY_EMAIL",
        string
      >
    ),

  PRIVATE: Object.keys(ROUTE_PATHS)
    .filter(
      (key): key is keyof typeof ROUTE_PATHS =>
        ![
          "LOGIN",
          "REGISTER",
          "FORGOT_PASSWORD",
          "RESET_PASSWORD",
          "RESEND_VERIFICATION",
          "VERIFY_EMAIL",
          "NOT_FOUND",
        ].includes(key)
    )
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: getFullPath(PREFIXES.PRIVATE, ROUTE_PATHS[key]),
      }),
      {} as Record<
        Exclude<
          keyof typeof ROUTE_PATHS,
          | "LOGIN"
          | "REGISTER"
          | "FORGOT_PASSWORD"
          | "RESET_PASSWORD"
          | "RESEND_VERIFICATION"
          | "VERIFY_EMAIL"
          | "NOT_FOUND"
        >,
        string | ((...args: any[]) => string)
      >
    ),
  NOT_FOUND: ROUTE_PATHS.NOT_FOUND,
};

export { PREFIXES, ROUTE_PATHS, ROUTES };
