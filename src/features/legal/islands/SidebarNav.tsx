import React from "react";
import { navigationData, type NavSection } from "../data/navigation";

interface SidebarNavProps {
  isMobileMenuOpen: boolean;
  currentSlug?: string;
  lang?: string;
}

export default function SidebarNav({ isMobileMenuOpen, currentSlug, lang }: SidebarNavProps) {
  const getLegalUrl = (slug: string) => {
    if (!lang || lang === "en") return `/legal/${slug}/`;
    return `/${lang}/legal/${slug}/`;
  };

  const homeUrl = !lang || lang === "en" ? "/" : `/${lang}/`;

  return (
    <nav
      data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
      className="fixed left-0 top-0 z-40 h-dvh w-72 bg-bg-light transition-transform duration-300 data-[mobile-menu-open='false']:max-xl:-translate-x-full data-[mobile-menu-open='true']:border-r data-[mobile-menu-open='true']:border-black/10 sm:h-full xl:static xl:w-auto xl:translate-x-0 xl:bg-transparent xl:block"
    >
      <div className="sticky top-0 max-h-dvh w-full overflow-y-auto pt-10 pb-30 pl-8 font-sans text-xs scrollbar-hide">
        <a
          className="font-sans text-base text-(--color-cobalt-600) uppercase hover:opacity-75 block"
          href={homeUrl}
        >
          Go2Rinjani
        </a>

        <ol className="list-decimal pl-6 mt-10 toc">
          {navigationData.map((section: NavSection) => (
            <div key={section.id} className={section.id > 1 ? "mt-6" : ""}>
              <li className="font-sans uppercase">
                <span className="hover:text-(--color-cobalt-600)">
                  {section.title.replace(/^\d+\.\s*/, '')}
                </span>
              </li>

              <div className="mt-4 pl-2">
                {section.items.map((item, idx) => (
                  <ul key={idx} className="list-disc items-baseline">
                    <li
                      className="cursor-pointer text-xs/6 decoration-cobalt-600/40 decoration-1 underline-offset-2 [text-decoration-skip-ink:all] marker:text-[10px] hover:text-(--color-cobalt-600) hover:underline data-[active=true]:text-(--color-cobalt-600)"
                      data-active={currentSlug === item.slug ? "true" : "false"}
                    >
                      <span className="leading-0">
                        <a href={getLegalUrl(item.slug)}>{item.name}</a>
                      </span>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </ol>
      </div>
    </nav>
  );
}
