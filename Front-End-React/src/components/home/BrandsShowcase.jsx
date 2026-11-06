import { ExternalLink, Globe } from "lucide-react";
import { Link } from "react-router";
import { useGetManufacturersQuery } from "../../features/manufacturers/ManufacturersApiSlice";
import { motion } from "motion/react";

const BrandsShowcase = () => {
  const { data } = useGetManufacturersQuery();

  const Brands = data?.manufacturers || [];

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
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            EuroMed is an Authorized Distributor For Leading International
            Manufacturers of Total Joint Arthroplasty, Trauma Plates, and
            Specialized Surgical Systems.
          </p>
        </div>

        {/* Brands Logo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-8">
          {Brands.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: (idx % 3) * 0.1,
                ease: "easeOut",
              }}
              className="
        group
        h-full
        flex flex-col
        bg-slate-50 hover:bg-white
        p-6 rounded-2xl
        border border-slate-200/80
        shadow-xs hover:shadow-xl
        hover:border-sky-300
        transition-[background-color,border-color,box-shadow]
        duration-300
      "
            >
              {/* Brand Information */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-2xl font-black group-hover:text-sky-600 transition-colors duration-300 tracking-tight text-gray-600">
                    {b.name}
                  </span>

                  <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                    {b.origin}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  {b.description}
                </p>
              </div>

              {/* Brand Footer */}
              <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <Link
                  to={`/products?manufacturer_id=${b.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs transition-colors"
                >
                  View Implants ( {b.products_count || 0} )
                </Link>

                {b.website && (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
                  >
                    Website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsShowcase;
