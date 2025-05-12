export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/user-service/auth/login`,
    REGISTER: `/user-service/auth/register`,
    FORGOT_PASSWORD: `/user-service/auth/forgot-password`,
    RESET_PASSWORD: `/user-service/auth/reset-password`,
  },
  USER: {
    GET_ALL: `/user-service/users/`,
    GET_BY_ID: (id: string) => `/user-service/users/${id}`,
    UPDATE: (id: string) => `/user-service/users/${id}`,
  },
  BLOG: {
    GET_ALL: `/blog-service/blogs`,
    GET_BY_ID: (id: string) => `/blog-service/blogs/${id}`,
    CREATE: `/blog-service/blogs`,
    UPDATE: (id: string) => `/blog-service/blogs/${id}`,
    DELETE: (id: string) => `/blog-service/blogs/${id}`,
    UPDATE_STATUS: (id: string) => `/blog-service/blogs/${id}/status`,
  },
  BLOG_CATEGORY: {
    GET_ALL: `/blog-service/blogCategories`,
    GET_BY_ID: (id: string) => `/blog-service/blogCategory/${id}`,
    CREATE: `/blog-service/blogCategory`,
    UPDATE: (id: string) => `/blog-service/blogCategory/${id}`,
    DELETE: (id: string) => `/blog-service/blogCategory/${id}`,
  },
  TOUR: {
    GET_ALL: `/tour-service/tours`,
    GET_BY_ID: (id: string) => `/tour-service/tours/${id}`,
    CREATE: `/tour-service/tours`,
    UPDATE: (id: string) => `/tour-service/tours/${id}`,
    DELETE: (id: string) => `/tour-service/tours/${id}`,
  },
  PACKAGES: {
    GET_ALL: `/package-service/packages`,
    GET_BY_ID: (id: string) => `/package-service/packages/${id}`,
    CREATE: `/package-service/tours`,
    UPDATE: (id: string) => `/package-service/packages/${id}`,
    DELETE: (id: string) => `/package-service/packages/${id}`,
  },
  PACKAGE_CATEGORY: {
    GET_ALL: `/package-service/packageCategories`,
    GET_BY_ID: (id: string) => `/package-service/packageCategory/${id}`,
    CREATE: `/package-service/packageCategory`,
    UPDATE: (id: string) => `/package-service/packageCategory/${id}`,
    DELETE: (id: string) => `/package-service/packageCategory/${id}`,
  },
  PACKAGE_SERVICES: {
    GET_ALL: `/package-service/packageServices`,
    GET_BY_ID: (id: string) => `/package-service/packageServices/${id}`,
    CREATE: `/package-service/packageServices`,
    UPDATE: (id: string) => `/package-service/packageServices/${id}`,
    DELETE: (id: string) => `/package-service/packageServices/${id}`,
  },
  PACKAGE_FEATURE: {
    GET_ALL: `/package-service/packageFeatures`,
    GET_BY_ID: (id: string) => `/package-service/packageFeatures/${id}`,
    CREATE: `/package-service/packageFeatures`,
    UPDATE: (id: string) => `/package-service/packageFeatures/${id}`,
    DELETE: (id: string) => `/package-service/packageFeatures/${id}`,
  },
  PACKAGE_ITINERARY: {
    GET_ALL: `/package-service/packageItineraries`,
    GET_BY_ID: (id: string) => `/package-service/packageItineraries/${id}`,
    CREATE: `/package-service/packageItineraries`,
    UPDATE: (id: string) => `/package-service/packageItineraries/${id}`,
    DELETE: (id: string) => `/package-service/packageItineraries/${id}`,
  },
  PACKAGE_POLICY: {
    GET_ALL: `/package-service/packagePolicies`,
    GET_BY_ID: (id: string) => `/package-service/packagePolicies/${id}`,
    CREATE: `/package-service/packagePolicies`,
    UPDATE: (id: string) => `/package-service/packagePolicies/${id}`,
    DELETE: (id: string) => `/package-service/packagePolicies/${id}`,
  },
  PACKAGE_ENQUIRY: {
    GET_ALL: `/package-service/packageEnquires`,
    GET_BY_ID: (id: string) => `/package-service/packageEnquires/${id}`,
    CREATE: `/package-service/packageEnquires`,
    DELETE: (id: string) => `/package-service/packageEnquires/${id}`,
  },
  INVOICE: {
    GET_ALL: "/invoice-service/invoice",
    GET_BY_ID: (id: string) => `/invoice-service/invoice/${id}`,
    DELETE: (id: string) => `/invoice-service/invoice/${id}`,
  }
};
