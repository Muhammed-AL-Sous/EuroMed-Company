import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  LayoutPanelLeft,
  Activity,
  Stethoscope,
  Hospital as HospitalIcon,
  Package,
} from "lucide-react";

import { Link } from "react-router";
import { motion } from "motion/react";

const Navbar = () => {
  /* ================= React States ================= */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    {
      name: "Home",
      path: "/",
      icon: LayoutPanelLeft,
      iconSize: 18,
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: Stethoscope,
      iconSize: 18,
    },
    {
      name: "Hospitals",
      path: "/hospitals",
      icon: HospitalIcon,
      iconSize: 18,
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
      iconSize: 18,
    },
    {
      name: "Operation Details",
      path: "/operation-details",
      icon: Activity,
      iconSize: 18,
    },
  ];

  const renderLinks = () => {
    return navLinks.map((link) => {
      const Icon = link.icon;

      return (
        <Link key={link.name} to={link.path}>
          <button
            onClick={() => setActiveTab(link.name)}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === link.name
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon size={link.iconSize} strokeWidth={2} className="shrink-0" />

            <span>{link.name}</span>
          </button>
        </Link>
      );
    });
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 text-slate-800${
        isScrolled
          ? "backdrop-blur-md shadow-md bg-white border-b border-slate-200 py-2.5"
          : "backdrop-blur-md shadow-md bg-white border-b border-slate-100 py-2.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* ================= EuroMed Logo ================= */}
        <div>
          <a href="/" className="relative">
            <img
              src="/images/EuroMed-Logo-layout.png"
              alt="EuroMed-Logo"
              className="h-13"
            />
            <div className="absolute top-0 left-0 w-2 h-2 bg-[#29a9e0] rounded-full animate-ping"></div>
          </a>
        </div>

        {/* ================= Desktop Links ================= */}
        <nav className="hidden md:flex items-center gap-6 flex-wrap justify-end overflow-x-auto py-1">
          {renderLinks()}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
