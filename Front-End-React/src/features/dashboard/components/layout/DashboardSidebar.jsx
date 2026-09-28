// React Hooks
import { useEffect, useMemo, useState } from "react";

// React Redux
import { useSelector } from "react-redux";

// Icon
import { ChevronDown, LogOut, X, Activity } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

// React Router
import { Link, useLocation } from "react-router";

// Auth Slice
import { selectCurrentUser } from "../../../auth/authSlice";
import { useLogoutMutation } from "../../../auth/authApiSlice";

// Motion Library
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../../lib/utils";
import { Em, Strong } from "@radix-ui/themes";

const DashboardSidebar = ({ isOpen, setIsOpen, sidebarLinks }) => {
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsOpen]);

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
  };

  const handleMobileNavigation = () => {
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    }
  };

  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    logout();
  };

  return (
    <>
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          <div className="flex flex-col items-center mb-4 pb-4 border-b border-slate-800">
            <div>
              <img
                src="/images/EuroMed-Logo-layout.png"
                alt="EuroMed-Logo"
                className="w-40"
              />
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;

              // =========================
              // Item with submenu
              // =========================
              if (item.children) {
                const isChildActive = item.children.some(
                  (child) => location.pathname === child.to,
                );

                return (
                  <Collapsible.Root
                    key={item.label}
                    defaultOpen={isChildActive}
                    className="w-full"
                  >
                    <Collapsible.Trigger
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 my-1 rounded-xl text-sm font-medium transition-all ${
                        isChildActive
                          ? "text-white bg-slate-800"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>

                      <ChevronDown className="w-4 h-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                    </Collapsible.Trigger>

                    <Collapsible.Content className="overflow-hidden">
                      <div className="ml-4 pl-4 border-l border-slate-800 space-y-1 py-1">
                        {item.children.map((child) => {
                          const isActive = location.pathname === child.to;

                          return (
                            <Link key={child.to} to={child.to}>
                              <div
                                className={`flex items-center px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                                  isActive
                                    ? "bg-sky-600 text-white"
                                    : "text-gray-500 hover:text-white hover:bg-slate-800"
                                }`}
                              >
                                {child.label}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                );
              }

              // =========================
              // Normal item
              // =========================
              const isActive = location.pathname === item.to;

              return (
                <Link key={item.to} to={item.to}>
                  <button
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 my-1 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sky-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="text-xs">
            <div className="font-bold text-white">{user?.name}</div>
            <div className="text-slate-500 capitalize">
              {user?.role.role_name} Access
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-red-400 hover:bg-red-950/50 hover:text-red-300 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
      {/* // TODO: In Mobile */}
    </>
  );
};

export default DashboardSidebar;
