import { FiHome } from "react-icons/fi";
import { BiNews } from "react-icons/bi";
import { ROUTES } from "@/config/route-paths.config";

export const sidebarMenuItems = [
  {
    label: "Dashboard",
    icon: <FiHome size="22" />,
    path: ROUTES.PRIVATE.DASHBOARD,
  },
  {
    label: "Blogs",
    icon: <BiNews size="22" />,
    subMenu: [
      {
        label: "All Blogs",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.BLOG_LIST,
      },
      {
        label: "Create Blog",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.CREATE_BLOG,
      },
      {
        label: "Blog Categories",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.BLOG_CATEGORIES,
      },
    ],
  },
];
