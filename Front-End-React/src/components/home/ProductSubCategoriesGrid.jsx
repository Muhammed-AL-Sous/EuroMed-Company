import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

import bipolar from "../../assets/images/categories/bipolar.png";
import totalHip from "../../assets/images/categories/T-Hip.png";

//  Get icon according to sub-category code

const getSubCategoryIcon = (code) => {
  switch (code) {
    case "TK":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3em"
          height="3em"
          viewBox="0 0 512 512"
          aria-hidden="true"
        >
          <path
            fill="#0084d1"
            d="M22.91 15.15v55.19C52.94 91.19 99.09 120.3 139.7 148.4c21.1 14.6 40.7 28.9 55.7 41.8c15.1 12.8 26.1 23 29.5 35.7l.3 1v1c.4 15.2 3.7 25.2 7.9 31.2s9.1 8.6 15.6 9.5c12.9 1.9 32.2-6 47.3-19.2c15-13.2 25-30.9 24.2-44.2c-.4-6.6-2.9-12.4-9.4-18.1c-6.4-5.7-17.3-11.1-33.9-14.6c-12-2.5-27.8-11.4-49.3-24.3c-21.5-12.8-47.5-29.5-74.5-47.2c-47.4-31.24-96.84-64.79-130.19-85.85M191.9 18c17.6 11.41 48.1 31.99 79.9 57.23C320.7 114 371.4 164.4 380.7 202.2v.1c2.4 10 3.5 36.8 2.8 69.2c-.7 32.3-2.7 70.9-5.2 108c-3 45.2-6.6 87.9-8.9 114.5h18.1c2.3-26.8 5.8-68.8 8.8-113.3c2.4-37.2 4.5-76 5.2-108.9c.7-32.8.4-58.8-3.4-73.8v-.1C386.3 150 332.9 100.7 283 61.12C261.8 44.31 241.1 29.51 224.3 18z"
          />
        </svg>
      );

    case "TH":
      return (
        <img
          src={totalHip}
          alt="Total Hip"
          className="w-12 h-12 object-contain"
        />
      );

    case "BP":
      return (
        <img src={bipolar} alt="Bipolar" className="w-12 h-12 object-contain" />
      );

    case "PS":
      return (
        <div className="flex items-center justify-center gap-1">
          <Package className="w-8 h-8 text-[#0084d1]" />
          <Package className="w-8 h-8 text-[#0084d1]" />
        </div>
      );

    case "TN":
      return <Package className="w-9 h-9 text-[#0084d1]" />;

    case "HS":
      return <Package className="w-9 h-9 text-[#0084d1]" />;

    case "CB":
      return <Package className="w-9 h-9 text-[#0084d1]" />;

    case "FN":
      return <Package className="w-9 h-9 text-[#0084d1]" />;

    default:
      return <Package className="w-8 h-8 text-[#0084d1]" />;
  }
};

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
              High-precision surgical hardware and joint replacement systems
              engineered for long-term clinical efficacy.
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
        {subCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {subCategories.map((subCategory, index) => (
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
                        {getSubCategoryIcon(subCategory.code)}
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
            ))}
          </div>
        ) : (
          /* ================= Empty State ================= */
          <div className="py-12 text-center">
            <Package className="w-10 h-10 mx-auto text-slate-400 mb-3" />

            <p className="text-slate-900 font-semibold">
              No Product Categories Available
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Product categories will be available soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSubCategoriesGrid;
