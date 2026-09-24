"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./ProjectShowcase.module.css";

const QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop: one pinned stage, projects stacked on top of each other. Scrolling scrubs a
 * timeline where the next cover wipes in (clip-path + scale + rotation) while the
 * current one sinks away and the typography rolls to the next name.
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const ready = useSiteReady();
  const { scrollTo } = useSmoothScroll();
  const n = projects.length;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !ready) return;
      const mm = gsap.matchMedia();
      mm.add(QUERY, () => {
        const q = gsap.utils.selector(root);
        const frames = q("[data-frame]");
        const covers = q("[data-cover]");
        const shades = q("[data-shade]");
        const names = q("[data-name]");
        const metas = q("[data-meta]");
        const box = q("[data-framebox]");

        // Mask reveal with transforms only (composited): the frame slides up, its image slides down.
        gsap.set(frames.slice(1), { yPercent: 100 });
        gsap.set(covers.slice(1), { yPercent: -100, scale: 1.3, rotate: 5 });
        gsap.set(names.slice(1), { yPercent: 105, rotate: 4 });
        gsap.set(metas.slice(1), { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (n - 1));
              setActive((prev) => (prev === idx ? prev : idx));
            },
          },
        });
        triggerRef.current = tl.scrollTrigger ?? null;

        for (let i = 1; i < n; i++) {
          const at = i - 1;
          tl.to(frames[i], { yPercent: 0, duration: 1, ease: "power2.inOut" }, at)
            .to(covers[i], { yPercent: 0, scale: 1, rotate: 0, duration: 1, ease: "power2.inOut" }, at)
            .to(covers[i - 1], { scale: 0.86, yPercent: -12, rotate: -3, duration: 1, ease: "power1.in" }, at)
            .to(shades[i - 1], { opacity: 0.75, duration: 1 }, at)
            .to(names[i - 1], { yPercent: -105, rotate: -4, duration: 0.55, ease: "power2.in" }, at + 0.05)
            .to(names[i], { yPercent: 0, rotate: 0, duration: 0.55, ease: "power2.out" }, at + 0.45)
            .to(metas[i - 1], { opacity: 0, y: -30, duration: 0.4 }, at)
            .to(metas[i], { opacity: 1, y: 0, duration: 0.45 }, at + 0.55)
            .to("[data-digits]", { yPercent: (-100 / n) * i, duration: 0.7, ease: "power2.inOut" }, at + 0.15)
            .to(box, { rotate: i % 2 ? -1.2 : 1.2, duration: 0.5, ease: "sine.inOut" }, at)
            .to(box, { rotate: 0, duration: 0.5, ease: "sine.inOut" }, at + 0.5);
        }
        tl.to("[data-progress]", { scaleY: 1, duration: n - 1 }, 0);

        // The whole composition leans toward the pointer.
        const pin = root.querySelector<HTMLElement>("[data-pin]");
        const textX = gsap.quickTo("[data-textcol]", "x", { duration: 1, ease: "power3.out" });
        const boxX = gsap.quickTo(box, "x", { duration: 1.1, ease: "power3.out" });
        const boxY = gsap.quickTo(box, "y", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          textX(x * -14);
          boxX(x * 22);
          boxY(y * 16);
        };
        pin?.addEventListener("pointermove", onMove);
        return () => {
          pin?.removeEventListener("pointermove", onMove);
          triggerRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready, n], revertOnUpdate: true },
  );

  // Keyboard users: focusing a project scrolls the stage to it.
  const focusProject = (i: number) => {
    const st = triggerRef.current;
    if (!st || i === active) return;
    scrollTo(st.start + ((st.end - st.start) * i) / (n - 1));
  };

  return (
    <div ref={ref} className={styles.showcase} style={{ height: `${(n - 1) * 65 + 100}svh` }}>
      <div className={styles.pin} data-pin>
        <div className={styles.counter} aria-hidden="true">
          <span className={styles.zero}>0</span>
          <span className={styles.digitMask}>
            <span className={styles.digits} data-digits>
              {projects.map((p) => (
                <span key={p.slug}>{p.index.slice(-1)}</span>
              ))}
            </span>
          </span>
          <span className={`label ${styles.total}`}>/ {String(n).padStart(2, "0")}</span>
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railTrack}>
            <span className={styles.railFill} data-progress />
          </span>
          <ol className={`label ${styles.railList}`}>
            {projects.map((p, i) => (
              <li key={p.slug} className={i === active ? styles.railActive : undefined}>
                {p.index}
              </li>
            ))}
          </ol>
        </div>

        <ol className={styles.projects}>
          {projects.map((p, i) => (
            <li key={p.slug} className={`${styles.project} ${i === active ? styles.isActive : ""}`} aria-current={i === active ? "true" : undefined}>
              <article className={styles.article} aria-labelledby={`sc-${p.slug}`}>
                <div className={styles.textCol} data-textcol>
                  <div className={styles.nameMask}>
                    <h3 id={`sc-${p.slug}`} className={styles.name} data-name>
                      {p.name}
                    </h3>
                  </div>
                  <div className={styles.meta} data-meta>
                    <p className={`label ${styles.category}`}>
                      <span className="accent">{p.index}</span> — {p.category}
                    </p>
                    <p className={styles.excerpt}>{p.excerpt}</p>
                    <ul className={`label ${styles.services}`}>
                      {p.services.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <TransitionLink href={`/work/${p.slug}`} className={styles.cta} onFocus={() => focusProject(i)}>
                      <span className={styles.ctaLine} aria-hidden="true" />
                      <span>View case study</span>
                      <span className="sr-only">: {p.name}</span>
                    </TransitionLink>
                  </div>
                </div>

                <div className={styles.frameBox} data-framebox>
                  <TransitionLink
                    href={`/work/${p.slug}`}
                    className={styles.frame}
                    data-frame
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <span className={styles.coverWrap} data-cover>
                      <Image src={p.cover} alt="" fill sizes="60vw" unoptimized className={styles.cover} />
                    </span>
                    <span className={styles.shade} data-shade />
                    <span className={`label ${styles.viewLabel}`}>View project ↗</span>
                    <span className={`label ${styles.frameMeta}`}>
                      {p.client} — {p.year}
                    </span>
                  </TransitionLink>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
