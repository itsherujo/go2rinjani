import { useState, useEffect, useRef } from "react";

interface BlogHeroImageIslandProps {
  highResUrl: string;
  lowResUrl?: string;
}

export default function BlogHeroImageIsland({ highResUrl, lowResUrl }: BlogHeroImageIslandProps) {
  // If lowResUrl is not provided, try to generate one from a Sanity URL pattern or just use the highResUrl
  const initialUrl = lowResUrl || (highResUrl.includes("w=") ? highResUrl.replace(/w=\d+/, "w=64").replace(/q=\d+/, "q=10") : highResUrl);
  
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [blur, setBlur] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we couldn't generate a meaningful low-res URL, just load the high-res without blur effect
    if (initialUrl === highResUrl) {
      setBlur(false);
      return;
    }

    const img = new Image();
    img.src = highResUrl;
    img.onload = () => {
      setCurrentUrl(highResUrl);
      setBlur(false);
    };
  }, [highResUrl, initialUrl]);

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: `url(${currentUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
        filter: blur ? "blur(15px)" : "none",
        transform: blur ? "scale(1.05)" : "scale(1)",
        transition: blur
          ? "none"
          : "filter 0.25s linear 0.2s, transform 0.25s linear 0.2s",
      }}
      className="listGallery_background__2lbKq"
    ></div>
  );
}
