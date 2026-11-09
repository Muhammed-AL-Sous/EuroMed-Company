import { useState, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { selectCurrentUser } from "../../../auth/authSlice";
import { ROLES_CONFIG } from "../../../../routes/roles.config";

const useDashboardLayoutLogic = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainRef = useRef(null);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const roleName = user?.role?.role_name;
  const roleConfig = roleName ? ROLES_CONFIG[roleName] : null;
  const sidebarLinks = roleConfig?.sidebar ?? [];

  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [location.pathname]);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    mainRef,
    user,
    location,
    sidebarLinks,
  };
};

export default useDashboardLayoutLogic;
