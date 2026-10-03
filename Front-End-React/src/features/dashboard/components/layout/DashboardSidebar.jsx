// React Hooks
import { useEffect, useState } from "react";

// React Redux
import { useSelector } from "react-redux";

// Radix UI
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Collapsible from "@radix-ui/react-collapsible";

// React Router
import { NavLink, useLocation } from "react-router";

// Icons
import { ChevronDown, LogOut, X } from "lucide-react";

// Motion
import { AnimatePresence, motion } from "motion/react";

// Auth
import { selectCurrentUser } from "../../../auth/authSlice";
import { useLogoutMutation } from "../../../auth/authApiSlice";

const DashboardSidebar = ({ isOpen, setIsOpen, sidebarLinks }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const [logout] = useLogoutMutation();

  const [openMenus, setOpenMenus] = useState({});

  // =========================================================
  // ESC → close mobile sidebar
  // =========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [setIsOpen]);

  // =========================================================
  // Lock body scroll on mobile
  // =========================================================

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // =========================================================
  // Check whether a route is active
  // =========================================================

  const isPathActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // =========================================================
  // Check whether one of the submenu children is active
  // =========================================================

  const isChildActive = (children) => {
    return children?.some((child) => isPathActive(child.to));
  };

  // =========================================================
  // Mobile navigation
  // =========================================================

  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // =========================================================
  // Toggle submenu
  // =========================================================

  const handleMenuChange = (label, open) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: open,
    }));
  };

  // =========================================================
  // Logout
  // =========================================================

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="
              fixed
              inset-0
              z-40
              bg-black/50
              backdrop-blur-sm
              lg:hidden
            "
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <motion.aside
        initial={false}
        animate={{
          x:
            typeof window !== "undefined" && window.innerWidth < 1024
              ? isOpen
                ? 0
                : "-100%"
              : 0,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 220,
        }}
        className="
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-800
          bg-slate-900
          text-slate-300

          lg:static
          lg:z-auto
          lg:w-64
        "
      >
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div
          className="
            relative
            flex
            shrink-0
            items-center
            justify-center
            border-b
            border-slate-800
            p-6
          "
        >
          <img
            src="/images/EuroMed-Logo-layout.png"
            alt="EuroMed"
            className="w-40"
          />

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              absolute
              right-4
              top-4
              rounded-lg
              p-2
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

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea.Viewport className="h-full w-full">
            <div className="p-6">
              <nav className="space-y-1">
                {sidebarLinks.map((item) => {
                  const Icon = item.icon;

                  // =================================================
                  // SUBMENU
                  // =================================================

                  if (item.children) {
                    const childIsActive = isChildActive(item.children);

                    /*
                     * If user manually changed the menu,
                     * use that value.
                     *
                     * Otherwise derive the state from the route.
                     */

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
                        {/* ==============================
                            PARENT BUTTON
                        =============================== */}

                        <Collapsible.Trigger
                          className={`
                            my-1
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            px-3.5
                            py-2.5
                            text-sm
                            font-medium
                            transition-all

                            ${
                              childIsActive
                                ? "bg-slate-800 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 shrink-0" />

                            <span>{item.label}</span>
                          </div>

                          <ChevronDown
                            className={`
                              h-4 w-4
                              shrink-0
                              transition-transform
                              duration-200

                              ${isMenuOpen ? "rotate-180" : "rotate-0"}
                            `}
                          />
                        </Collapsible.Trigger>

                        {/* ==============================
                            CHILDREN
                        =============================== */}

                        <Collapsible.Content className="overflow-hidden">
                          <div
                            className="
                              ml-4
                              space-y-1
                              border-l
                              border-slate-800
                              py-1
                              pl-4
                            "
                          >
                            {item.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                end
                                onClick={handleNavigation}
                                className={({ isActive }) => `
                                  flex
                                  items-center
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
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

                  // =================================================
                  // NORMAL LINK
                  // =================================================

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      onClick={handleNavigation}
                      className={({ isActive }) => `
                        my-1
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3.5
                        py-2.5
                        text-sm
                        font-medium
                        transition-all

                        ${
                          isActive
                            ? "bg-sky-600 text-white shadow-md"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4 shrink-0" />

                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </ScrollArea.Viewport>

          {/* ===================================================
              SCROLLBAR
          ==================================================== */}

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="
              flex
              w-2.5
              touch-none
              select-none
              bg-slate-900/50
              p-0.5
            "
          >
            <ScrollArea.Thumb
              className="
                flex-1
                rounded-full
                bg-slate-700
                transition-colors
                hover:bg-sky-600
              "
            />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* ===================================================
            USER / LOGOUT
        ==================================================== */}

        <div
          className="
            shrink-0
            space-y-3
            border-t
            border-slate-800
            p-6
            pt-4
          "
        >
          <div className="text-xs">
            <div className="font-bold text-white">{user?.name}</div>

            <div className="capitalize text-slate-500">
              {user?.role?.role_name} Access
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-xl
              bg-slate-800
              px-3
              py-2
              text-xs
              font-bold
              text-red-400
              transition-colors
              hover:bg-red-950/50
              hover:text-red-300
            "
          >
            <LogOut className="h-4 w-4" />

            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
