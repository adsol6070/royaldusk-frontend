import { FiHome } from "react-icons/fi";
import { BiNews } from "react-icons/bi";
import { FaSuitcaseRolling, FaClipboardList } from "react-icons/fa";
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
    label: "Packages",
    icon: <FaSuitcaseRolling size={22} />,
    subMenu: [
      {
        label: "All Packages",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.PACKAGE_LIST,
      },
      {
        label: "Create Package",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.CREATE_PACKAGE,
      },
      {
        label: "Package Essentials",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.PACKAGE_META,
      },
      {
        label: "Package Enquiry",
        icon: <span>-</span>,
        path: ROUTES.PRIVATE.PACKAGE_ENQUIRY,
      },
    ],
  },
  {
    label: "Bookings",
    icon: <FaClipboardList size={22} />,
    path: ROUTES.PRIVATE.BOOKING_LIST,
  },
];
