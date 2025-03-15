import { FiHome } from "react-icons/fi";
import { BiNews } from "react-icons/bi";
import { ROUTES } from "../common/constants/routes";

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
        label: "Edit Blog",
        icon: <span>-</span>,
        path:
          typeof ROUTES.PRIVATE.EDIT_BLOG === "function"
            ? ROUTES.PRIVATE.EDIT_BLOG(":blogId")
            : ROUTES.PRIVATE.EDIT_BLOG,
      },
    ],
  },
];
