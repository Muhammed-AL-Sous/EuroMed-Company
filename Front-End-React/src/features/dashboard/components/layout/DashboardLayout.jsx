import { useState, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";

import { selectCurrentUser } from "../../../auth/authSlice";
import { ROLES_CONFIG } from "../../../../routes/roles.config";

import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainRef = useRef(null);

  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const roleName = user?.role?.role_name;
  const roleConfig = roleName ? ROLES_CONFIG[roleName] : null;
  const sidebarLinks = roleConfig?.sidebar ?? [];

  // Scroll to top on route change
  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [location.pathname]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-100">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        sidebarLinks={sidebarLinks}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main
          ref={mainRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10"
          style={{ overflowAnchor: "none" }}
        >
          {/* Navbar outside page animation */}
          <DashboardNavbar
            user={user}
            toggleSidebar={() => setIsSidebarOpen(true)}
          />

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
              className="w-full space-y-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
