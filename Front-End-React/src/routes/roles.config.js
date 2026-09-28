import { lazy } from "react";

// Icons
import {
  Award,
  BarChart2,
  ClipboardList,
  Hospital,
  Package,
  Settings,
  Stethoscope,
  Users,
  UserRoundGroup,
  Blocks,
  Box,
  RobotArm,
} from "lucide-react";

const AdminStats = lazy(
  () => import("../features/admin/components/common/AdminStats.jsx"),
);

const DoctorStats = lazy(
  () => import("../features/doctors/components/common/DoctorStats.jsx"),
);

const StaffStats = lazy(
  () => import("../features/staff/components/common/StaffStats.jsx"),
);

const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage"),
);

export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",

    statsComponent: AdminStats,

    sidebar: [
      { to: "/admin", label: "Dashboard", icon: BarChart2 },
      {
        label: "Operations",
        icon: ClipboardList,
        children: [
          {
            to: "/operations",
            label: "All Operations",
          },
          {
            to: "/operations/create",
            label: "Create Operation",
          },
        ],
      },
      {
        label: "Products",
        icon: Package,
        children: [
          {
            to: "/products",
            label: "All Products",
          },
          {
            to: "/products/create",
            label: "Create Product",
          },
        ],
      },

      {
        label: "Categories",
        icon: Blocks,
        children: [
          {
            to: "/categories",
            label: "All Categories",
          },
          {
            to: "/categories/create",
            label: "Create Category",
          },
        ],
      },

      {
        label: "Subcategories",
        icon: Box,
        children: [
          {
            to: "/subcategories",
            label: "All Subcategories",
          },
          {
            to: "/subcategories/create",
            label: "Create Subcategory",
          },
        ],
      },

      {
        label: "Manufacturers",
        icon: RobotArm,
        children: [
          {
            to: "/manufacturers",
            label: "All Manufacturers",
          },
          {
            to: "/manufacturers/create",
            label: "Create Manufacturer",
          },
        ],
      },

      {
        label: "Doctors",
        icon: Stethoscope,
        children: [
          {
            to: "/doctors",
            label: "All Doctors",
          },
          {
            to: "/doctors/create",
            label: "Create Doctor Profile",
          },
        ],
      },

      {
        label: "Hospitals",
        icon: Hospital,
        children: [
          {
            to: "/hospitals",
            label: "All Hospitals",
          },
          { to: "/hospitals/create", label: "Create Hospital" },
        ],
      },
      {
        label: "Patient Records",
        icon: Users,
        children: [
          { to: "/patients", label: "All Patients" },
          { to: "/patients/create", label: "Create Patient" },
        ],
      },
      {
        label: "Brands",
        icon: Award,
        children: [
          {
            to: "/brands",
            label: "All Brands",
          },
          {
            to: "/brands/create",
            label: "Create Brand",
          },
        ],
      },
      {
        label: "Users",
        icon: UserRoundGroup,
        children: [
          {
            to: "/users",
            label: "All Users",
          },
          {
            to: "/users/create",
            label: "Create User",
          },
        ],
      },
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ],

    routes: [{ path: "", element: DashboardPage }],

    colors: ["#0284c7", "#0d9488", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"],
  },

  doctor: {
    prefix: "doctor",

    doctorComponent: DoctorStats,

    sidebar: [{ icon: BarChart2, label: "Dashboard", to: "/doctor" }],

    routes: [{ path: "", element: DashboardPage }],
  },

  staff: {
    prefix: "staff",

    staffComponent: StaffStats,

    sidebar: [{ icon: BarChart2, label: "Dashboard", to: "/staff" }],

    routes: [{ path: "", element: DashboardPage }],
  },
};
