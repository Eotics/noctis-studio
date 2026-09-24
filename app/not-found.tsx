import type { Metadata } from "next";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { TextReveal } from "@/components/ui/TextReveal";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="not-found" data-theme="dark" aria-labelledby="nf-title">
      <p className="label muted">Error 404 — Lost in the dark</p>
      <TextReveal as="h1" id="nf-title" className="not-found__title" by="chars" immediate>
        404
      </TextReveal>
      <p className="not-found__text">This page drifted out of orbit. The rest of the studio is still where you left it.</p>
      <TransitionLink href="/" className="label not-found__back">
        ← Back to the studio
      </TransitionLink>
    </section>
  );
}
