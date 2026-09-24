"use client";

import { createElement, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import { transitionState } from "@/components/providers/TransitionProvider";

type Props = {
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  id?: string;
  /** What gets animated. Lines are always masked. */
  by?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** Play as soon as the page is revealed instead of waiting for the element to scroll into view. */
  immediate?: boolean;
  start?: string;
};

export function TextReveal({
  as = "div",
  children,
  className,
  id,
  by = "lines",
  delay = 0,
  stagger,
  immediate = false,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready) return;
      const wait = immediate && transitionState.navigating ? 0.45 : 0;
      const trigger = immediate ? undefined : { trigger: el, start, once: true };

      if (prefersReducedMotion()) {
        gsap.from(el, { opacity: 0, duration: 0.8, delay: delay + wait, ease: "power2.out", scrollTrigger: trigger });
        return;
      }

      const split = SplitText.create(el, {
        type: by === "lines" ? "lines" : by === "words" ? "words,lines" : "chars,words,lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          const targets = by === "lines" ? self.lines : by === "words" ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: 115,
            rotate: by === "chars" ? 8 : 3,
            opacity: 0,
            transformOrigin: "0% 100%",
            duration: 1.3,
            ease: "expo.out",
            stagger: stagger ?? (by === "chars" ? 0.02 : by === "words" ? 0.04 : 0.09),
            delay: delay + wait,
            scrollTrigger: trigger,
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return createElement(as, { ref, className, id }, children);
}
