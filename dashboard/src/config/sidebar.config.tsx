import { FiHome } from "react-icons/fi";
import { BiNews } from "react-icons/bi";
import { FaMapMarkedAlt, FaFileAlt } from "react-icons/fa";
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
  {
    label: "Tours",
    icon: <FaMapMarkedAlt size="22" />,
    subMenu: [
      {
        label: "All Tours",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.TOUR_LIST,
      },
      {
        label: "Create Tour",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.CREATE_TOUR,
      },
    ],
  },
  {
    label: "Invoices",
    icon: <FaFileAlt size="22" />,
    path: ROUTES.PRIVATE.INVOICE_LIST,
  },
];
