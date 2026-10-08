import { Link, useLocation, useMatches } from "react-router";
import { Menu } from "lucide-react";

// Roles Config
import { ROLES_CONFIG } from "../../../../routes/roles.config";

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

const DashboardNavbar = ({ user, toggleSidebar }) => {
  const location = useLocation();
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const action = currentMatch?.handle?.action;

  const sidebarItems = ROLES_CONFIG[user?.role?.role_name]?.sidebar ?? [];
  const currentRoute = findRouteByPath(sidebarItems, location.pathname);
  const CurrentIcon = currentRoute?.icon;

  const isCreatePage = location.pathname.includes("/create");

  return (
    <div
      className={`
        flex flex-col gap-4 border-b border-slate-200 pb-4
        sm:flex-row sm:items-center sm:justify-between
        ${isCreatePage ? "lg:hidden" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        {/* زر فتح السايدبار: تحت 1024px فقط */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="mt-0.5 shrink-0 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {!isCreatePage && (
          <div>
            <h1 className="text-2xl font-black text-slate-700">
              <div className="flex items-center gap-2">
                {CurrentIcon && <CurrentIcon size={30} strokeWidth={2.5} />}
                <span>{action?.header}</span>
              </div>
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Erbil Headquarters: Central Operations and Process Tracking
            </p>
          </div>
        )}
      </div>

      {!isCreatePage && action?.to && action?.icon && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-[14px] font-bold text-white shadow-md transition-colors hover:bg-sky-600"
        >
          <action.icon size={18} />
          {action.label}
        </Link>
      )}
    </div>
  );
};

export default DashboardNavbar;
