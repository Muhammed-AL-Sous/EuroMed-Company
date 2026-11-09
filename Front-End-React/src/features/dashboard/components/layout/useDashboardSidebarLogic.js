import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { selectCurrentUser } from "../../../auth/authSlice";
import { useLogoutMutation } from "../../../auth/authApiSlice";
import { notifySonner } from "../../../../lib/notifySonner";

const useDashboardSidebarLogic = (hookProps0) => {
  const { isOpen, setIsOpen, sidebarLinks = [] } = hookProps0;
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const links = useMemo(
    () => (Array.isArray(sidebarLinks) ? sidebarLinks : []),
    [sidebarLinks],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    document.body.classList.toggle("max-lg:overflow-hidden", isOpen);
    return () => {
      document.body.classList.remove("max-lg:overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    links.forEach((item) => {
      if (!item.icon) {
        console.warn("[DashboardSidebar] Missing icon:", {
          label: item.label,
          path: item.to ?? null,
          role: user?.role?.role_name,
        });
      }
    });
  }, [sidebarLinks, user?.role?.role_name, links]);

  const isPathActive = (path) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isChildActive = (children) => {
    if (!Array.isArray(children)) return false;
    return children.some((child) => isPathActive(child.to));
  };

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const handleMenuChange = (label, open) => {
    setOpenMenus((previous) => ({
      ...previous,
      [label]: open,
    }));
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      await logout().unwrap();
      setIsOpen(false);

      // The logout endpoint clears auth state.
      // ProtectedRoute redirects to /login.
    } catch (error) {
      console.error("[DashboardSidebar] Logout failed:", error);
      notifySonner(
        error?.data?.message || "Failed to sign out. Please try again.",
        "error",
      );
    }
  };

  return {
    user,
    openMenus,
    isLoggingOut,
    links,
    isChildActive,
    handleNavigation,
    handleMenuChange,
    handleLogout,
  };
};

export default useDashboardSidebarLogic;
