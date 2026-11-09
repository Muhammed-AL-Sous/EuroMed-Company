// Icons
import { ArrowUp } from "lucide-react";
import useScrollToTopButtonLogic from "./useScrollToTopButtonLogic.js";

const ScrollToTopButton = () => {
  const { showScrollTop, scrollToTop } = useScrollToTopButtonLogic();

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
