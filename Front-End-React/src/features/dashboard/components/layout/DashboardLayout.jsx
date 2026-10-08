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

// Motion
import { motion, AnimatePresence } from "motion/react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const roleName = user?.role?.role_name;
  const roleConfig = roleName ? ROLES_CONFIG[roleName] : null;
  const sidebarLinks = roleConfig?.sidebar ?? [];

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-100">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        sidebarLinks={sidebarLinks}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10">
          {/* Navbar ثابت خارج الأنيميشن */}
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
              transition={{ duration: 0.3, ease: "circOut" }}
              className="mt-8 w-full space-y-8"
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
