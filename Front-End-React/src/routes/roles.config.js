import { lazy } from "react";

// Icons
import {
  Activity,
  Award,
  BarChart2,
  Building2,
  ClipboardList,
  Hospital,
  Layers,
  LogOut,
  Package,
  Plus,
  Settings,
  Stethoscope,
  Users,
  Video,
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
          {
            to: "/operation-types",
            label: "Operation Types",
          },
        ],
      },
      {
        label: "Products",
        icon: Package,
        children: [
          {
            to: "/products",
            label: "Products",
          },
          {
            to: "/categories",
            label: "Categories",
          },
          {
            to: "/subcategories",
            label: "Subcategories",
          },
          {
            to: "/manufacturers",
            label: "Manufacturers",
          },
        ],
      },

      {
        to: "/doctors",
        label: "Doctors",
        icon: Stethoscope,
      },

      {
        to: "/hospitals",
        label: "Hospitals",
        icon: Hospital,
      },

      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
      },
      { to: "/patients", label: "Patient Records", icon: Users },
      { to: "/brands", label: "Brands", icon: Award },
    ],

    routes: [{ path: "", element: DashboardPage }],

    colors: ["#0284c7", "#0d9488", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"],
  },

  doctor: {
    prefix: "doctor",

    doctorComponent: DoctorStats,

    sidebar: [{ icon: BarChart2, label: "dashboard", to: "/doctor" }],

    routes: [{ path: "", element: DashboardPage }],
  },

  staff: {
    prefix: "staff",

    staffComponent: StaffStats,

    sidebar: [{ icon: BarChart2, label: "dashboard", to: "/staff" }],

    routes: [{ path: "", element: DashboardPage }],
  },
};
