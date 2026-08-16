import BrandsShowcase from "../components/home/BrandsShowcase";
import CompanyIntro from "../components/home/CompanyIntro";
import HeroSection from "../components/home/HeroSection";
import PatientPortalCTA from "../components/home/PatientPortalCTA";
import ProductCategoriesGrid from "../components/home/ProductCategoriesGrid";

const HomePage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CompanyIntro />
      <ProductCategoriesGrid />
      <BrandsShowcase />
      <PatientPortalCTA />
    </div>
  );
};

export default HomePage;
