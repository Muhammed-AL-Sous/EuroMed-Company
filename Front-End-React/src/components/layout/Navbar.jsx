import { KeyRound, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
// import { logout } from "../../store/slices/authSlice.js";
import { motion } from "motion/react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { user, isAuthenticated } = useSelector((state) => state.auth);
  const user = true;
  const isAuthenticated = true;
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Hospitals", path: "/hospitals" },
    { name: "Operations Details", path: "/operation-details", highlight: true },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    // dispatch(logout());
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "doctor") return "/doctor/dashboard";
    return "/staff/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium text-white">
              Erbil HQ & Regional Distribution Center :
            </span>
            <span className="hidden sm:inline text-slate-400">
              Koya Road, Hewa City, Zone A, Building 142
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline font-mono text-sky-400">
              +964 750 376 9545
            </span>
            <Link
              to="/operation-details"
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
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
          <motion.div
            whileHover={{
              scale: [null, 1.1, 1.2],
              transition: {
                duration: 0.5,
                times: [0, 0.6, 1],
                ease: ["easeInOut", "easeOut"],
              },
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-sky-500 to-slate-900 flex items-center justify-center">
              <img
                src="/images/Euromed-logo-icon.png"
                alt="EuroMed-Logo"
                className="w-6 h-6 text-sky-300"
              />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-600 tracking-tight flex items-center gap-0.5">
              Euro<span className="text-sky-600">Med</span>
            </span>

            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 mt-1">
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
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-br from-sky-600 to-slate-900 text-white text-sm font-semibold transition-colors shadow-xs"
              >
                <User className="w-4 h-4 text-sky-400" />{" "}
                {/* {user.name.split(" ")[0]} ({user.role}) */}
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2.5 cursor-pointer rounded-xl bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 text-sm font-semibold transition-colors shadow-xs"
            >
              <KeyRound className="w-4 h-4" /> Staff Login
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
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold ${
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
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold text-center"
                >
                  <User className="w-4 h-4 text-sky-400" /> Go to{" "}
                  {user.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-center"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold text-center"
              >
                <KeyRound className="w-4 h-4" /> Staff & Doctor Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
