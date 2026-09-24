"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { hasWebGL } from "./webgl";

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/** Whether an element is within `rootMargin` of the viewport (pauses WebGL loops). With `once`, latches to true. */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px", once = false) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (once && entry.isIntersecting) io.disconnect();
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

/** `null` until mounted, then whether WebGL is available. */
export function useWebGLSupport() {
  return useSyncExternalStore(
    () => () => {},
    () => hasWebGL(),
    () => null,
  );
}
