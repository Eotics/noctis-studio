"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import styles from "./RevealImage.module.css";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Scroll parallax travel of the inner image, in percent. */
  parallax?: number;
  /** React to hover: scale, overlay, pointer parallax. */
  interactive?: boolean;
  /** Reveal on page entrance instead of on scroll. */
  immediate?: boolean;
  width?: number;
  height?: number;
};

export function RevealImage({
  src,
  alt,
  className,
  sizes = "(max-width: 767px) 100vw, 60vw",
  priority,
  parallax = 8,
  interactive = true,
  immediate = false,
  width = 1600,
  height = 1000,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useSiteReady();

  const { contextSafe } = useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.querySelector<HTMLElement>("[data-inner]");
      if (!el || !inner || !ready) return;
      const trigger = immediate ? undefined : { trigger: el, start: "top 85%", once: true };

      if (prefersReducedMotion()) {
        gsap.from(el, { opacity: 0, duration: 0.8, scrollTrigger: trigger });
        return;
      }
      const delay = immediate ? 0.25 : 0;
      gsap.fromTo(el, { clipPath: "inset(16% 10% 16% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", delay, scrollTrigger: trigger });
      gsap.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 2, ease: "expo.out", delay, scrollTrigger: trigger });
      if (parallax) {
        gsap.fromTo(
          inner.firstElementChild,
          { yPercent: -parallax },
          { yPercent: parallax, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  const onMove = contextSafe((e: PointerEvent) => {
    if (!interactive || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current;
    const inner = el?.querySelector("[data-inner]");
    if (!el || !inner) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(inner, { x: x * -20, y: y * -20, duration: 0.9, ease: "power3.out", overwrite: "auto" });
  });

  const onLeave = contextSafe(() => {
    const inner = ref.current?.querySelector("[data-inner]");
    if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1.1, ease: "expo.out", overwrite: "auto" });
  });

  return (
    <div
      ref={ref}
      className={`${styles.frame} ${interactive ? styles.interactive : ""} ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className={styles.inner} data-inner>
        <div className={styles.media}>
          <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} unoptimized className={styles.img} />
        </div>
      </div>
      <span className={styles.overlay} aria-hidden="true" />
    </div>
  );
}
