import LocationMap from "../components/common/LocationMap";
import BrandsShowcase from "../components/home/BrandsShowcase";
import CompanyIntro from "../components/home/CompanyIntro";
import HeroSection from "../components/home/HeroSection";
import PatientPortalCTA from "../components/home/PatientPortalCTA";
import ProductSubCategoriesGrid from "../components/home/ProductSubCategoriesGrid";
import { useGetSubCategoriesQuery } from "../features/SubCategories/SubCategoriesApiSlice";
import { motion } from "motion/react";

const HomePage = () => {
  const { data: subCategories = [] } = useGetSubCategoriesQuery();
  return (
    <div className="space-y-0">
      <HeroSection />
      <CompanyIntro />
      <ProductSubCategoriesGrid subCategories={subCategories} />
      <BrandsShowcase />
      <PatientPortalCTA />

      {/* Location Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Erbil Headquarters
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                Visit Our Main Office & Warehouse
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Serving Hospitals, Surgical Centers, and Orthopedic Surgeons
                Throughout Erbil and Kurdistan Region.
              </p>
            </div>
            <LocationMap />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
