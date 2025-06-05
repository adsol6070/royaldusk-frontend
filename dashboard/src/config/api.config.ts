export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/user-service/api/auth/login`,
    REGISTER: `/user-service/api/auth/register`,
    LOGOUT: `/user-service/api/auth/logout`,
    FORGOT_PASSWORD: `/user-service/api/auth/forgot-password`,
    RESET_PASSWORD: `/user-service/api/auth/reset-password`,
    RESEND_VERIFICATION: `/user-service/api/auth/resend-verification-email`,
    VERIFY_EMAIL: `/user-service/api/auth/verify-email`,
  },
  USER: {
    ME: `/user-service/api/users/me`,
    GET_ALL: `/user-service/api/users/`,
    GET_BY_ID: (id: string) => `/user-service/api/users/${id}`,
    UPDATE: (id: string) => `/user-service/api/users/${id}`,
    DELETE: (id: string) => `/user-service/api/users/${id}`,
  },
  BLOG: {
    GET_ALL: `/blog-service/api/blogs`,
    GET_BY_ID: (id: string) => `/blog-service/api/blogs/${id}`,
    CREATE: `/blog-service/api/blogs`,
    UPDATE: (id: string) => `/blog-service/api/blogs/${id}`,
    DELETE: (id: string) => `/blog-service/api/blogs/${id}`,
    UPDATE_STATUS: (id: string) => `/blog-service/api/blogs/${id}/status`,
  },
  BLOG_CATEGORY: {
    GET_ALL: `/blog-service/api/blog-categories`,
    GET_BY_ID: (id: string) => `/blog-service/api/blog-categories/${id}`,
    CREATE: `/blog-service/api/blog-categories`,
    UPDATE: (id: string) => `/blog-service/api/blog-categories/${id}`,
    DELETE: (id: string) => `/blog-service/api/blog-categories/${id}`,
  },
  TOUR: {
    GET_ALL: `/tour-service/tours`,
    GET_BY_ID: (id: string) => `/tour-service/tours/${id}`,
    CREATE: `/tour-service/tours`,
    UPDATE: (id: string) => `/tour-service/tours/${id}`,
    DELETE: (id: string) => `/tour-service/tours/${id}`,
  },
  PACKAGES: {
    GET_ALL: `/package-service/api/package`,
    GET_BY_ID: (id: string) => `/package-service/api/package/${id}`,
    CREATE: `/package-service/api/package`,
    UPDATE: (id: string) => `/package-service/api/package/${id}`,
    UPDATE_AVAILABILITY: (id: string) =>
      `/package-service/api/package/${id}/availability`,
    DELETE: (id: string) => `/package-service/api/package/${id}`,
  },
  PACKAGE_LOCATION: {
    GET_ALL: `/package-service/api/package-location`,
    GET_BY_ID: (id: string) => `/package-service/api/package-location/${id}`,
    CREATE: `/package-service/api/package-location`,
    UPDATE: (id: string) => `/package-service/api/package-location/${id}`,
    DELETE: (id: string) => `/package-service/api/package-location/${id}`,
  },
  PACKAGE_CATEGORY: {
    GET_ALL: `/package-service/api/package-essentials/categories/`,
    GET_BY_ID: (id: string) =>
      `/package-service/api/package-essentials/categories/${id}`,
    CREATE: `/package-service/api/package-essentials/categories/`,
    UPDATE: (id: string) =>
      `/package-service/api/package-essentials/categories/${id}`,
    DELETE: (id: string) =>
      `/package-service/api/package-essentials/categories/${id}`,
  },
  PACKAGE_SERVICES: {
    GET_ALL: `/package-service/api/package-essentials/services/`,
    GET_BY_ID: (id: string) =>
      `/package-service/api/package-essentials/services/${id}`,
    CREATE: `/package-service/api/package-essentials/services/`,
    UPDATE: (id: string) =>
      `/package-service/api/package-essentials/services/${id}`,
    DELETE: (id: string) =>
      `/package-service/api/package-essentials/services/${id}`,
  },
  PACKAGE_FEATURE: {
    GET_ALL: `/package-service/api/package-essentials/features/`,
    GET_BY_ID: (id: string) =>
      `/package-service/api/package-essentials/features/${id}`,
    CREATE: `/package-service/api/package-essentials/features/`,
    UPDATE: (id: string) =>
      `/package-service/api/package-essentials/features/${id}`,
    DELETE: (id: string) =>
      `/package-service/api/package-essentials/features/${id}`,
  },
  PACKAGE_ITINERARY: {
    GET_ALL: `/package-service/api/package-itinerary/`,
    GET_BY_ID: (id: string) => `/package-service/api/package-itinerary/${id}`,
    CREATE: `/package-service/api/package-itinerary/`,
    UPDATE: (id: string) => `/package-service/api/package-itinerary/${id}`,
    DELETE: (id: string) => `/package-service/api/package-itinerary/${id}`,
  },
  PACKAGE_POLICY: {
    GET_ALL: `/package-service/api/package-policy/`,
    GET_BY_ID: (id: string) => `/package-service/api/package-policy/${id}`,
    CREATE: `/package-service/api/package-policy/`,
    UPDATE: (id: string) => `/package-service/api/package-policy/${id}`,
    DELETE: (id: string) => `/package-service/api/package-policy/${id}`,
  },
  PACKAGE_ENQUIRY: {
    GET_ALL: `/package-service/api/package-enquiry/`,
    GET_BY_ID: (id: string) => `/package-service/api/package-enquiry/${id}`,
    CREATE: `/package-service/api/package-enquiry/`,
    DELETE: (id: string) => `/package-service/api/package-enquiry/${id}`,
  },
  INVOICE: {
    GET_ALL: "/invoice-service/invoice",
    GET_BY_ID: (id: string) => `/invoice-service/invoice/${id}`,
    DELETE: (id: string) => `/invoice-service/invoice/${id}`,
  },
  BOOKING: {
    GET_ALL: "/booking-service/api/booking",
    GET_BY_ID: (id: string) => `/booking-service/api/booking/${id}`,
  },
};
