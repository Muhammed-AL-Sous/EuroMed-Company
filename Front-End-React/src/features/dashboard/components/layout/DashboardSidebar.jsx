import { useEffect, useState } from "react";

// React Redux
import { useSelector } from "react-redux";

// Radix UI
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Collapsible from "@radix-ui/react-collapsible";

// React Router
import { NavLink, useLocation } from "react-router";

// Icons
import { ChevronDown, CircleHelp, LogOut, X } from "lucide-react";

// Auth
import { selectCurrentUser } from "../../../auth/authSlice";
import { useLogoutMutation } from "../../../auth/authApiSlice";

// Notifications
import { notifySonner } from "../../../../lib/notifySonner";

// ==================================================
// Sidebar Icon
// ==================================================

const SidebarIcon = ({ icon: Icon, className = "h-4 w-4 shrink-0" }) => {
  const IconComponent = Icon ?? CircleHelp;

  return <IconComponent className={className} />;
};

// ==================================================
// Dashboard Sidebar
// ==================================================

const DashboardSidebar = ({ isOpen, setIsOpen, sidebarLinks = [] }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // ==================================================
  // State
  // ==================================================

  const [openMenus, setOpenMenus] = useState({});

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const links = Array.isArray(sidebarLinks) ? sidebarLinks : [];

  // ==================================================
  // Close Sidebar With ESC
  // ==================================================

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

  // ==================================================
  // Lock Body Scroll On Mobile
  // ==================================================

  useEffect(() => {
    document.body.classList.toggle("max-lg:overflow-hidden", isOpen);

    return () => {
      document.body.classList.remove("max-lg:overflow-hidden");
    };
  }, [isOpen]);

  // ==================================================
  // Validate Sidebar Icons
  // ==================================================

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
  }, [sidebarLinks, user?.role?.role_name]);

  // ==================================================
  // Active Route Helpers
  // ==================================================

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

  // ==================================================
  // Navigation Handlers
  // ==================================================

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const handleMenuChange = (label, open) => {
    setOpenMenus((previous) => ({
      ...previous,
      [label]: open,
    }));
  };

  // ==================================================
  // Logout Handler
  // ==================================================

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

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ========================================
          Mobile Overlay
      ======================================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/50 backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* ========================================
          Sidebar Container
      ======================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-800
          bg-slate-900 text-slate-300
          transition-transform duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static lg:z-auto
          lg:w-64 lg:translate-x-0
        `}
      >
        {/* ========================================
            Sidebar Header
        ======================================== */}

        <div
          className="
            relative flex shrink-0
            items-center justify-center
            border-b border-slate-800 p-6
          "
        >
          <img
            src="/images/EuroMed-Logo-layout.png"
            alt="EuroMed"
            className="w-40"
          />

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              absolute right-4 top-4
              rounded-lg p-2
              text-slate-400
              transition-colors
              hover:bg-slate-800
              hover:text-white
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ========================================
            Navigation
        ======================================== */}

        <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea.Viewport className="h-full w-full">
            <div className="p-6">
              <nav className="space-y-1">
                {links.map((item) => {
                  const hasChildren =
                    Array.isArray(item.children) && item.children.length > 0;

                  // ==================================
                  // Submenu
                  // ==================================

                  if (hasChildren) {
                    const childIsActive = isChildActive(item.children);

                    const isMenuOpen = openMenus[item.label] ?? childIsActive;

                    return (
                      <Collapsible.Root
                        key={item.label}
                        open={isMenuOpen}
                        onOpenChange={(open) =>
                          handleMenuChange(item.label, open)
                        }
                        className="w-full"
                      >
                        {/* Submenu Trigger */}

                        <Collapsible.Trigger
                          className={`
                            my-1 flex w-full
                            cursor-pointer
                            items-center
                            justify-between gap-3
                            rounded-xl
                            px-3.5 py-2.5
                            text-sm font-medium
                            transition-all

                            ${
                              childIsActive
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <SidebarIcon icon={item.icon} />

                            <span>{item.label}</span>
                          </div>

                          <ChevronDown
                            className={`
                              h-4 w-4 shrink-0
                              transition-transform
                              duration-200

                              ${isMenuOpen ? "rotate-180" : "rotate-0"}
                            `}
                          />
                        </Collapsible.Trigger>

                        {/* Submenu Content */}

                        <Collapsible.Content className="overflow-hidden">
                          <div
                            className="
                              ml-4 space-y-1
                              border-l
                              border-slate-800
                              py-1 pl-4
                            "
                          >
                            {item.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                end
                                onClick={handleNavigation}
                                className={({ isActive }) => `
                                    flex items-center
                                    rounded-lg
                                    px-3 py-2
                                    text-xs font-bold
                                    transition-all

                                    ${
                                      isActive
                                        ? "bg-sky-600 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-800 hover:text-white"
                                    }
                                  `}
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        </Collapsible.Content>
                      </Collapsible.Root>
                    );
                  }

                  // ==================================
                  // Normal Navigation Link
                  // ==================================

                  if (!item.to) return null;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      onClick={handleNavigation}
                      className={({ isActive }) => `
                        my-1 flex w-full
                        items-center gap-3
                        rounded-xl
                        px-3.5 py-2.5
                        text-sm font-medium
                        transition-all

                        ${
                          isActive
                            ? "bg-sky-600 text-white shadow-md"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <SidebarIcon icon={item.icon} />

                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </ScrollArea.Viewport>

          {/* ========================================
              Scrollbar
          ======================================== */}

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="
              flex w-2.5 touch-none
              select-none
              bg-slate-900/50 p-0.5
            "
          >
            <ScrollArea.Thumb
              className="
                flex-1 rounded-full
                bg-slate-700
                transition-colors
                hover:bg-sky-600
              "
            />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* ========================================
            User / Logout Section
        ======================================== */}

        <div
          className="
            shrink-0 space-y-3
            border-t border-slate-800
            p-6 pt-4
          "
        >
          {/* Current User */}

          <div className="text-xs">
            <div className="font-bold text-white">
              {user?.name ?? "Unknown User"}
            </div>

            <div className="capitalize text-slate-500">
              {user?.role?.role_name ?? "Unknown"} Access
            </div>
          </div>

          {/* Logout Button */}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              flex w-full
              cursor-pointer
              items-center gap-2
              rounded-xl
              bg-slate-800
              px-3 py-2
              text-xs font-bold
              text-red-400
              transition-colors

              hover:bg-red-950/50
              hover:text-red-300

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <LogOut
              className={`h-4 w-4 ${isLoggingOut ? "animate-pulse" : ""}`}
            />

            <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
