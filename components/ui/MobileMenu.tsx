"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { mailto, navigation, site } from "@/lib/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionLink } from "./TransitionLink";
import { Clock } from "./Clock";
import styles from "./MobileMenu.module.css";

type Props = { open: boolean; onClose: () => void };

export function MobileMenu({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const { stop, start } = useSmoothScroll();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      timeline.set(ref.current, { visibility: "visible" });
      if (reduce) {
        timeline.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" });
      } else {
        timeline
          .fromTo("[data-m-bg='a']", { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" })
          .fromTo("[data-m-bg='b']", { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" }, 0.08)
          .fromTo("[data-m-line]", { yPercent: 120, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.07 }, 0.45)
          .fromTo("[data-m-fade]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.7)
          .fromTo("[data-m-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.05, ease: "expo.inOut" }, 0.4);
      }
      tl.current = timeline;
    },
    { scope: ref },
  );

  useEffect(() => {
    const menu = ref.current;
    const timeline = tl.current;
    if (!menu || !timeline) return;
    if (open) {
      stop();
      gsap.set(menu, { visibility: "visible" });
      timeline.timeScale(1).play();
      menu.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else if (timeline.progress() > 0) {
      start();
      timeline.timeScale(1.6).reverse();
    }
  }, [open, start, stop]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        document.querySelector<HTMLElement>("[aria-controls='mobile-menu']")?.focus();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const toggle = document.querySelector<HTMLElement>("[aria-controls='mobile-menu']");
      const focusables = [toggle, ...ref.current.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  return (
    <div ref={ref} id="mobile-menu" className={styles.menu} inert={!open} aria-hidden={!open}>
      <span data-m-bg="a" className={styles.bgA} aria-hidden="true" />
      <span data-m-bg="b" className={styles.bgB} aria-hidden="true" />

      <nav aria-label="Mobile" className={styles.inner}>
        <p data-m-fade className={`${styles.kicker} label`}>
          (Index)
        </p>
        <ul className={styles.list}>
          {navigation.map((item) => (
            <li key={item.href} className={styles.item}>
              <span data-m-rule className={`rule ${styles.rule}`} aria-hidden="true" />
              <span className={styles.mask}>
                <span data-m-line className={styles.line}>
                  <TransitionLink href={item.href} className={styles.link} onClick={onClose}>
                    <span className={`${styles.index} label`}>{item.index}</span>
                    {item.label}
                  </TransitionLink>
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.meta}>
          <a data-m-fade href={mailto} className={styles.mail}>
            {site.email}
          </a>
          <ul data-m-fade className={`${styles.social} label`}>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p data-m-fade className={`label ${styles.clock}`}>
            Paris <Clock timeZone={site.timeZone} />
          </p>
        </div>
      </nav>
    </div>
  );
}
