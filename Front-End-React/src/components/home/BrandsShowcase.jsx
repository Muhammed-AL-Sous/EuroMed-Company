import { ExternalLink, Globe } from "lucide-react";
import { Link } from "react-router";
import { useGetManufacturersQuery } from "../../features/Manufacturers/ManufacturersApiSlice";

const BrandsShowcase = () => {
  const { data } = useGetManufacturersQuery();

  let initialBrands;
  if (data) {
    initialBrands = data;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-100">
            Global Partnerships
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Authorized Partner Brands
          </h2>
          <p className="text-slate-600 text-base mt-2">
            EuroMed is an authorized distributor for leading international
            manufacturers of total joint arthroplasty, trauma plates, and
            specialized surgical systems.
          </p>
        </div>

        {/* Brands Logo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBrands && initialBrands.length > 0 ? (
            initialBrands.map((brand) => (
              <div
                key={brand.id}
                className="group bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black group-hover:text-sky-600 duration-300 transition-colors tracking-tight text-slate-900 font-sans">
                      {brand.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      <Globe className="w-3 h-3 text-sky-500" /> {brand.origin}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    to={`/products?brand=${brand.id}`}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    View Implants ({brand.product_count || 12})
                  </Link>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold group-hover:text-sky-600 duration-300 transition-colors text-slate-400 hover:text-slate-900 flex items-center gap-1"
                    >
                      Official Site <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-md text-slate-900 font-semibold">
              No Brands Available , Soon ...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrandsShowcase;
