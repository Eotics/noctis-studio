"use client";

import { usePathname } from "next/navigation";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Sections declare `data-theme="dark|light"`. The page background and foreground
 * morph from one to the next as the section crosses the middle of the viewport,
 * so the site reads as one continuous surface rather than stacked blocks.
 */
export function ThemeController() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const html = document.documentElement;
      const sections = getThemedSections();
      const apply = (theme: string | undefined) => {
        if (theme === "light") html.dataset.theme = "light";
        else delete html.dataset.theme;
      };
      apply(undefined);
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) apply(section.dataset.theme);
          },
        });
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}

function getThemedSections() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-theme]")).filter((el) => el !== document.documentElement);
}
