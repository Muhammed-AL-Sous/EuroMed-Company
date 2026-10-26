import { Link } from "react-router";
import { useSelector } from "react-redux";
import { ShieldAlert } from "lucide-react";

import { selectCurrentUser } from "../features/auth/authSlice";

const UnauthorizedPage = () => {
  const user = useSelector(selectCurrentUser);

  const homePaths = {
    admin: "/admin",
    doctor: "/doctor",
    staff: "/staff",
  };

  const homePath = homePaths[user?.role?.role_name] ?? "/login";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <ShieldAlert size={64} className="text-red-500" />

      <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>

      <p className="max-w-md text-sm text-slate-500">
        You do not have permission to access this page.
      </p>

      <Link
        to={homePath}
        replace
        className="rounded-lg bg-sky-700 px-5 py-2.5 font-semibold text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
