import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import {
  selectCurrentUser,
  selectAuthReady,
} from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { useSelector } from "react-redux";
import { ROLES_CONFIG } from "../../routes/roles.config";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const authReady = useSelector(selectAuthReady);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [logout] = useLogoutMutation();

  /* ================= Lock Body Scroll ================= */
  useLayoutEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  /* ================= Click Outside ================= */
  const handleClickOutside = useCallback(
    (event) => {
      if (
        isMobileOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMobileOpen(false);
      }
    },
    [isMobileOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  /* ================= Navigation Links ================= */
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Brands", path: "/brands" },
    { name: "Operations Details", path: "/operation-details", highlight: true },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const authButtonClass =
    "px-4 py-2 bg-linear-to-r from-[#00a6f1] to-[#00a6f4] rounded-full text-white text-sm font-semibold shadow-sky-500 cursor-pointer hover:shadow-xl hover:shadow-[#00a6f4]/30 transition-all duration-300 transform hover:-translate-y-1 transform-will-change";

  const logoutButtonClass =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold cursor-pointer hover:bg-slate-100 hover:border-slate-300 dark:hover:bg-white/10 dark:hover:border-white/10 transition-all duration-300 transform hover:-translate-y-1 transform-will-change";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.warn("Logout request failed:", error);
    }

    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const isFullyOnboarded = authReady && user;

  const dashboardHref = user
    ? `/${ROLES_CONFIG[user.role.role_name]?.prefix || "doctor"}`
    : "/";

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
        <div className="hidden md:flex items-center gap-3">
          {isFullyOnboarded ? (
            <div className="flex items-center gap-2">
              <Link
                to={dashboardHref}
                className={`inline-flex items-center gap-2 ${authButtonClass}`}
              >
                <LayoutDashboard size={18} />
                {user.name.split(" ")[0]} ({user.role.role_name})
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
            {isFullyOnboarded ? (
              <div className="space-y-2">
                <Link
                  to={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`inline-flex items-center gap-2 ${authButtonClass}`}
                >
                  <LayoutDashboard size={18} /> Go to {user.role.toUpperCase()}{" "}
                  Dashboard
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
