import { useLocation, useMatches } from "react-router";
import { ROLES_CONFIG } from "../../../../routes/roles.config";

const useDashboardNavbarLogic = (hookProps0) => {
  const { user } = hookProps0;

  const findRouteByPath = (items, pathname) => {
    for (const item of items) {
      if (item.to === pathname) return item;
      if (item.children) {
        const found = findRouteByPath(item.children, pathname);
        if (found) return found;
      }
    }
    return null;
  };

  const location = useLocation();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const action = currentMatch?.handle?.action;
  const sidebarItems = ROLES_CONFIG[user?.role?.role_name]?.sidebar ?? [];
  const currentRoute = findRouteByPath(sidebarItems, location.pathname);
  const CurrentIcon = currentRoute?.icon;
  const isCreatePage = location.pathname.includes("/create");

  return {
    action,
    CurrentIcon,
    isCreatePage,
  };
};

export default useDashboardNavbarLogic;
