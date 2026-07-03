import React from "react";

interface ArticleImageProps {
  src: string;
  srcSet?: string;
  alt: string;
  width?: string;
  height?: string;
  sizes?: string;
}

export default function ArticleImage({ src, srcSet, alt, width, height, sizes }: ArticleImageProps) {
  // Extract actual URL if it's wrapped in a Next.js /_next/image path
  const getActualSrc = (source: string): string => {
    if (!source) return "";
    if (source.startsWith("/_next/image")) {
      try {
        const urlParam = new URLSearchParams(source.split("?")[1]).get("url");
        if (urlParam) {
          return urlParam.startsWith("http") ? urlParam : `https://makingsoftware.com${urlParam}`;
        }
      } catch {
        return source;
      }
    }
    return source;
  };

  const getActualSrcSet = (sourceSet?: string): string | undefined => {
    if (!sourceSet) return undefined;
    return sourceSet
      .split(",")
      .map((item) => {
        const [url, size] = item.trim().split(/\s+/);
        if (!url) return "";
        return `${getActualSrc(url)} ${size || ""}`.trim();
      })
      .filter(Boolean)
      .join(", ");
  };

  const actualSrc = getActualSrc(src);
  const actualSrcSet = getActualSrcSet(srcSet);

  return (
    <div className="not-prose -mx-8 mt-6">
      <figure>
        <div className="grid min-w-full items-start gap-2 overflow-x-auto px-4 max-md:snap-x max-md:snap-proximity max-md:auto-cols-[100%] max-md:grid-flow-col max-md:overflow-x-scroll md:grid-cols-2">
          <div
            data-span-full="true"
            className="col-span-1 h-full max-w-full max-md:snap-start max-md:snap-normal max-md:scroll-ml-2 md:data-[span-full=true]:last:col-span-2"
          >
            <div className="min-w-full cursor-pointer border border-transparent transition-all duration-300 hover:border-black/10">
              <span className="leading-0">
                <img
                  alt={alt}
                  loading="lazy"
                  width={(width as any) || 2400}
                  height={(height as any) || 1166}
                  decoding="async"
                  data-nimg="1"
                  className="h-auto object-contain"
                  sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 2400px"}
                  srcSet={actualSrcSet}
                  src={actualSrc}
                  style={{ color: "transparent" }}
                />
              </span>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
