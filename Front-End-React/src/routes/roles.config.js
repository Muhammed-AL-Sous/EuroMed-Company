import { lazy } from "react";

// Icons
import { LayoutDashboard } from "lucide-react";

const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage"),
);

export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",

    sidebar: [{ icon: LayoutDashboard, label: "dashboard", to: "/admin" }],

    routes: [{ path: "", element: DashboardPage }],
  },
};
