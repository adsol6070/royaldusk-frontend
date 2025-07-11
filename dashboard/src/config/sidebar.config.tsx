import { FiHome, FiUsers } from "react-icons/fi";
import { BiNews, BiCategoryAlt } from "react-icons/bi";
import {
  FaSuitcaseRolling,
  FaClipboardList,
  FaUmbrellaBeach,
  FaCogs,
  FaEnvelopeOpenText,
  FaRegCommentDots,
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaTags,
  FaListAlt,
} from "react-icons/fa";
import { ROUTES } from "@/config/route-paths.config";

export const sidebarMenuItems = [
  {
    label: "Dashboard",
    icon: <FiHome size={22} />,
    path: ROUTES.PRIVATE.DASHBOARD,
  },
  {
    label: "Bookings",
    icon: <FaClipboardList size={22} />,
    path: ROUTES.PRIVATE.BOOKING_LIST,
  },
  {
    label: "Contact Form",
    icon: <FaRegCommentDots size={22} />,
    path: ROUTES.PRIVATE.CONTACT_FORM_LIST,
  },
  {
    label: "Newsletter",
    icon: <FaEnvelopeOpenText size={22} />,
    path: ROUTES.PRIVATE.NEWSLETTER_LIST,
  },
  {
    label: "Users",
    icon: <FiUsers size={22} />,
    path: ROUTES.PRIVATE.USER_LIST,
  },
  {
    label: "Blogs",
    icon: <BiNews size={22} />,
    subMenu: [
      {
        label: "All Blogs",
        icon: <FaListAlt size={14} />,
        path: ROUTES.PRIVATE.BLOG_LIST,
      },
      {
        label: "Create Blog",
        icon: <FaTags size={14} />,
        path: ROUTES.PRIVATE.CREATE_BLOG,
      },
      {
        label: "Blog Categories",
        icon: <BiCategoryAlt size={14} />,
        path: ROUTES.PRIVATE.BLOG_CATEGORIES,
      },
    ],
  },
  {
    label: "Travel Meta",
    icon: <FaCogs size={22} />,
    subMenu: [
      {
        label: "Category",
        icon: <BiCategoryAlt size={14} />,
        path: ROUTES.PRIVATE.TRAVEL_CATEGORY,
      },
      {
        label: "Locations",
        icon: <FaMapMarkedAlt size={14} />,
        path: ROUTES.PRIVATE.TRAVEL_LOCATION,
      },
    ],
  },
  {
    label: "Packages",
    icon: <FaSuitcaseRolling size={22} />,
    subMenu: [
      {
        label: "All Packages",
        icon: <FaListAlt size={14} />,
        path: ROUTES.PRIVATE.PACKAGE_LIST,
      },
      {
        label: "Create Package",
        icon: <FaTags size={14} />,
        path: ROUTES.PRIVATE.CREATE_PACKAGE,
      },
      {
        label: "Package Essentials",
        icon: <FaCogs size={14} />,
        path: ROUTES.PRIVATE.PACKAGE_META,
      },
      {
        label: "Package Enquiry",
        icon: <FaRegCommentDots size={14} />,
        path: ROUTES.PRIVATE.PACKAGE_ENQUIRY,
      },
    ],
  },
  {
    label: "Tours",
    icon: <FaUmbrellaBeach size={22} />,
    subMenu: [
      {
        label: "All Tour",
        icon: <FaListAlt size={14} />,
        path: ROUTES.PRIVATE.TOUR_LIST,
      },
      {
        label: "Create Tour",
        icon: <FaPlaneDeparture size={14} />,
        path: ROUTES.PRIVATE.CREATE_TOUR,
      },
    ],
  },
];
