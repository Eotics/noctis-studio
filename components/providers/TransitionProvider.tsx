"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";
import styles from "./TransitionProvider.module.css";

type TransitionContextValue = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

/** True while a page transition is covering the screen — lets pages delay their entrance. */
export const transitionState = { navigating: false };

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollTo, stop, start } = useSmoothScroll();
  const overlayRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const scrollToHash = useCallback(
    (hash: string, immediate = false) => {
      const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (el) scrollTo(el, { immediate });
    },
    [scrollTo],
  );

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      if (url.pathname === window.location.pathname) {
        if (url.hash) {
          scrollToHash(url.hash);
          history.replaceState(null, "", url.hash);
        } else {
          scrollTo(0);
        }
        return;
      }
      if (busy.current) return;
      busy.current = true;
      transitionState.navigating = true;
      stop();

      const overlay = overlayRef.current;
      const reduce = prefersReducedMotion();
      const go = () => router.push(url.pathname + url.search + url.hash, { scroll: false });
      if (!overlay) return go();

      const tl = gsap.timeline({ onComplete: go });
      if (reduce) {
        tl.set(overlay, { visibility: "visible", clipPath: "inset(0% 0% 0% 0%)" }).fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none" });
      } else {
        tl.set(overlay, { visibility: "visible", opacity: 1 })
          .fromTo(overlay, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut" })
          .fromTo(overlay.querySelectorAll("[data-t-char]"), { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.03, ease: "expo.out" }, "-=0.35");
      }
    },
    [router, scrollTo, scrollToHash, stop],
  );

  // Once the new route has rendered, reveal it.
  useEffect(() => {
    if (!busy.current) return;
    const overlay = overlayRef.current;
    window.scrollTo(0, 0);
    scrollTo(0, { immediate: true });

    // Wait until the new page's layout has settled (height stable for a few frames, max 1s)
    // so ScrollTrigger and anchor targets are measured against the final layout.
    let raf = 0;
    let lastHeight = -1;
    let stableFrames = 0;
    const startedAt = performance.now();
    const waitForLayout = (onStable: () => void) => {
      const h = document.documentElement.scrollHeight;
      stableFrames = h === lastHeight ? stableFrames + 1 : 0;
      lastHeight = h;
      if (stableFrames >= 4 || performance.now() - startedAt > 1000) onStable();
      else raf = requestAnimationFrame(() => waitForLayout(onStable));
    };

    raf = requestAnimationFrame(() => {
      waitForLayout(() => {
        ScrollTrigger.refresh();
        if (window.location.hash) scrollToHash(window.location.hash, true);
        const done = () => {
          busy.current = false;
          transitionState.navigating = false;
          start();
          if (overlay) gsap.set(overlay, { visibility: "hidden" });
        };
        if (!overlay) return done();
        if (prefersReducedMotion()) {
          gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "none", onComplete: done });
        } else {
          gsap
            .timeline({ onComplete: done })
            .to(overlay.querySelectorAll("[data-t-char]"), { yPercent: -110, duration: 0.5, stagger: 0.02, ease: "expo.in" })
            .to(overlay, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.15");
        }
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, scrollTo, scrollToHash, start]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
        <span className={styles.word}>
          {"NOCTIS".split("").map((c, i) => (
            <span key={i} className={styles.mask}>
              <span data-t-char>{c}</span>
            </span>
          ))}
        </span>
        <span className={`${styles.meta} label`}>Paris — Independent studio</span>
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>");
  return ctx;
}
