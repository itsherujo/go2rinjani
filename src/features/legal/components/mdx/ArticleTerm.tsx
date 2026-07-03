import React from "react";

interface ArticleTermProps {
  id: string;
  termId: string;
  children: React.ReactNode;
  superscript?: string;
}

export default function ArticleTerm({ id, termId, children, superscript }: ArticleTermProps) {
  return (
    <>
      <a
        id={termId}
        href={`#${id}`}
        className="cursor-help scroll-mt-16 font-normal text-black underline decoration-black/50 decoration-dotted underline-offset-2 hover:text-cobalt-600 target:animate-highlight target:-mx-1 target:rounded-sm target:bg-yellow-200/75 target:px-1 target:decoration-yellow-600/50"
      >
        {children}
        {superscript && (
          <sup className="ml-0.5 align-super font-sans text-[0.6em]">
            {superscript}
          </sup>
        )}
      </a>
    </>
  );
}
