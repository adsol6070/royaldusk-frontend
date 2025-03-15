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
  NOT_FOUND: "*",

  USER_LIST: "/dashboard/users/list",
  USER_DETAILS: (userId = ":userId") => `/dashboard/users/details/${userId}`,
  USER_EDIT: (userId = ":userId") => `/dashboard/users/edit/${userId}`,

  BLOG_LIST: "/dashboard/blogs/list",
  BLOG_DETAILS: (blogId = ":blogId") => `/dashboard/blogs/details/${blogId}`,
  CREATE_BLOG: "/dashboard/blogs/create",
  EDIT_BLOG: (blogId = ":blogId") => `/dashboard/blogs/edit/${blogId}`,
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
      ["LOGIN", "REGISTER"].includes(key)
    )
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: getFullPath(PREFIXES.AUTH, ROUTE_PATHS[key]),
      }),
      {} as Record<"LOGIN" | "REGISTER", string>
    ),

  PRIVATE: Object.keys(ROUTE_PATHS)
    .filter(
      (key): key is keyof typeof ROUTE_PATHS =>
        !["LOGIN", "REGISTER", "NOT_FOUND"].includes(key)
    )
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: getFullPath(PREFIXES.PRIVATE, ROUTE_PATHS[key]),
      }),
      {} as Record<
        Exclude<keyof typeof ROUTE_PATHS, "LOGIN" | "REGISTER" | "NOT_FOUND">,
        string | ((...args: any[]) => string)
      >
    ),
  NOT_FOUND: ROUTE_PATHS.NOT_FOUND,
};

export { PREFIXES, ROUTE_PATHS, ROUTES };
