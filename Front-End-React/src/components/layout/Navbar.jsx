import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import useNavbarLogic from "./useNavbarLogic.js";

export default function Navbar() {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    location,
    user,
    navLinks,
    authButtonClass,
    logoutButtonClass,
    handleLogout,
    isFullyOnboarded,
    dashboardHref,
  } = useNavbarLogic();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full flex-col lg:flex-row justify-between">
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="inline-block font-medium text-white text-[11px] md:text-xs">
              Erbil HQ & Regional Distribution Center :
            </span>
            <span className="hidden md:inline-block text-slate-400 text-[10.5px] md:text-xs">
              Koya Road, Hewa City, Zone A, Building 142
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10.5px] md:text-xs">
            <span className="hidden md:inline-block font-mono text-sky-400">
              +964 750 376 9545
            </span>
            <Link
              to="/operation-details"
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 text-[10.5px] md:text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Patient Operation Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}

        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <img
              src="/images/EuroMed-Logo-layout.png"
              alt="EuroMed-Logo"
              className="w-40 mb-0 mx-auto"
            />
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
              Orthopedic & Surgical Implants
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-linear-to-br from-sky-600 to-slate-900 text-white shadow-xs"
                    : link.highlight
                      ? "text-sky-700 hover:bg-sky-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {isFullyOnboarded ? (
            <div className="flex items-center">
              <Link
                to={dashboardHref}
                className={`inline-flex items-center gap-1 ${authButtonClass}`}
              >
                <LayoutDashboard size={18} />
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                className={logoutButtonClass}
              >
                <LogOut size={18} className="text-[#ed1c24]" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 text-sm font-semibold transition-colors shadow-xs"
            >
              <KeyRound className="w-4 h-4" /> Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
            className="lg:hidden overflow-hidden bg-white border-b border-slate-200 shadow-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base text-center font-semibold ${
                      isActive
                        ? "bg-linear-to-br from-sky-600 to-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-100">
                {isFullyOnboarded ? (
                  <div className="flex justify-center items-center">
                    <Link
                      to={dashboardHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2  ${authButtonClass}`}
                    >
                      <LayoutDashboard size={18} />
                      Go to {user.role?.role_name.toUpperCase()} Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-4 py-2 bg-red-100 rounded-full flex items-center gap-2 text-red-600 text-sm font-semibold shadow-red-500 cursor-pointer hover:shadow-xl hover:shadow-red-200 transition-all duration-300 transform hover:-translate-y-1 transform-will-change"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold text-center"
                  >
                    <KeyRound className="w-4 h-4" />
                    Staff & Doctor Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
