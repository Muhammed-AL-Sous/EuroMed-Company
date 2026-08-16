import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import ScrollToTopButton from "../utility/ScrollToTopButton";
import ScrollToTop from "../utility/ScrollToTop";

const PublicLayout = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />

      <main className="relative z-10 overflow-hidden">
        <Outlet />
      </main>

      <ScrollToTopButton />

      <Footer />
    </div>
  );
};

export default PublicLayout;
