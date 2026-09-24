import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import { legalPages } from "@/lib/content";
import { TextReveal } from "@/components/ui/TextReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "@/styles/subpage.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) return {};
  return { title: page.title, alternates: { canonical: absoluteUrl(`/legal/${page.slug}`) }, robots: { index: true, follow: true } };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <article className={styles.legal} data-theme="light" lang="fr" aria-labelledby="legal-title">
      <header className={styles.legalHead}>
        <p className="label muted">Informations légales — Mise à jour le {page.updated}</p>
        <TextReveal as="h1" id="legal-title" className={styles.legalTitle} by="words" immediate>
          {page.title}
        </TextReveal>
      </header>
      <div className={styles.legalBody}>
        {page.sections.map((s, i) => (
          <section key={s.heading} className={styles.legalSection}>
            <span className={`label ${styles.legalIndex}`}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className={styles.legalH2}>{s.heading}</h2>
              <p>{s.text}</p>
            </div>
          </section>
        ))}
      </div>
      <nav className={styles.legalNav} aria-label="Autres pages légales">
        {legalPages
          .filter((p) => p.slug !== page.slug)
          .map((p) => (
            <TransitionLink key={p.slug} href={`/legal/${p.slug}`} className="label">
              {p.title} ↗
            </TransitionLink>
          ))}
      </nav>
    </article>
  );
}
