"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { loader, useSiteReady } from "@/lib/ready";
import { heroState } from "@/lib/sceneState";
import { useInView, useReducedMotion, useWebGLSupport } from "@/lib/hooks";
import { SceneFallback } from "@/components/3d/SceneFallback";
import styles from "./Hero.module.css";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false });

const LINES = [
  { text: "We design", className: styles.l1 },
  { text: "Digital", className: styles.l2 },
  { text: "Experiences", className: styles.l3 },
];

/**
 * Hero + whatever follows it (the intro) share one "stage": the WebGL crystal stays
 * pinned behind both, so the transition from one to the other is a single movement.
 */
export function Hero({ children }: { children?: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const stageVisible = useInView(stageRef, "0px");

  useEffect(() => {
    if (webgl) loader.register("scene");
  }, [webgl]);

  // Entrance, synchronised with the end of the preloader.
  useGSAP(
    () => {
      if (!ready) return;
      const reduce = prefersReducedMotion();
      if (reduce) {
        heroState.enter = 1;
        gsap.from("[data-hero-fade], [data-hero-line]", { opacity: 0, duration: 0.8, stagger: 0.05 });
        return;
      }
      const splits = gsap.utils.toArray<HTMLElement>("[data-hero-line]").map((line) => SplitText.create(line, { type: "chars", charsClass: "char" }));
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(heroState, { enter: 1, duration: 2.6, ease: "expo.out" }, 0);
      splits.forEach((split, i) => {
        tl.from(split.chars, { yPercent: 110, rotate: 7, transformOrigin: "0% 100%", duration: 1.5, stagger: 0.035, ease: "expo.out" }, 0.1 + i * 0.12);
      });
      tl.from("[data-hero-fade]", { opacity: 0, y: 18, duration: 1.2, stagger: 0.08, ease: "expo.out" }, 0.7);
      tl.from("[data-hero-rule]", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.4);
      return () => splits.forEach((s) => s.revert());
    },
    { scope: heroRef, dependencies: [ready], revertOnUpdate: true },
  );

  // Scroll choreography: the title breaks apart, the crystal grows then slides aside for the intro.
  useGSAP(
    () => {
      const hero = heroRef.current;
      const stage = stageRef.current;
      if (!hero || !stage || !ready) return;

      const mm = gsap.matchMedia();
      mm.add({ full: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" }, (ctx) => {
        const { full, desktop } = ctx.conditions as { full: boolean; desktop: boolean };
        if (!full) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              heroState.scroll = self.progress;
            },
          },
        });
        tl.to("[data-l='1']", { xPercent: desktop ? -38 : -30, opacity: 0, duration: 0.8 }, 0)
          .to("[data-l='2']", { xPercent: desktop ? 42 : 30, opacity: 0, duration: 0.8 }, 0.05)
          .to("[data-l='3']", { scale: desktop ? 0.42 : 0.6, yPercent: desktop ? -120 : -80, letterSpacing: "0.02em", duration: 0.9 }, 0)
          .to("[data-l='3']", { opacity: 0, duration: 0.25 }, 0.75)
          .to("[data-hero-fade]", { opacity: 0, y: -40, duration: 0.3, stagger: 0.02 }, 0)
          .to("[data-hero-rule]", { scaleX: 0, transformOrigin: "right center", duration: 0.4 }, 0)
          .to("[data-glow]", { scale: 1.8, opacity: 0.9, duration: 1 }, 0);

        const next = stage.querySelector("[data-stage-next]");
        if (next) {
          ScrollTrigger.create({
            trigger: next,
            start: "top bottom",
            end: "bottom 40%",
            scrub: true,
            onUpdate: (self) => {
              heroState.intro = self.progress;
            },
          });
          gsap.to("[data-canvas]", {
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: next, start: "bottom 95%", end: "bottom 30%", scrub: true },
          });
        }
        return () => {
          heroState.scroll = 0;
          heroState.intro = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: stageRef, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div ref={stageRef} className={styles.stage}>
      <div className={styles.canvasWrap} data-canvas aria-hidden="true">
        <div className={styles.glow} data-glow />
        {webgl === true && <HeroScene active={stageVisible} reduced={reduced} />}
        {webgl === false && <SceneFallback />}
      </div>

      <section ref={heroRef} className={styles.hero} data-theme="dark" aria-labelledby="hero-title">
        <div className={styles.sticky}>
          <div className={styles.top}>
            <p data-hero-fade className={`label ${styles.kicker}`}>
              <span className={styles.accentDot} aria-hidden="true" />
              Independent creative studio — Paris
            </p>
            <p data-hero-fade className={styles.intro}>
              Identities, websites and interactive worlds for brands that refuse to be forgettable.
            </p>
          </div>

          <h1 id="hero-title" className={styles.title}>
            <span className="sr-only">We design digital experiences that people remember.</span>
            {LINES.map((line, i) => (
              <span key={line.text} className={`${styles.line} ${line.className}`} data-l={i + 1} aria-hidden="true">
                <span className={styles.mask}>
                  <span data-hero-line className={styles.lineText}>
                    {line.text}
                  </span>
                </span>
                {i === 1 && (
                  <span data-hero-fade className={`label ${styles.annotation}`}>
                    (01) — That people
                    <br />
                    remember
                  </span>
                )}
              </span>
            ))}
          </h1>

          <div className={styles.bottom}>
            <span data-hero-rule className={`rule ${styles.rule}`} aria-hidden="true" />
            <p data-hero-fade className="label muted">
              Est. 2014
            </p>
            <p data-hero-fade className={`label ${styles.cue}`}>
              Scroll to explore <span className={styles.arrow} aria-hidden="true">↓</span>
            </p>
            <p data-hero-fade className={`label muted ${styles.coords}`}>
              48.8566° N — 2.3522° E
            </p>
          </div>
        </div>
      </section>

      <div data-stage-next className={styles.next}>
        {children}
      </div>
    </div>
  );
}
