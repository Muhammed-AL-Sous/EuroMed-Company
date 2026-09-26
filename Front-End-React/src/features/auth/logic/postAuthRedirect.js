import { ROLES_CONFIG } from "../../../routes/roles.config";

export function getPostAuthDestination(user, options = {}) {
  const { fallbackPath } = options;

  if (!user) {
    return "/login";
  }

  if (
    fallbackPath &&
    fallbackPath !== "/login" &&
    fallbackPath !== "/register"
  ) {
    return fallbackPath;
  }

  const prefix = ROLES_CONFIG[user.role.role_name]?.prefix || "";
  return prefix ? `/${prefix}` : "/login";
}
