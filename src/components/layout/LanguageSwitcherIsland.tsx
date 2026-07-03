import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "id", label: "ID" },
  { code: "zh", label: "ZH" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher({
  isMobile = false,
  currentLangCode = "en"
}: {
  isMobile?: boolean;
  currentLangCode?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang =
    LANGUAGES.find((l) => l.code === currentLangCode) ||
    LANGUAGES[0];

  const changeLanguage = (code: string) => {
    const activeLang = currentLangCode;
    const currentLangPrefix = activeLang !== "en" ? `/${activeLang}` : "";
    const newLangPrefix = code === "en" ? "" : `/${code}`;

    let baseRoute = window.location.pathname;

    if (
      currentLangPrefix &&
      (baseRoute === currentLangPrefix ||
        baseRoute.startsWith(currentLangPrefix + "/"))
    ) {
      baseRoute = baseRoute.substring(currentLangPrefix.length);
    }
    if (!baseRoute) baseRoute = "/";

    const newPath =
      newLangPrefix +
      (baseRoute === "/" && newLangPrefix ? "" : baseRoute) +
      window.location.search +
      window.location.hash;

    window.location.href = newPath;
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div
        className="flex-1 flex relative items-center justify-center border-r border-black cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="tracking-widest text-sm font-medium">
          {currentLang.label}
        </span>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-[1px] left-[-1px] right-[-1px] bg-background border-b border-l border-r border-black flex flex-col items-center z-50"
            >
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLanguage(lang.code);
                  }}
                  className="py-2 hover:text-gray-900 active:text-gray-900 transition-colors tracking-widest font-medium text-gray-500 w-full text-center cursor-pointer text-sm"
                >
                  {lang.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className="flex relative h-full items-center justify-center border-l border-r border-black w-16 md:w-20 cursor-pointer bg-background"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="tracking-widest font-medium text-xs md:text-sm">
        {currentLang.label}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-[-1px] right-[-1px] bg-background border-b border-l border-r border-black flex flex-col items-center z-50"
          >
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                onClick={(e) => {
                  e.stopPropagation();
                  changeLanguage(lang.code);
                }}
                className="py-3 hover:text-gray-900 active:text-gray-900 transition-colors tracking-widest font-medium text-gray-500 w-full text-center cursor-pointer text-xs md:text-sm"
              >
                {lang.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
