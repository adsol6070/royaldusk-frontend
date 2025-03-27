export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
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
};
