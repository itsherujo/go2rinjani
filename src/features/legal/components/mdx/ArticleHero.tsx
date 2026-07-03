import React from "react";

interface ArticleHeroProps {
  wordCount?: number;
  author?: string;
  authorLink?: string;
  title: string;
  subtitle?: string;
}

export default function ArticleHero({ wordCount, author, authorLink, title, subtitle }: ArticleHeroProps) {
  return (
    <>
      <header className="not-prose my-6 grid">
        {wordCount && (
          <p className="mt-2 text-center font-sans text-[0.625rem] text-black uppercase">
            {wordCount} words <span className="text-black/20">|</span>{" "}
            <a href={authorLink || "#"} className="hover:text-cobalt-600">
              {author}
            </a>
          </p>
        )}
        <h1 className="mt-6 text-center font-sans text-4xl tracking-tight text-black/80">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-prose text-center text-sm text-pretty text-gray-700">
            {subtitle}
          </p>
        )}
        <p className="mt-6 text-center font-sans text-[0.625rem] text-black">
          ╌╌╌╌
        </p>
      </header>
    </>
  );
}
