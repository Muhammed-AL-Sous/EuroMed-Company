import { Navigate, Outlet } from "react-router";

import useProtectedRouteLogic from "./useProtectedRouteLogic.js";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, authReady, location, currentRole } = useProtectedRouteLogic();

  if (!authReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentRole)) {
    if (import.meta.env.DEV) {
      console.warn("[ProtectedRoute] Access denied", {
        pathname: location.pathname,
        currentRole,
        allowedRoles,
        userId: user.id,
      });
    }

    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
