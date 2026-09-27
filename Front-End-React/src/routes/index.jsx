import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./PublicRoutes";
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import roleRouteGenerator from "./roleRouteGenerator";
import DashboardLayout from "../features/dashboard/components/layout/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: publicRoutes,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [...roleRouteGenerator()],
      },
    ],
  },
]);
