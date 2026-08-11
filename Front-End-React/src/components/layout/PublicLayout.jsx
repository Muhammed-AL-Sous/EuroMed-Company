import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import ScrollToTopButton from "../utility/ScrollToTopButton";

const PublicLayout = () => {
  return (
    <div>
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
