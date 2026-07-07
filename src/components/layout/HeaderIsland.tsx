import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LanguageSwitcherIsland from "./LanguageSwitcherIsland";
import { openBooking } from "../../stores/booking";

export default function HeaderIsland({
  isHomePage,
  currentLangCode,
  navTranslations,
  logoUrl,
}: {
  isHomePage: boolean;
  currentLangCode: string;
  navTranslations: Record<string, string>;
  logoUrl: string;
}) {
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) {
        setIsScrolled(true);
        return;
      }
      const bigHeader = document.getElementById("big-header");
      if (bigHeader) {
        const bottom = bigHeader.getBoundingClientRect().bottom;
        setIsScrolled(bottom <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [typeof window !== 'undefined' ? window.location.pathname : '']);

  const MAIN_NAV_LINKS = ["about", "tours", "blog", "contact"];

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const getNavUrl = (link: string) => {
    const itemLangPrefix = currentLangCode !== "en" ? `/${currentLangCode}` : "";
    const baseToPath =
      link === "how-it-works"
        ? "/how-it-works"
        : link === "about"
          ? "/about"
          : link === "home"
          ? "/"
          : link === "tours"
            ? "/tours"
            : link === "blog"
              ? "/blog"
              : link === "contact"
                ? "/contact"
                : "#";
    return itemLangPrefix + (baseToPath === "/" && itemLangPrefix ? "" : baseToPath);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white flex flex-col transition-colors duration-200">
      {/* Desktop & Tablet Row (> 480px) */}
      <div className="hidden min-[481px]:flex w-full h-10 lg:h-14 items-center justify-between text-sm font-medium border-t border-b border-black bg-white relative z-10">
        {/* Desktop Left */}
        <div className="hidden lg:flex items-center h-full">
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center overflow-hidden pl-4 xl:pl-5"
              >
                <img
                  src={logoUrl}
                  alt="Go2rinjani"
                  className="h-5 mr-8 cursor-pointer"
                  onClick={() => {
                    const langPrefixPath = currentLangCode !== "en" ? `/${currentLangCode}` : "/";
                    navigateTo(langPrefixPath);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center h-full pl-4 xl:pl-5">
            <div className="flex items-center space-x-8">
              {MAIN_NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={getNavUrl(link)}
                  className="hover:opacity-60 active:opacity-60 transition-opacity uppercase tracking-widest text-black"
                >
                  {navTranslations[link]}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet Left */}
        <div className="flex lg:hidden items-center h-full border-r border-black pr-3 md:pr-4 pl-4 xl:pl-5">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 hover:opacity-60 active:opacity-60 transition-opacity h-full text-black"
          >
            <div className="w-5 h-2.5 relative flex flex-col justify-between">
              <span
                className={`w-full h-px bg-black transition-all duration-300 origin-center ${isMenuOpen ? "absolute top-1/2 -translate-y-1/2 rotate-25" : ""}`}
              ></span>
              <span
                className={`w-full h-px bg-black transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`w-full h-px bg-black transition-all duration-300 origin-center ${isMenuOpen ? "absolute top-1/2 -translate-y-1/2 -rotate-25" : ""}`}
              ></span>
            </div>
            <span className="tracking-widest text-xs uppercase">{navTranslations['menu']}</span>
          </button>
        </div>

        {/* Tablet Center Logo */}
        <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden min-[481px]:flex lg:hidden items-center justify-center overflow-hidden pointer-events-none">
          <AnimatePresence>
            {isScrolled && (
              <motion.img
                src={logoUrl}
                alt="Go2rinjani"
                className="h-4 pointer-events-auto cursor-pointer"
                onClick={() => {
                  const langPrefixPath = currentLangCode !== "en" ? `/${currentLangCode}` : "/";
                  navigateTo(langPrefixPath);
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Desktop & Tablet Right */}
        <div className="flex items-center h-full">
          <LanguageSwitcherIsland currentLangCode={currentLangCode} />

          <button
            onClick={() => openBooking()}
            className="bg-black text-white h-full pl-4 md:pl-6 pr-4 xl:pr-5 hover:bg-gray-800 active:bg-gray-800 transition-colors uppercase tracking-widest text-[11px] font-semibold"
          >
            {navTranslations['bookNow']}
          </button>
        </div>
      </div>

      {/* Mobile Top Row (<= 480px) */}
      <div className="flex min-[481px]:hidden w-full h-10 items-center justify-between px-4 border-b border-black bg-white relative z-10">
        <img 
          src={logoUrl} 
          alt="Go2rinjani" 
          className="h-5 cursor-pointer" 
          onClick={() => {
            const langPrefixPath = currentLangCode !== "en" ? `/${currentLangCode}` : "/";
            navigateTo(langPrefixPath);
          }}
        />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-3.5 relative flex flex-col justify-between"
          aria-label="Toggle menu"
        >
          <span
            className={`w-full h-px bg-black transition-all duration-300 origin-center ${isMenuOpen ? "absolute top-1/2 -translate-y-1/2 rotate-25" : ""}`}
          ></span>
          <span
            className={`w-full h-px bg-black transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`w-full h-px bg-black transition-all duration-300 origin-center ${isMenuOpen ? "absolute top-1/2 -translate-y-1/2 -rotate-25" : ""}`}
          ></span>
        </button>
      </div>

      {/* Dropdown Menu (Tablet & Mobile) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="w-full min-[481px]:w-80 lg:hidden bg-white border-b min-[481px]:border-r border-black overflow-hidden flex flex-col min-[481px]:absolute min-[481px]:top-10 min-[481px]:left-0 z-0"
          >
            {MAIN_NAV_LINKS.map((link) => (
              <a
                key={link}
                href={getNavUrl(link)}
                className="w-full py-3 px-6 border-b border-black text-center text-sm font-medium hover:bg-gray-100 active:bg-gray-100 transition-colors uppercase tracking-widest text-black"
              >
                {navTranslations[link]}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Row (<= 480px) */}
      <div className="flex min-[481px]:hidden w-full h-8 border-b border-black bg-white relative z-10">
        <LanguageSwitcherIsland isMobile={true} currentLangCode={currentLangCode} />
        <button
          onClick={() => openBooking()}
          className="flex-1 bg-black text-white flex items-center justify-center hover:bg-gray-800 active:bg-gray-800 transition-colors uppercase tracking-widest text-sm font-medium"
        >
          {navTranslations['bookNow']}
        </button>
      </div>
    </nav>
  );
}
