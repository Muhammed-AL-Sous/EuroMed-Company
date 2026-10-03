// React Hooks
import { useState } from "react";

// React Redux
import { useSelector } from "react-redux";

// Auth Slice
import { selectCurrentUser } from "../../../auth/authSlice";

// React Router
import { Outlet, useLocation } from "react-router";

// Roles Config
import { ROLES_CONFIG } from "../../../../routes/roles.config";

// Components
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

import { motion, AnimatePresence } from "motion/react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const roleName = user?.role?.role_name;

  const roleConfig = roleName ? ROLES_CONFIG[roleName] : null;

  const sidebarLinks = roleConfig?.sidebar ?? [];

  return (
    <div className="flex h-dvh w-full bg-slate-100 overflow-hidden">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        sidebarLinks={sidebarLinks}
      />

      <div className="flex min-w-0 min-h-0 flex-1 flex-col">
        <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{
                duration: 0.3,
                ease: "circOut",
              }}
              className="min-h-0 w-full"
            >
              <DashboardNavbar
                user={user}
                toggleSidebar={() => setIsSidebarOpen(true)}
              />
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
