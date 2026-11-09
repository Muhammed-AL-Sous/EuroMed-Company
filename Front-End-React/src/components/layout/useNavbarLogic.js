import { useLocation, useNavigate } from "react-router";
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

const useNavbarLogic = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const authReady = useSelector(selectAuthReady);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [logout] = useLogoutMutation();

  useLayoutEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

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

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Brands",
      path: "/brands",
    },
    {
      name: "Operations Details",
      path: "/operation-details",
      highlight: true,
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "About Us",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const authButtonClass =
    "px-4 py-2 bg-linear-to-r from-[#00a6f1] to-[#00a6f4] rounded-full text-white text-sm font-semibold shadow-sky-500 cursor-pointer hover:shadow-xl hover:shadow-[#00a6f4]/30 transition-all duration-300 transform hover:-translate-y-1 transform-will-change";

  const logoutButtonClass =
    "inline-flex items-center gap-2 px-2 py-2 rounded-full border border-slate-300 dark:border-white/20 text-gray-800 dark:text-white text-sm font-semibold cursor-pointer hover:bg-slate-100 hover:border-slate-300 dark:hover:bg-white/10 dark:hover:border-white/10 transition-all duration-300 transform hover:-translate-y-1 transform-will-change";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.warn("Logout request failed:", error);
    }
    setMobileMenuOpen(false);
    navigate("/login", {
      replace: true,
    });
  };

  const isFullyOnboarded = authReady && user;

  const dashboardHref = user
    ? `/${ROLES_CONFIG[user.role.role_name]?.prefix || "doctor"}`
    : "/";

  return {
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
  };
};

export default useNavbarLogic;
