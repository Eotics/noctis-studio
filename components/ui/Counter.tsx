"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";

type Props = { value: number; decimals?: number; suffix?: string; className?: string; delay?: number };

/** Counts up to `value` when scrolled into view. The final value is server-rendered for SEO / no-JS. */
export function Counter({ value, decimals = 0, suffix = "", className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const ready = useSiteReady();
  const format = (n: number) => n.toFixed(decimals);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || prefersReducedMotion()) return;
      const state = { n: 0 };
      el.textContent = format(0);
      gsap.to(state, {
        n: value,
        duration: 2.2,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(state.n);
        },
      });
    },
    { dependencies: [ready] },
  );

  return (
    <span className={className}>
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  );
}
