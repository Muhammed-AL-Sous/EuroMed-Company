import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

const ProductSubCategoriesGrid = ({ subCategories = [] }) => {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= Header ================= */}
        <div className="mb-12">
          <div className="text-center">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              Orthopedic Materials
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Main Product Categories
            </h2>

            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              High-Precision Surgical Hardware and Joint Replacement Systems
              Engineered For Long-Term Clinical Efficacy.
            </p>
          </div>

          {/* Catalog Link */}
          <div className="w-full flex justify-end mt-5">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-bold text-sky-600 hover:text-sky-700 hover:underline text-sm"
            >
              Browse Full Product Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ================= Sub Categories Grid ================= */}
        {subCategories?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {(Array.isArray(subCategories) ? subCategories : []).map(
              (subCategory, index) => (
                <motion.div
                  key={subCategory.id}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="h-full"
                >
                  <Link
                    to={`/products?subcategory_id=${subCategory.id}`}
                    className="
                    group
                    h-full
                    bg-white
                    p-6
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-xs
                    hover:shadow-xl
                    hover:border-sky-300
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    flex
                    flex-col
                    justify-between
                  "
                  >
                    {/* ================= Card Content ================= */}
                    <div>
                      {/* Icon + Product Count */}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="
                          w-12
                          h-12
                          rounded-xl
                          bg-sky-50
                          text-sky-600
                          flex
                          items-center
                          justify-center
                          shadow-xs
                        "
                        >
                          <img
                            src={
                              subCategory.image_url || "/images/placeholder.png"
                            }
                            alt={subCategory.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>

                        <span
                          className="
                          text-xs
                          font-mono
                          font-bold
                          bg-slate-100
                          text-slate-600
                          px-2.5
                          py-1
                          rounded-md
                        "
                        >
                          {subCategory.product_count ?? 0} Products
                        </span>
                      </div>

                      {/* Name */}
                      <h3
                        className="
                        text-xl
                        font-bold
                        text-slate-900
                        group-hover:text-sky-600
                        transition-colors
                      "
                      >
                        {subCategory.name}
                      </h3>

                      {/* Description */}
                      {subCategory.description && (
                        <p
                          className="
                          text-slate-500
                          text-xs
                          sm:text-sm
                          mt-2
                          leading-relaxed
                        "
                        >
                          {subCategory.description}
                        </p>
                      )}
                    </div>

                    {/* ================= Card Footer ================= */}
                    <div
                      className="
                      mt-6
                      pt-4
                      border-t
                      border-slate-100
                      flex
                      items-center
                      justify-between
                      text-xs
                      font-bold
                      text-sky-600
                    "
                    >
                      <span>View Products</span>

                      <ArrowRight
                        className="
                        w-4
                        h-4
                        group-hover:translate-x-1
                        transition-transform
                      "
                      />
                    </div>
                  </Link>
                </motion.div>
              ),
            )}
          </div>
        ) : (
          /* ================= Empty State ================= */
          <div className="py-12 text-center">
            <Package className="w-10 h-10 mx-auto text-slate-400 mb-3" />

            <p className="text-slate-900 font-semibold">
              No Product Categories Available
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Product Categories Will Be Available Soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSubCategoriesGrid;
