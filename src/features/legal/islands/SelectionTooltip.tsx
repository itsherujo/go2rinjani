import React, { useState, useEffect } from "react";

export default function SelectionTooltip() {
  const [selectionCount, setSelectionCount] = useState(0);

  useEffect(() => {
    const handleSelection = () => {
      const selection = document.getSelection();
      const text = selection ? selection.toString().trim() : "";

      if (text.length > 0) {
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        setSelectionCount(words);
      } else {
        setSelectionCount(0);
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    // Backup for some browsers/contexts
    document.addEventListener("mouseup", handleSelection);

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  if (selectionCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="relative bg-linear-to-t from-white px-6 pt-20 pb-8 max-sm:pb-12 pointer-events-auto">
        {/* Glass Backdrop Layers */}
        <div
          className="pointer-events-none absolute inset-0 backdrop-blur-lg"
          style={{ maskImage: 'linear-gradient(to top, black 25%, transparent)', WebkitMaskImage: 'linear-gradient(to top, black 25%, transparent)' } as React.CSSProperties}
        ></div>
        <div
          className="pointer-events-none absolute inset-0 backdrop-blur-md"
          style={{ maskImage: 'linear-gradient(to top, black 10%, transparent)', WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent)' } as React.CSSProperties}
        ></div>

        {/* Content Container */}
        <div className="relative flex items-center justify-center">
          <p className="flex items-center gap-x-2 font-sans text-[0.625rem] leading-none whitespace-nowrap text-black uppercase tracking-widest">
            <span className="font-bold">{selectionCount} {selectionCount === 1 ? 'word' : 'words'} selected</span>
            <span className="text-black/30">|</span>
            <button className="cursor-pointer font-bold text-black transition-colors hover:text-cobalt-600">
              Feedback/Issue?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
