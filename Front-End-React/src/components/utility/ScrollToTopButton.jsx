import { useEffect, useState } from "react";

// Icons
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#29a9e0] text-white shadow-lg transition-all duration-300 hover:bg-[#156587] focus:outline-none cursor-pointer ${
        showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;
