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
  const roleConfig = user?.role.role_name
    ? ROLES_CONFIG[user.role.role_name]
    : null;
  const sidebarLinks = roleConfig?.sidebar || [];

  return (
    <>
      <div className="h-dvh w-full overflow-hidden bg-slate-50 dark:bg-black flex selection:bg-red-500/30">
        {/* ============== Dashboard SideBar ============== */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          sidebarLinks={sidebarLinks}
        />

        {/* ============== Main Content Area ============== */}
        <div
          className="flex-1 flex flex-col min-w-0 min-h-0 transition-all duration-300 ease-in-out
        "
        >
          {/* ============== Dashboard NavBar ============== */}
          <DashboardNavbar toggleSidebar={() => setIsSidebarOpen(true)} />

          {/* ============== Dashboard Content ============== */}
          <main className="mesh-gradient no-scroll-anchor flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-8 lg:p-10 relative overflow-x-hidden">
            {/* ============== Page Transition Animation ============== */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="w-full min-h-0"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
