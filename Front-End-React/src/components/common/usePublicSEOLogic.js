import { useLocation } from "react-router";
import { SEO_CONFIG } from "../../config/seo.config";
const usePublicSEOLogic = () => {
  const SITE_URL = import.meta.env.VITE_SITE_URL;
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const seo = SEO_CONFIG[normalizedPath] ?? {
    title: "EuroMed",
    description: "EuroMed medical products and services.",
    noIndex: true,
  };
  const canonical = SITE_URL ? new URL(normalizedPath, SITE_URL).href : null;
  return {
    seo,
    canonical,
  };
};
export default usePublicSEOLogic;
