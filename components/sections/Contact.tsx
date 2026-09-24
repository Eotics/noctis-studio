"use client";

import { useRef } from "react";
import { mailto, site } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/lib/ready";
import { TextReveal } from "@/components/ui/TextReveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import styles from "./Contact.module.css";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  // The CTA rises into place as the page reaches its end.
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-cta]",
          { yPercent: 40, scaleX: 0.92 },
          { yPercent: 0, scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-cta]", start: "top bottom", end: "top 55%", scrub: true } },
        );
        gsap.from("[data-contact-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: "expo.inOut", stagger: 0.1, scrollTrigger: { trigger: "[data-contact-info]", start: "top 90%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section ref={ref} id="contact" className={styles.contact} data-theme="dark" aria-labelledby="contact-title">
      <p className="label">
        <span className="accent">05</span> — Contact
      </p>

      <TextReveal as="h2" id="contact-title" className={styles.title} stagger={0.12}>
        Let&apos;s make
        <br />
        something
        <br />
        impossible<span className="accent">.</span>
      </TextReveal>

      <a href={mailto} className={styles.cta} data-cta>
        <span className={styles.ctaFill} aria-hidden="true" />
        <span className={styles.ctaText}>
          <RollText text="Start a project" />
        </span>
        <Magnetic strength={0.4} className={styles.ctaArrowWrap}>
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </Magnetic>
      </a>

      <div className={styles.info} data-contact-info>
        {[
          { label: "New business", content: <a href={mailto}>{site.email}</a> },
          { label: "Call us", content: <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a> },
          {
            label: "Visit",
            content: (
              <address>
                48 rue de la Folie-Méricourt
                <br />
                75011 Paris — France
              </address>
            ),
          },
          { label: "Availability", content: <p>Taking on two new projects for Q1 2027. Replies within 48 hours.</p> },
        ].map((item) => (
          <div key={item.label} className={styles.infoItem}>
            <span data-contact-rule className={`rule ${styles.rule}`} aria-hidden="true" />
            <p className="label muted">{item.label}</p>
            <div className={styles.infoContent}>{item.content}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
