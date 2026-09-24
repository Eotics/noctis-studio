"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Tiny loading registry shared by the preloader and heavy components (fonts, WebGL…).
 * The preloader waits for every registered task (or a timeout) before revealing the site.
 */
type Listener = () => void;

const tasks = new Map<string, boolean>();
const listeners = new Set<Listener>();
let ready = false;

const emit = () => listeners.forEach((l) => l());

export const loader = {
  register(id: string) {
    if (!tasks.has(id)) tasks.set(id, false);
    emit();
  },
  resolve(id: string) {
    tasks.set(id, true);
    emit();
  },
  progress() {
    if (tasks.size === 0) return 1;
    let done = 0;
    tasks.forEach((v) => (done += v ? 1 : 0));
    return done / tasks.size;
  },
  setReady() {
    if (ready) return;
    ready = true;
    document.documentElement.dataset.ready = "true";
    emit();
  },
  isReady: () => ready,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useSiteReady() {
  return useSyncExternalStore(loader.subscribe, loader.isReady, () => false);
}

/** Runs `callback` once, as soon as the preloader hands over to the page. */
export function useOnReady(callback: () => void | (() => void)) {
  const isReady = useSiteReady();
  useEffect(() => {
    if (!isReady) return;
    return callback();
  }, [isReady]);
}
