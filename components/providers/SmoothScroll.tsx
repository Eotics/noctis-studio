"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { loader } from "@/lib/ready";

type ScrollTarget = string | number | HTMLElement;
type ScrollOptions = { immediate?: boolean; offset?: number; onComplete?: () => void };

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: ScrollTarget, options?: ScrollOptions) => void;
  stop: () => void;
  start: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Locked while the preloader is on screen, released the moment it hands over.
    if (!loader.isReady()) instance.stop();
    const unsubscribe = loader.subscribe(() => {
      if (loader.isReady() && instance.isStopped && !document.documentElement.classList.contains("is-locked")) instance.start();
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: ScrollTarget, options: ScrollOptions = {}) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (el === null) return;
      if (lenis) {
        // Starting Lenis resets any running animation, so unlock before scrolling, not after.
        if (lenis.isStopped) {
          lenis.start();
          document.documentElement.classList.remove("is-locked");
        }
        lenis.scrollTo(el, {
          offset: options.offset ?? 0,
          immediate: options.immediate,
          duration: 1.2,
          easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
          force: true,
          onComplete: options.onComplete,
        });
        return;
      }
      const top = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
      window.scrollTo({ top, behavior: options.immediate || prefersReducedMotion() ? "auto" : "smooth" });
      options.onComplete?.();
    },
    [lenis],
  );

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      lenis,
      scrollTo,
      stop: () => {
        lenis?.stop();
        document.documentElement.classList.add("is-locked");
      },
      start: () => {
        lenis?.start();
        document.documentElement.classList.remove("is-locked");
      },
    }),
    [lenis, scrollTo],
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScroll>");
  return ctx;
}
