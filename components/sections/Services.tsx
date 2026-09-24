"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { services } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useFinePointer } from "@/lib/hooks";
import { TextReveal } from "@/components/ui/TextReveal";
import styles from "./Services.module.css";

/**
 * Desktop: hovering a row expands it, reveals its description and a floating preview that trails the cursor.
 * Touch: the same rows become a clean accordion.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const fine = useFinePointer();
  const current = fine ? (hovered ?? open) : open;

  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (previewRef.current) {
        const d = prefersReducedMotion() ? 0.01 : 0.9;
        follow.current = {
          x: gsap.quickTo(previewRef.current, "x", { duration: d, ease: "power3.out" }),
          y: gsap.quickTo(previewRef.current, "y", { duration: d, ease: "power3.out" }),
        };
      }
      gsap.from("[data-row-rule]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "expo.inOut",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-rows]", start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  // Floating preview follows the pointer with inertia.
  const movePreview = contextSafe((e: PointerEvent) => {
    const section = ref.current;
    if (!section || !fine || !follow.current) return;
    const r = section.getBoundingClientRect();
    follow.current.x(e.clientX - r.left);
    follow.current.y(e.clientY - r.top);
  });

  const showPreview = contextSafe((visible: boolean) => {
    const el = previewRef.current;
    if (!el || !fine) return;
    gsap.to(el, {
      clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(50% 50% 50% 50%)",
      rotate: visible ? -4 : 6,
      duration: 0.8,
      ease: "expo.out",
      overwrite: "auto",
    });
  });

  return (
    <section
      ref={ref}
      id="services"
      className={styles.services}
      data-theme="dark"
      aria-labelledby="services-title"
      onPointerMove={movePreview}
    >
      <header className={styles.header}>
        <p className="label">
          <span className="accent">03</span> — Services
        </p>
        <TextReveal as="h2" id="services-title" className={styles.title} by="chars" stagger={0.025}>
          What we do
        </TextReveal>
        <TextReveal as="p" className={styles.lede} delay={0.1}>
          Six disciplines, one team. Most projects combine three or four of them — we assemble the right people from day one.
        </TextReveal>
      </header>

      <ul
        className={styles.rows}
        data-rows
        onPointerLeave={() => {
          setHovered(null);
          showPreview(false);
        }}
      >
        {services.map((s, i) => {
          const isOpen = current === i;
          return (
            <li
              key={s.index}
              className={`${styles.row} ${isOpen ? styles.open : ""}`}
              onPointerEnter={() => {
                if (!fine) return;
                setHovered(i);
                showPreview(true);
              }}
            >
              <span data-row-rule className={`rule ${styles.rule}`} aria-hidden="true" />
              <h3 className={styles.rowHeading}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={`service-${s.index}`}
                  onClick={() => setOpen((v) => (v === i ? null : i))}
                  onFocus={() => fine && setHovered(i)}
                  onBlur={() => fine && setHovered(null)}
                >
                  <span className={`label ${styles.index}`}>{s.index}</span>
                  <span className={styles.rowTitle}>{s.title}</span>
                  <span className={styles.icon} aria-hidden="true" />
                </button>
              </h3>
              <div id={`service-${s.index}`} className={styles.panel} role="region" aria-label={s.title}>
                <div className={styles.panelInner}>
                  <p className={styles.description}>{s.description}</p>
                  <ul className={`label ${styles.deliverables}`}>
                    {s.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <span data-row-rule className={`rule ${styles.lastRule}`} aria-hidden="true" />

      <div ref={previewRef} className={styles.preview} aria-hidden="true">
        {services.map((s, i) => (
          <Image
            key={s.index}
            src={s.preview}
            alt=""
            width={800}
            height={500}
            unoptimized
            className={`${styles.previewImg} ${current === i ? styles.previewActive : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
