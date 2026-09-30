import { Link, useMatches } from "react-router";

const DashboardNavbar = () => {
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];

  const action = currentMatch?.handle?.action;

  if (location.pathname.includes("/create")) {
    return null;
  }
  
  return (
    <div>
      <h1> DashboardNavbar</h1>
      {action && (
        <Link
          to={action.to}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <action.icon size={18} />
          {action.label}
        </Link>
      )}
    </div>
  );
};

export default DashboardNavbar;
