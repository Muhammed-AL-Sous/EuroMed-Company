import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

import {
  selectCurrentUser,
  selectAuthReady,
} from "../../features/auth/authSlice";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  const authReady = useSelector(selectAuthReady);
  const location = useLocation();

  if (!authReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.role?.role_name;

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
