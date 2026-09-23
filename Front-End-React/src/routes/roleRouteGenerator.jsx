import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES_CONFIG } from "./roles.config";

const roleRouteGenerator = () => {
  return Object.entries(ROLES_CONFIG).map(([role, config]) => ({
    path: config.prefix,
    element: <ProtectedRoute allowedRoles={[role]} />,
    children: config.routes.map((route) => {
      const Page = route.element;

      return {
        index: route.path === "",
        path: route.path === "" ? undefined : route.path,
        element: <Page />,
      };
    }),
  }));
};

export default roleRouteGenerator;
