import { ExternalLink, Globe } from "lucide-react";
import { Link } from "react-router";
import { useGetManufacturersQuery } from "../features/Manufacturers/ManufacturersApiSlice";

const BrandsPage = () => {
  const { data, isLoading } = useGetManufacturersQuery();
  const brands = data || [];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="mx-auto text-center max-w-5xl space-y-4">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-400 bg-sky-500/20 px-3.5 py-1.5 rounded-full border border-sky-400/30">
              International Partnerships
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Authorized Implant Brands & Manufacturers
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed tracking-wide">
              EuroMed Partners Directly With Global Leaders in Orthopedics,
              Total Joint Arthroplasty, and Trauma Hardware To Deliver Certified
              Medical Devices To Hospitals Across Iraq.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((b) => (
              <div
                key={b.id}
                className="group bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 duration-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black group-hover:text-sky-600 duration-300 transition-colors tracking-tight text-gray-600 font-sans">
                      {b.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      <Globe className="w-3.5 h-3.5 text-sky-600" /> {b.origin}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    {b.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/products?manufacturer_id=${b.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs transition-colors"
                  >
                    View Implants
                  </Link>

                  {b.website && (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
                    >
                      Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
