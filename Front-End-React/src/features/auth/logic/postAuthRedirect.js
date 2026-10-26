import { matchPath } from "react-router";
import { ROLES_CONFIG } from "../../../routes/roles.config";

export function getPostAuthDestination(user, options = {}) {
  const { fallbackPath } = options;

  if (!user) {
    return "/login";
  }

  const roleName = user?.role?.role_name;
  const roleConfig = ROLES_CONFIG[roleName];

  if (!roleConfig) {
    return "/unauthorized";
  }

  const homePath = `/${roleConfig.prefix}`;

  if (!fallbackPath || typeof fallbackPath !== "string") {
    return homePath;
  }

  const isAllowedPath = roleConfig.routes.some((route) => {
    const routePath = route.path
      ? route.path.startsWith("/")
        ? route.path
        : `${homePath}/${route.path}`
      : homePath;

    return Boolean(
      matchPath(
        {
          path: routePath,
          end: true,
        },
        fallbackPath,
      ),
    );
  });

  return isAllowedPath ? fallbackPath : homePath;
}
