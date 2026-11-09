import usePublicSEOLogic from "./usePublicSEOLogic.js";

const PublicSEO = () => {
  const { seo, canonical } = usePublicSEOLogic();

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
