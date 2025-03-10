export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
  NOT_FOUND: "*",

  USER_LIST: "/dashboard/users/list",
  USER_DETAILS: (userId = ":userId") => `/dashboard/users/details/${userId}`,
  USER_EDIT: (userId = ":userId") => `/dashboard/users/edit/${userId}`,

  BLOG_LIST: "/dashboard/blogs/list",
  BLOG_DETAILS: (blogId = ":blogId") => `/dashboard/blogs/details/${blogId}`,
  CREATE_BLOG: "/dashboard/blogs/create",
  EDIT_BLOG: (blogId = ":blogId") => `/dashboard/blogs/edit/${blogId}`,
};
