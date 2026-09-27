import { lazy } from "react";

// Icons
import { LayoutDashboard } from "lucide-react";

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

    sidebar: [{ icon: LayoutDashboard, label: "dashboard", to: "/admin" }],

    routes: [{ path: "", element: DashboardPage }],
  },

  doctor: {
    prefix: "doctor",

    doctorComponent: DoctorStats,

    sidebar: [{ icon: LayoutDashboard, label: "dashboard", to: "/doctor" }],

    routes: [{ path: "", element: DashboardPage }],
  },

  staff: {
    prefix: "staff",

    staffComponent: StaffStats,

    sidebar: [{ icon: LayoutDashboard, label: "dashboard", to: "/staff" }],

    routes: [{ path: "", element: DashboardPage }],
  },
};
