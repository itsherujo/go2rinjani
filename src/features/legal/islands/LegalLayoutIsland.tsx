import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import SidebarNav from "./SidebarNav";
import ProgressRuler from "./ProgressRuler";
import SelectionTooltip from "./SelectionTooltip";

/**
 * MainLayout — matches the original T component (layout-9f5999a2ad7b4424.js lines 1638-1887).
 *
 * Key behaviors from original:
 *   - data-reading-mode on root div: when true, hides left sidebar and right ruler
 *   - Mobile TOC overlay (g state): 3 layered motion.div backdrops with animated maskImage
 *     gradients (blur-xs, blur-sm, blur-md) + ruler content sliding in from x: 200%
 *   - Right sidebar ruler is hidden via AnimatePresence when readingMode is true
 *   - Left sidebar (L component) hidden when readingMode via isDesktop: b && !v
 */
interface MainLayoutProps {
  children: ReactNode;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMobileTocOpen: boolean;
  setIsMobileTocOpen: (open: boolean) => void;
  readingMode?: boolean;
}

export default function MainLayout({
  children,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMobileTocOpen,
  setIsMobileTocOpen,
  readingMode = false,
}: MainLayoutProps) {
  return (
    <div
      data-reading-mode={readingMode}
      className="relative grid min-h-screen grid-cols-5 gap-x-10 bg-bg-light/20 max-sm:grid-cols-1 md:mx-8 xl:mx-0"
      style={{ "--content-width": "752px", "--content-height": "852px" } as CSSProperties}
    >
      {/* ── Left Sidebar ── */}
      {/* Original: L component — hidden when readingMode is true (isDesktop: b && !v) */}
      <AnimatePresence>
        {!readingMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeInOut" } }}
            className="xl:static"
          >
            <SidebarNav isMobileMenuOpen={isMobileMenuOpen} />
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
            {children}
          </motion.div>
        </motion.div>
      </motion.main>

      {/* ── Right Sidebar / Progress Ruler ── */}
      {/* Original: wrapped in AnimatePresence, hidden when readingMode is true */}
      <div className="top-20 right-0 bottom-10 w-full max-w-[20vw] justify-end pl-10 lg:fixed">
        <AnimatePresence>
          {!readingMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.3, ease: "easeInOut" } }}
              className="h-full max-lg:hidden"
            >
              <ProgressRuler />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile TOC Overlay ── */}
        {/* Original: 3 layered blur backdrops with animated maskImage + ruler slides from right */}
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
                <ProgressRuler isMobileOverlay />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Selection Tooltip */}
      <SelectionTooltip />
    </div>
  );
}
