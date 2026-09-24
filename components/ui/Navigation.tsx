"use client";

import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { navigation } from "@/lib/site";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import { TransitionLink } from "./TransitionLink";
import { RollText } from "./RollText";
import { MobileMenu } from "./MobileMenu";
import styles from "./Navigation.module.css";

export function Navigation() {
  const pathname = usePathname();
  const ready = useSiteReady();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  // Entrance once the preloader hands over.
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      gsap.from("[data-nav-item]", { yPercent: -120, opacity: 0, duration: 1.2, stagger: 0.06, ease: "expo.out", delay: 0.55 });
    },
    { scope: headerRef, dependencies: [ready] },
  );

  // Hide while scrolling down, reveal on the way up.
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const shouldHide = self.direction === 1 && self.scroll() > window.innerHeight * 0.6;
          if (shouldHide === hidden) return;
          hidden = shouldHide;
          gsap.to(header, { yPercent: shouldHide ? -110 : 0, duration: 0.7, ease: "expo.out", overwrite: true });
        },
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  // Highlight the section currently in view (home only).
  useGSAP(
    () => {
      if (pathname !== "/") return;
      navigation.forEach((item) => {
        const id = item.href.split("#")[1];
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(id);
            else setActive((prev) => (prev === id ? null : prev));
          },
        });
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  const current = pathname === "/" ? active : null;

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <div className={`${styles.bar} ${open ? styles.barOpen : ""}`}>
          <span data-nav-item className={styles.logoWrap}>
            <TransitionLink href="/" className={styles.logo} aria-label="NOCTIS Studio — home">
              <span className={styles.logoWord}>NOCTIS</span>
              <sup className={styles.logoSup}>STUDIO</sup>
            </TransitionLink>
          </span>

          <p data-nav-item className={`${styles.status} label`}>
            <span className={styles.pulse} aria-hidden="true" />
            Booking projects for 2027
          </p>

          <nav aria-label="Main" className={styles.desktopNav}>
            <ul className={styles.list}>
              {navigation.map((item) => {
                const id = item.href.split("#")[1];
                const isActive = current === id;
                return (
                  <li key={item.href} data-nav-item>
                    <TransitionLink href={item.href} className={`${styles.link} ${isActive ? styles.active : ""}`} aria-current={isActive ? "location" : undefined}>
                      <span className={styles.index}>{item.index}</span>
                      <span className={styles.dash} aria-hidden="true">
                        —
                      </span>
                      <RollText text={item.label} className={styles.text} />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <span data-nav-item className={styles.menuWrap}>
            <button
              type="button"
              className={`${styles.menuButton} ${open ? styles.menuOpen : ""}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`${styles.menuLabel} label`}>{open ? "Close" : "Menu"}</span>
              <span className={styles.burger} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </span>
        </div>
      </header>
      <MobileMenu open={open} onClose={closeMenu} />
    </>
  );
}
