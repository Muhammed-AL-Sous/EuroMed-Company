import { Link, useMatches } from "react-router";
// Roles Config
import { ROLES_CONFIG } from "../../../../routes/roles.config";

const DashboardNavbar = ({ user }) => {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const action = currentMatch?.handle?.action;

  if (location.pathname.includes("/create")) {
    return null;
  }

  const findRouteByPath = (items, pathname) => {
    for (const item of items) {
      if (item.to === pathname) {
        return item;
      }

      if (item.children) {
        const found = findRouteByPath(item.children, pathname);

        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  const currentRoute = findRouteByPath(
    ROLES_CONFIG[user.role.role_name].sidebar,
    location.pathname,
  );
  const CurrentIcon = currentRoute?.icon;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4  border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-black text-slate-700 ">
          <div className="flex items-center gap-2">
            {CurrentIcon && <CurrentIcon size={30} strokeWidth={2.5} />}
            <span>{action?.header}</span>
          </div>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Erbil Headquarters: Central Operations and Process Tracking
        </p>
      </div>
      {action?.to && action?.icon && (
        <Link
          to={action?.to}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-sky-600 bg-sky-500 text-white text-[14px] font-bold shadow-md transition-colors"
        >
          <action.icon size={18} />
          {action?.label}
        </Link>
      )}
    </div>
  );
};

export default DashboardNavbar;
