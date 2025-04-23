export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
  },
  USER: {
    GET_ALL: `/users/`,
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
  },
  BLOG: {
    GET_ALL: `/blogs`,
    GET_BY_ID: (id: string) => `/blogs/${id}`,
    CREATE: `/blogs`,
    UPDATE: (id: string) => `/blogs/${id}`,
    DELETE: (id: string) => `/blogs/${id}`,
    UPDATE_STATUS: (id: string) => `/blogs/${id}/status`,
  },
  BLOG_CATEGORY: {
    GET_ALL: `/blogCategories`,
    GET_BY_ID: (id: string) => `/blogCategory/${id}`,
    CREATE: `/blogCategory`,
    UPDATE: (id: string) => `/blogCategory/${id}`,
    DELETE: (id: string) => `/blogCategory/${id}`,
  },
  TOUR: {
    GET_ALL: `/tours`,
    GET_BY_ID: (id: string) => `/tours/${id}`,
    CREATE: `/tours`,
    UPDATE: (id: string) => `/tours/${id}`,
    DELETE: (id: string) => `/tours/${id}`,
  },
  INVOICE: {
    GET_ALL: "/invoice",
    GET_BY_ID: (id: string) => `/invoice/${id}`,
    DELETE: (id: string) => `/invoice/${id}`,
  }
};
