"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import { TextReveal } from "@/components/ui/TextReveal";
import styles from "./Intro.module.css";

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const ready = useSiteReady();

  // Words light up one after another as the reader scrolls; highlighted words end in colour.
  useGSAP(
    () => {
      const el = statementRef.current;
      if (!el || !ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, { type: "words", wordsClass: "word" });
        const trigger = { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true };
        gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: trigger });
        const late = { ...trigger, start: "top 55%" };
        // "pulse." ignites at the end of the sentence.
        gsap.fromTo(el.querySelectorAll("[data-hot]"), { color: "#f1efea" }, { color: "#ff3d00", ease: "none", scrollTrigger: late });
        gsap.from("[data-intro-line]", { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section ref={ref} id="intro" className={styles.intro} data-theme="dark" aria-labelledby="intro-title">
      <div className={styles.head}>
        <span data-intro-line className={`rule ${styles.rule}`} aria-hidden="true" />
        <h2 id="intro-title" className="label">
          (Manifesto)
        </h2>
        <p className="label muted">Nº 00 — Studio</p>
      </div>

      <p ref={statementRef} className={styles.statement}>
        <span className="indent" aria-hidden="true" />
        We turn ideas into{" "}
        <em className={styles.em}>
          digital experiences
        </em>{" "}
        with a{" "}
        <em className={styles.em} data-hot>
          pulse.
        </em>
      </p>

      <div className={styles.foot}>
        <TextReveal as="p" className={styles.body}>
          Strategy, design and engineering under one roof. We are designers who write code and developers who care about kerning — so ideas survive
          all the way to launch.
        </TextReveal>
        <ul className={`${styles.disciplines} label`}>
          {["Brand identity", "Web design", "Creative development", "AI experiences", "Motion & 3D"].map((d, i) => (
            <li key={d}>
              <span className="muted">{String(i + 1).padStart(2, "0")}</span> {d}
            </li>
          ))}
        </ul>
        <p className={`label ${styles.cue}`}>
          Scroll to explore <span aria-hidden="true">↓</span>
        </p>
      </div>
    </section>
  );
}
