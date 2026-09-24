"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { loader } from "@/lib/ready";
import styles from "./Preloader.module.css";

const MIN_DURATION = 2100;
const MAX_WAIT = 7000;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    loader.register("fonts");
    loader.register("window");
    document.fonts.ready.then(() => loader.resolve("fonts"));
    const onLoad = () => loader.resolve("window");
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const html = document.documentElement;
      html.classList.add("is-loading");
      if (!window.location.hash) window.scrollTo(0, 0);

      const reduce = prefersReducedMotion();
      const chars = el.querySelectorAll("[data-p-char]");
      const minDuration = reduce ? 500 : MIN_DURATION;
      const startTime = performance.now();
      const state = { shown: 0 };

      if (!reduce) {
        gsap.from(chars, { yPercent: 110, duration: 1.1, stagger: 0.05, ease: "expo.out", delay: 0.1 });
        gsap.from(el.querySelectorAll("[data-p-fade]"), { opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.3, ease: "power2.out" });
      }

      const render = () => {
        const value = Math.round(state.shown);
        if (countRef.current) countRef.current.textContent = String(value).padStart(2, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${state.shown / 100})`;
        el.setAttribute("aria-valuenow", String(value));
      };

      const exit = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            html.classList.remove("is-loading");
            setDone(true);
          },
        });
        if (reduce) {
          tl.add(() => loader.setReady()).to(el, { opacity: 0, duration: 0.4, ease: "none" });
          return;
        }
        tl.to(countRef.current, { yPercent: -105, duration: 0.7, ease: "expo.in" })
          .to(chars, { yPercent: -110, duration: 0.7, stagger: 0.035, ease: "expo.in" }, "<0.05")
          .to(el.querySelectorAll("[data-p-fade]"), { opacity: 0, duration: 0.4, ease: "power2.in" }, "<")
          .to(barRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "expo.inOut" }, "<")
          .add(() => loader.setReady(), "-=0.05")
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, "<");
      };

      const tick = () => {
        const elapsed = performance.now() - startTime;
        const timeProgress = Math.min(1, elapsed / minDuration);
        const loadProgress = elapsed > MAX_WAIT ? 1 : loader.progress();
        const target = Math.min(timeProgress, 0.12 + loadProgress * 0.88) * 100;
        state.shown += (target - state.shown) * (reduce ? 1 : 0.09);
        if (target >= 100 && state.shown > 99.6) {
          state.shown = 100;
          render();
          gsap.ticker.remove(tick);
          finished.current = true;
          gsap.delayedCall(reduce ? 0 : 0.25, exit);
          return;
        }
        render();
      };
      gsap.ticker.add(tick);

      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className={styles.preloader}
      data-preloader
      role="progressbar"
      aria-label="Loading NOCTIS Studio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div className={`${styles.top} label`}>
        <span data-p-fade>NOCTIS STUDIO — ©2026</span>
        <span data-p-fade className={styles.hideSm}>
          Identities / Websites / Interactive
        </span>
        <span data-p-fade>Loading experience</span>
      </div>

      <p className={styles.word} aria-hidden="true">
        {"NOCTIS".split("").map((c, i) => (
          <span key={i} className={styles.mask}>
            <span data-p-char>{c}</span>
          </span>
        ))}
      </p>

      <div className={styles.bottom}>
        <span data-p-fade className={`label ${styles.coords}`}>
          48.8566° N
          <br />
          2.3522° E
        </span>
        <span className={styles.countMask} aria-hidden="true">
          <span ref={countRef} className={styles.count}>
            00
          </span>
        </span>
      </div>
      <span className={styles.track} aria-hidden="true">
        <span ref={barRef} className={styles.bar} />
      </span>
    </div>
  );
}
