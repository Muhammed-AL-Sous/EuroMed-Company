import { Suspense } from "react";
import { Outlet } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import useDashboardLayoutLogic from "./useDashboardLayoutLogic.js";

const DashboardLayout = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    mainRef,
    user,
    location,
    sidebarLinks,
  } = useDashboardLayoutLogic();

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
              <Suspense>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
