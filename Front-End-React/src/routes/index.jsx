import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./PublicRoutes";
import PublicLayout from "../components/layout/PublicLayout";

export const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <PublicLayout />,
        children: [...publicRoutes],
      },
    ],
  },
]);
