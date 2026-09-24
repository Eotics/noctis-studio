"use client";

import { useRef } from "react";
import { legalPages } from "@/lib/content";
import { navigation, site } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { Clock } from "@/components/ui/Clock";
import { RollText } from "@/components/ui/RollText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./Footer.module.css";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-wordmark] span",
          { yPercent: 70 },
          { yPercent: 0, stagger: 0.04, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className={styles.footer} data-theme="dark">
      <div className={styles.grid}>
        <div className={styles.brand}>
          <p className={styles.name}>NOCTIS STUDIO</p>
          <p className="muted">
            {site.city} — {site.country}
          </p>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <p className="label muted">Index</p>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className={styles.link}>
                  <RollText text={item.label} />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <p className="label muted">Social</p>
          <ul>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  <RollText text={s.label} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <p className="label muted">Legal</p>
          <ul>
            {legalPages.map((page) => (
              <li key={page.slug}>
                <TransitionLink href={`/legal/${page.slug}`} className={styles.link} lang="fr">
                  <RollText text={page.slug === "cgv" ? "CGV" : page.title} />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.col} ${styles.clock}`}>
          <p className="label muted">Local time</p>
          <p className={styles.city}>Paris</p>
          <Clock timeZone={site.timeZone} className={styles.time} />
        </div>
      </div>

      <p className={styles.wordmark} data-wordmark aria-hidden="true">
        {"NOCTIS".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </p>

      <div className={`${styles.bottom} label`}>
        <p>© 2026 NOCTIS STUDIO</p>
        <p className={styles.made}>Designed &amp; built in-house</p>
        <button type="button" className={styles.top} onClick={() => scrollTo(0)}>
          <RollText text="Back to top" /> <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
