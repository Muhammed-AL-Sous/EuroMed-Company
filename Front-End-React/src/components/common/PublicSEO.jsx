import { useLocation } from "react-router";
import { SEO_CONFIG } from "../../config/seo.config";

const SITE_URL = import.meta.env.VITE_SITE_URL;

const PublicSEO = () => {
  const { pathname } = useLocation();

  // Normalize trailing slashes
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  const seo = SEO_CONFIG[normalizedPath] ?? {
    title: "EuroMed",
    description: "EuroMed medical products and services.",
    noIndex: true,
  };

  const canonical = SITE_URL ? new URL(normalizedPath, SITE_URL).href : null;

  return (
    <>
      <title>{seo.title}</title>

      <meta name="description" content={seo.description} />

      {seo.noIndex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        canonical && <link rel="canonical" href={canonical} />
      )}
    </>
  );
};

export default PublicSEO;
