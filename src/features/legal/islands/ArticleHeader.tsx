import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeaderScroll } from "../hooks/useHeaderScroll";
import { useButtonSounds } from "../hooks/useButtonSounds";
import {
  PrevIcon,
  NextIcon,
  ExpandIcon,
  ReadingModeIcon,
  MutedIcon,
  UnmutedIcon,
  TocIcon,
  SettingsIcon,
  CloseIcon
} from "../components/icons";

interface ArticleHeaderProps {
  toggleMobileMenu: () => void;
  toggleMobileToc: () => void;
  section?: string;
  title?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onReadingModeChange?: (val: boolean) => void;
  onFontScaleChange?: (val: boolean) => void;
}

export default function ArticleHeader({
  toggleMobileMenu,
  toggleMobileToc,
  section = "Legal Documents",
  title = "Terms and Conditions",
  canGoBack = true,
  canGoForward = false,
  onReadingModeChange,
  onFontScaleChange,
}: ArticleHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [isFontScaled, setIsFontScaled] = useState(false);

  const isScrolled = useHeaderScroll();
  const {
    isMuted,
    handleButtonDown,
    handleButtonUp,
    handleSoundMouseDown,
    handleSoundMouseUp,
    toggleMute
  } = useButtonSounds();

  const handleToggleFontScale = useCallback(() => {
    setIsFontScaled(prev => {
      const next = !prev;
      document.documentElement.style.setProperty(
        "--font-scale",
        next ? "1.1" : "1"
      );
      onFontScaleChange?.(next);
      return next;
    });
  }, [onFontScaleChange]);

  const handleToggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const handleToggleReadingMode = useCallback(() => {
    setReadingMode(prev => {
      const next = !prev;
      if (onReadingModeChange) onReadingModeChange(next);
      return next;
    });
  }, [onReadingModeChange]);

  const handleBack = () => {
    if (canGoBack) window.history.back();
  };

  const handleForward = () => {
    if (canGoForward) window.history.forward();
  };

  return (
    <div
      className={`sticky top-0 flex items-center gap-x-2 px-7 py-2 backdrop-blur-lg transition-all duration-200 md:-mx-8 md:px-9 md:pl-6 ${
        isScrolled
          ? "z-10 bg-[#F6F6F6]/50 from-[#F6F6F6]/0 from-5% shadow-[0px_4px_2px_-4px_rgba(0,0,0,0.1)] before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-[linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_5%,rgba(0,0,0,0.2)_95%,transparent_100%)]"
          : "bg-transparent"
      }`}
    >
      <div className="grid w-full max-w-full grid-cols-[auto_1fr_auto] items-center gap-x-2">

        <div className="grid grid-cols-2 items-center max-md:grid-cols-1">
          <span className="leading-0">
            <button
              disabled={!canGoBack}
              onClick={handleBack}
              onMouseDown={handleButtonDown}
              onMouseUp={handleButtonUp}
              className="disabled:cursor-not-allowed disabled:opacity-50 grid size-6 items-center justify-center text-black hover:text-cobalt-600 max-md:hidden"
              aria-label="Go back"
            >
              <PrevIcon />
            </button>
          </span>
          <span className="leading-0">
            <button
              disabled={!canGoForward}
              onClick={handleForward}
              onMouseDown={handleButtonDown}
              onMouseUp={handleButtonUp}
              className="disabled:cursor-not-allowed disabled:opacity-50 grid size-6 items-center justify-center text-black hover:text-cobalt-600 max-md:hidden"
              aria-label="Go forward"
            >
              <NextIcon />
            </button>
          </span>
          <span className="leading-0">
            <button
              className="disabled:cursor-not-allowed disabled:opacity-50 grid size-6 items-center justify-center text-black hover:text-cobalt-600 md:hidden"
              onClick={toggleMobileMenu}
              onMouseDown={handleButtonDown}
              onMouseUp={handleButtonUp}
              aria-label="Toggle menu"
            >
              <ExpandIcon />
            </button>
          </span>
        </div>

        <h5 className="truncate font-sans text-[0.6875rem] text-black/40 uppercase">
          <span className="hover:text-cobalt-600 max-sm:hidden">
            {section} /
          </span>{" "}
          <span
            data-settings-open={isSettingsOpen}
            className="text-black"
          >
            {title?.replace(/\.$/, "")}
          </span>
        </h5>

        <div className="flex items-center gap-x-4">
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  columnGap: "calc(var(--spacing) * 2)",
                  marginRight: "calc(var(--spacing) * -2)",
                }}
                animate={{
                  opacity: 1,
                  columnGap: "calc(var(--spacing) * 4)",
                  marginRight: 0,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  columnGap: "calc(var(--spacing) * 2)",
                  marginRight: "calc(var(--spacing) * -2)",
                  transition: { duration: 0.15 },
                }}
                className="flex items-center"
              >
                <button
                  onClick={handleToggleReadingMode}
                  onMouseDown={handleButtonDown}
                  onMouseUp={handleButtonUp}
                  className="size-6 text-black hover:text-cobalt-600 max-md:hidden"
                  data-active={readingMode ? "true" : "false"}
                  aria-label={readingMode ? "Exit Reading Mode" : "Enter Reading Mode"}
                >
                  <ReadingModeIcon readingMode={readingMode} />
                </button>

                <button
                  onMouseDown={handleSoundMouseDown}
                  onMouseUp={handleSoundMouseUp}
                  onClick={toggleMute}
                  data-muted={isMuted}
                  className="size-5 text-black transition-colors hover:text-cobalt-600"
                  aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                >
                  {isMuted ? <MutedIcon /> : <UnmutedIcon />}
                </button>

                <button
                  onClick={handleToggleFontScale}
                  onMouseDown={handleButtonDown}
                  onMouseUp={handleButtonUp}
                  className="visible size-5"
                  aria-label={isFontScaled ? "Reset Font Size" : "Scale Font Size"}
                >
                  <p
                    data-scaled={isFontScaled}
                    className="font-sans text-xs text-black transition-transform duration-150 data-[scaled='true']:scale-120"
                  >
                    Ab
                  </p>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="leading-0">
            <button
              data-settings-open={isSettingsOpen}
              onClick={toggleMobileToc}
              onMouseDown={handleButtonDown}
              onMouseUp={handleButtonUp}
              className="disabled:cursor-not-allowed disabled:opacity-50 grid size-6 items-center justify-center text-black hover:text-cobalt-600 data-[settings-open='true']:hidden lg:hidden"
              aria-label="Table of Contents"
            >
              <TocIcon />
            </button>
          </span>

          <div className="flex items-center">
            <span className="leading-0">
              <button
                data-settings-open={isSettingsOpen}
                onClick={handleToggleSettings}
                onMouseDown={handleButtonDown}
                onMouseUp={handleButtonUp}
                className="disabled:cursor-not-allowed disabled:opacity-50 size-5 text-black hover:text-cobalt-600 data-[settings-open='true']:hidden"
                aria-label="Settings"
              >
                <SettingsIcon />
              </button>
            </span>
            <span className="leading-0">
              <button
                data-settings-open={isSettingsOpen}
                onClick={handleToggleSettings}
                onMouseDown={handleButtonDown}
                onMouseUp={handleButtonUp}
                className="disabled:cursor-not-allowed disabled:opacity-50 visible size-5 text-black hover:text-cobalt-600 data-[settings-open='false']:hidden"
                aria-label="Close Settings"
              >
                <CloseIcon />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
