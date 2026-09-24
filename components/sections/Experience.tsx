"use client";

import dynamic from "next/dynamic";
import { useRef, type PointerEvent } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import { experienceState } from "@/lib/sceneState";
import { useInView, useReducedMotion, useWebGLSupport } from "@/lib/hooks";
import { SceneFallback } from "@/components/3d/SceneFallback";
import styles from "./Experience.module.css";

const ExperienceScene = dynamic(() => import("@/components/3d/ExperienceScene"), { ssr: false });

const RING = "Code is part of the design — Design is part of the code — ";

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const last = useRef({ x: 0, t: 0 });
  const ready = useSiteReady();
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const near = useInView(ref, "60% 0px", true);
  const visible = useInView(stickyRef, "0px");

  useGSAP(
    () => {
      const section = ref.current;
      if (!section || !ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const a = SplitText.create("[data-exp='a']", { type: "chars", charsClass: "char" });
        const b = SplitText.create("[data-exp='b']", { type: "chars", charsClass: "char" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              experienceState.progress = self.progress;
            },
          },
        });
        tl.from(a.chars, { yPercent: 110, rotate: 10, opacity: 0, stagger: 0.02, duration: 0.2 }, 0.05)
          .from(b.chars, { yPercent: 110, rotate: 10, opacity: 0, stagger: 0.02, duration: 0.2 }, 0.3)
          .fromTo("[data-ring]", { rotate: -40, scale: 0.8, opacity: 0 }, { rotate: 140, scale: 1.08, opacity: 1, duration: 1 }, 0)
          .to("[data-exp-caption]", { opacity: 1, y: 0, duration: 0.15 }, 0.55)
          .to("[data-exp-line='a']", { x: () => -window.innerWidth * 0.02, duration: 0.4 }, 0.6)
          .to("[data-exp-line='b']", { x: () => window.innerWidth * 0.02, duration: 0.4 }, 0.6);
        return () => {
          a.revert();
          b.revert();
          experienceState.progress = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    experienceState.dragging = true;
    last.current = { x: e.clientX, t: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    experienceState.pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
    experienceState.pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (!experienceState.dragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - last.current.t);
    const velocity = ((e.clientX - last.current.x) / dt) * 9;
    experienceState.dragVelocity = gsap.utils.clamp(-14, 14, experienceState.dragVelocity * 0.4 + velocity);
    last.current = { x: e.clientX, t: now };
  };

  const endDrag = () => {
    experienceState.dragging = false;
  };

  return (
    <section ref={ref} id="lab" className={styles.experience} data-theme="dark" aria-labelledby="lab-title">
      <div
        ref={stickyRef}
        className={styles.sticky}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className={styles.canvas} aria-hidden="true">
          {webgl === true && near && <ExperienceScene active={visible} reduced={reduced} readout={readoutRef} />}
          {webgl === false && <SceneFallback variant="form" />}
        </div>

        <svg className={styles.ring} data-ring viewBox="0 0 600 600" aria-hidden="true">
          <defs>
            <path id="exp-ring" d="M300,300 m-250,0 a250,250 0 1,1 500,0 a250,250 0 1,1 -500,0" />
          </defs>
          <text className={styles.ringText}>
            <textPath href="#exp-ring">{RING.repeat(2)}</textPath>
          </text>
        </svg>

        <p className={`label ${styles.kicker}`}>
          <span className="accent">Lab</span> — Real-time study Nº 07
        </p>

        <h2 id="lab-title" className={styles.phrase}>
          <span className={styles.lineA} data-exp-line="a">
            <span data-exp="a" className={styles.lineInner}>
              Code is part
            </span>
          </span>
          <span className={styles.lineB} data-exp-line="b">
            <span data-exp="b" className={styles.lineInner}>
              of the design.
            </span>
          </span>
        </h2>

        <div className={styles.foot}>
          <p className={`label ${styles.readout}`} aria-hidden="true">
            <span ref={readoutRef}>ROT 0.00 / 0.00 — SKIN 100%</span>
          </p>
          <p data-exp-caption className={styles.caption}>
            Every surface we ship has a structure underneath. Scroll to peel the skin away, drag to turn it — this object is 60 lines of code.
          </p>
          <p className={`label ${styles.hint}`}>
            <span aria-hidden="true">←</span> Drag to rotate <span aria-hidden="true">→</span>
          </p>
        </div>
      </div>
    </section>
  );
}
