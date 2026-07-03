import React, { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarNav from "./SidebarNav";
import ArticleHeader from "./ArticleHeader";
import ProgressRuler from "./ProgressRuler";
import SelectionTooltip from "./SelectionTooltip";

interface LegalPageIslandProps {
  children?: ReactNode;
  section?: string;
  title?: string;
  currentSlug?: string;
  lang?: string;
}

export default function LegalPageIsland({
  children,
  section = "Legal Documents",
  title = "Terms and Conditions",
  currentSlug,
  lang,
}: LegalPageIslandProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  return (
    <>
      {/* Global SVG Filters */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="sr-only">
        <defs>
          <filter id="pixelate">
            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 9 -4"></feColorMatrix>
            <feComposite operator="in" in2="SourceGraphic"></feComposite>
            <feMorphology operator="dilate" radius="3"></feMorphology>
          </filter>
        </defs>
      </svg>

      <div
        data-reading-mode={readingMode ? "true" : "false"}
        className="relative grid min-h-screen grid-cols-5 gap-x-10 bg-bg-light/20 max-sm:grid-cols-1 md:mx-8 xl:mx-0"
        style={{ "--content-width": "752px", "--content-height": "852px" } as React.CSSProperties}
      >
        {/* ── Left Sidebar ── */}
        <AnimatePresence>
          {!readingMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeInOut" } }}
              className="xl:static"
            >
              <SidebarNav
                isMobileMenuOpen={isMobileMenuOpen}
                currentSlug={currentSlug}
                lang={lang}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <div
          data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 z-30 bg-white/10 backdrop-blur-sm transition-opacity duration-200 data-[mobile-menu-open='false']:hidden"
        ></div>

        {/* ── Main Content Area ── */}
        <motion.main
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
          data-article-content="true"
          className="col-span-full w-full max-w-5xl flex-1 xl:col-span-3 xl:col-start-2 xl:justify-self-center"
        >
          <motion.div layout className="w-full justify-self-center">
            <motion.div layout className="pt-8 lg:pt-20">
              <ArticleHeader
                toggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
                toggleMobileToc={() => setIsMobileTocOpen(prev => !prev)}
                section={section}
                title={title}
                onReadingModeChange={(val) => setReadingMode(val)}
              />
              <article
                id="main-article"
                data-reading-mode={readingMode ? "true" : "false"}
                className="prose legal-prose max-w-none @container relative mb-30 grid h-full justify-items-center rounded-xs p-8 transition-all duration-150 data-[reading-mode='true']:bg-transparent data-[reading-mode='true']:shadow-none md:bg-white md:shadow-[0px_1px_4px_1px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(0,0,0,0.50),0px_-1px_1px_1px_#FFF_inset] lg:px-16 lg:py-20"
              >
                {children}
              </article>
            </motion.div>
          </motion.div>
        </motion.main>

        {/* ── Right Sidebar / Progress Ruler ── */}
        <div className="top-20 right-0 bottom-10 w-full max-w-[23vw] justify-end pl-10 lg:fixed">
          <AnimatePresence>
            {!readingMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.3, ease: "easeInOut" } }}
                className="h-full max-lg:hidden"
              >
                <ProgressRuler section={section} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mobile TOC Overlay ── */}
          <AnimatePresence>
            {isMobileTocOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={() => setIsMobileTocOpen(false)}
              >
                {/* Backdrop layer 1: blur-xs */}
                <motion.div
                  initial={{
                    opacity: 0,
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0) 100%)",
                  }}
                  animate={{
                    opacity: 1,
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0.2) 60%, rgb(0 0 0 / 1) 100%)",
                    transition: {
                      duration: 0.4,
                      opacity: { duration: 0.2, ease: "easeInOut" },
                    },
                  }}
                  exit={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0) 100%)",
                    transition: { duration: 0.2 },
                  }}
                  className="absolute inset-0 from-white/50 to-white backdrop-blur-xs lg:hidden"
                />

                {/* Backdrop layer 2: blur-sm */}
                <motion.div
                  initial={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0) 100%)",
                  }}
                  animate={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0.2) 40%, rgb(0 0 0 / 1) 60%)",
                    transition: {
                      duration: 0.4,
                      opacity: { duration: 0.2 },
                    },
                  }}
                  exit={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0) 100%)",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 from-white/50 to-white backdrop-blur-sm lg:hidden"
                />

                {/* Backdrop layer 3: blur-md */}
                <motion.div
                  initial={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0) 100%)",
                  }}
                  animate={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0.2) 0%, rgb(0 0 0 / 1) 40%)",
                    transition: {
                      duration: 0.4,
                      opacity: { duration: 0.2 },
                    },
                  }}
                  exit={{
                    maskImage: "linear-gradient(to right, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0) 100%)",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 from-white/50 to-white backdrop-blur-md lg:hidden"
                />

                {/* Ruler content — slides in from right */}
                <motion.div
                  initial={{ opacity: 0, x: "200%" }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.4, ease: "easeInOut" },
                  }}
                  exit={{
                    opacity: 0,
                    x: "200%",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  }}
                  className="h-[90svh] w-full"
                >
                  <ProgressRuler isMobileOverlay section={section} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Selection Tooltip */}
        <SelectionTooltip />
      </div>
    </>
  );
}
