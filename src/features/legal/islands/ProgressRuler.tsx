import React, { useState, useEffect, useRef, useCallback } from "react";
import { playSound } from "../utils/sound";

// Matches the original site's heading ID generation logic
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface Heading {
  text: string;
  level: number;
  id: string;
  yPosition: number;
}

interface ProgressRulerProps {
  isMobileOverlay?: boolean;
  section?: string;
}

export default function ProgressRuler({ isMobileOverlay = false, section = "" }: ProgressRulerProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [rulerHeight, setRulerHeight] = useState(0);
  const [progressY, setProgressY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  // Recalculate heading positions — snaps each heading's position to a 10px grid
  const calculatePositions = useCallback(() => {
    const article = document.querySelector("[data-article-content]");
    const ruler = rulerRef.current;
    if (!article || !ruler) return;

    const query = section === "Legal Documents" ? "h2" : "h2, h3";
    const headerElements = Array.from(article.querySelectorAll(query));
    const articleRect = article.getBoundingClientRect();
    const rulerRect = ruler.getBoundingClientRect();
    const articleTop = articleRect.top + window.scrollY;

    setRulerHeight(rulerRect.height);

    const newHeadings: Heading[] = headerElements.map((el) => {
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      // Subtract 48px (3rem) to account for the scroll-margin-top applied in CSS
      const relativeOffset = Math.max(0, elTop - articleTop - 48);
      const totalScrollable = articleRect.height - window.innerHeight;

      // Original formula: snap to 10px grid
      let y =
        10 *
        Math.round(
          ((relativeOffset / totalScrollable) * rulerRect.height) / 10
        );

      // Clamp within bounds
      y = Math.max(0, Math.min(y, rulerRect.height - 20));

      // Generate ID from text if the heading doesn't have one
      const headingId = el.id || slugify(el.textContent || "");
      // Set the id on the actual DOM element so anchor links work
      if (!el.id && headingId) {
        el.id = headingId;
      }

      return {
        text: el.textContent || "",
        level: parseInt(el.tagName.charAt(1)),
        id: headingId,
        yPosition: y,
      };
    });

    setHeadings(newHeadings);
  }, []);

  // Update the blue progress indicator — snaps to 10px grid
  const updateProgress = useCallback(() => {
    const article = document.querySelector("[data-article-content]");
    const ruler = rulerRef.current;
    if (!article || !ruler) return;

    const articleRect = article.getBoundingClientRect();
    const rulerRect = ruler.getBoundingClientRect();

    const scrollTop = articleRect.top;
    const articleHeight = articleRect.height;
    const viewportHeight = window.innerHeight;

    // Haven't started scrolling into article yet
    if (scrollTop > 0) {
      setProgressY(0);
      return;
    }

    const scrolled = Math.abs(scrollTop);
    const totalScrollable = articleHeight - viewportHeight;

    // Original formula: snap progress to 10px grid, clamp to (rulerHeight - 10)
    const progress =
      totalScrollable > 0 ? Math.max(0, Math.min(1, scrolled / totalScrollable)) : 0;

    const snappedY = Math.max(
      0,
      Math.min(
        10 * Math.round((progress * rulerRect.height) / 10),
        rulerRect.height - 10
      )
    );

    setProgressY(snappedY);
  }, []);

  useEffect(() => {
    // Original uses 250ms initial delay
    const timer = setTimeout(() => {
      calculatePositions();
      updateProgress();
      setIsVisible(true);
    }, 250);

    const handleResize = () => {
      calculatePositions();
      updateProgress();
    };

    const handleScroll = () => {
      updateProgress();
    };

    // Recalculate after images/fonts load or TOC events
    const handleTocRecalculate = () => {
      setTimeout(() => {
        calculatePositions();
        updateProgress();
      }, 300);
    };

    // Recalculate when all images finish loading
    const handleLoad = () => {
      setTimeout(() => {
        calculatePositions();
        updateProgress();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("tocRecalculate", handleTocRecalculate);
    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("tocRecalculate", handleTocRecalculate);
      window.removeEventListener("load", handleLoad);
    };
  }, [calculatePositions, updateProgress]);

  // Click handler for tick marks — scrolls to corresponding article position
  const handleTickClick = (tickY: number) => {
    const article = document.querySelector("[data-article-content]");
    if (!article || rulerHeight === 0) return;

    const articleRect = article.getBoundingClientRect();
    const articleTop = articleRect.top + window.scrollY;
    const totalScrollable = articleRect.height - window.innerHeight;

    window.scrollTo({
      top: articleTop + (tickY / rulerHeight) * totalScrollable,
      behavior: "smooth",
    });
  };

  // Generate ticks: [0, 10, 20, ..., (floor(height/10) - 1) * 10]
  const ticks = Array.from(
    { length: Math.floor(rulerHeight / 10) },
    (_, i) => 10 * i
  );

  // The core ruler content — shared between desktop and mobile overlay
  const rulerContent = (
    <div
      ref={rulerRef}
      data-glossary-tooltip-visible="false"
      className="group relative z-50 h-full opacity-100 transition-opacity duration-200 data-[glossary-tooltip-visible=true]:pointer-events-none data-[glossary-tooltip-visible=true]:opacity-0"
    >
      <div className="absolute inset-0">
        {/* Background Ticks — use CSS variable --position for top */}
        {ticks.map((y, i) => (
          <div
            key={`grid-${i}`}
            style={{ "--position": `${y}px` } as React.CSSProperties}
            className="group/tick absolute top-(--position) right-4 grid w-24 items-center justify-end"
          >
            <div
              className={`h-px w-2 transition-all duration-100 group-hover/tick:w-4 group-hover/tick:bg-black ${
                y < progressY ? "bg-black/10" : "bg-black/25"
              }`}
            ></div>
            <div
              className="absolute inset-x-0 h-2 cursor-pointer"
              onMouseEnter={() => playSound('/sound/sharp_click.m4a', { volume: 0.1, playbackRate: 1 })}
              onClick={() => {
                handleTickClick(y);
                playSound('/sound/sharp_click.m4a', { volume: 0.1, playbackRate: 1 });
              }}
            ></div>
          </div>
        ))}

        {/* Heading Labels — hidden by default, shown on group hover */}
        {headings.map((heading, i) => (
          <div
            key={`wrapper-${heading.id || i}`}
            className="transition-transform duration-150 hover:-translate-x-0.5"
          >
            <div
              className="absolute top-(--yPosition) right-(--indent) flex h-[12px] items-center font-sans text-xs text-black uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-sm:opacity-100"
              style={{
                "--yPosition": `${heading.yPosition - 6}px`,
                "--indent": `${(3 - heading.level) * 4 + 32}px`,
                zIndex: 10 * (heading.level < 4 ? 1 : 0),
                transitionDelay: `${50 * i}ms`,
              } as React.CSSProperties}
              onMouseDown={() => playSound('/sound/button_up.m4a', { volume: 0.1, playbackRate: 1 })}
              onMouseUp={() => playSound('/sound/button_down.m4a', { volume: 0.1, playbackRate: 1.2 })}
            >
              <a
                href={`#${heading.id}`}
                className="cursor-pointer text-right whitespace-nowrap hover:text-cobalt-600"
              >
                {heading.text}
              </a>
            </div>
          </div>
        ))}

        {/* Heading Tick Lines (solid black, width depends on level) */}
        {headings.map((heading, i) => (
          <div
            key={`line-${heading.id || i}`}
            style={{
              "--yPosition": `${heading.yPosition}px`,
              "--indent": `${(3 - heading.level) * 4 + 12}px`,
            } as React.CSSProperties}
            className="absolute top-(--yPosition) right-4 h-px w-(--indent) bg-black"
          ></div>
        ))}

        {/* Blue Progress Indicator */}
        <div
          className={`absolute right-4 z-20 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ top: `${progressY}px` }}
        >
          <div className="h-px w-4 bg-cobalt-600"></div>
          <span className="absolute top-0 -left-10 -translate-y-1/2 font-sans text-xs text-cobalt-600 transition-opacity duration-300 group-hover:opacity-0 max-sm:opacity-0">
            {Math.min(1, progressY / rulerHeight || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );

  // Mobile overlay mode — render without the outer fixed wrapper
  if (isMobileOverlay) {
    return (
      <div
        className="h-full"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {rulerContent}
      </div>
    );
  }

  // Desktop mode — original fixed wrapper
  return (
    <div className="absolute right-0 top-20 bottom-10 hidden w-full max-w-[25vw] justify-end pl-10 lg:flex lg:fixed">
      <div
        className="h-full max-lg:hidden"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {rulerContent}
      </div>
    </div>
  );
}
