import { useState, useEffect } from "react";

export function useHeaderScroll(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrolled = window.scrollY > threshold;

    const handleScroll = () => {
      const isCurrentlyScrolled = window.scrollY > threshold;
      if (isCurrentlyScrolled !== lastScrolled) {
        setIsScrolled(isCurrentlyScrolled);
        // Play paper rubbing sound — rate 2 for stick, rate 3 for unstick
        try {
          const audio = new Audio('/sound/paper_rubbing.m4a');
          audio.volume = 0.1;
          audio.playbackRate = isCurrentlyScrolled ? 2 : 3;
          audio.play().catch(() => {});
        } catch {
          // Ignore errors
        }
        lastScrolled = isCurrentlyScrolled;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
