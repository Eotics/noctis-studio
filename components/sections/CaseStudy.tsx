import Image from "next/image";
import type { Project } from "@/lib/content";
import { RevealImage } from "@/components/ui/RevealImage";
import { TextReveal } from "@/components/ui/TextReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Counter } from "@/components/ui/Counter";
import styles from "./CaseStudy.module.css";

function parseMetric(value: string) {
  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  return { prefix, value: parseFloat(num), decimals: num.includes(".") ? num.split(".")[1].length : 0, suffix };
}

/** Readable label colour for a swatch, from its relative luminance. */
function inkFor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "#0b0b0c" : "#f1efea";
}

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  return (
    <article className={styles.case} aria-labelledby="case-title">
      <header className={styles.hero} data-theme="dark">
        <p className="label">
          <span className="accent">{project.index}</span> — {project.category}
        </p>
        <TextReveal as="h1" id="case-title" className={styles.title} by="chars" stagger={0.035} immediate>
          {project.name}
        </TextReveal>
        <dl className={styles.facts}>
          {[
            { label: "Client", value: project.client },
            { label: "Location", value: project.location },
            { label: "Year", value: project.year },
            { label: "Services", value: project.services.join(", ") },
          ].map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt className="label muted">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <RevealImage src={project.cover} alt={project.alt} className={styles.cover} sizes="100vw" priority immediate parallax={6} interactive={false} />

      <section className={styles.block} data-theme="dark" aria-labelledby="challenge">
        <h2 id="challenge" className={`label ${styles.blockLabel}`}>
          (The challenge)
        </h2>
        <TextReveal as="p" className={styles.lead}>
          {project.challenge}
        </TextReveal>
      </section>

      <section className={styles.system} data-theme="light" aria-label="Visual system">
        <div className={styles.palette}>
          {project.palette.map((c, i) => (
            <div key={c} className={styles.swatch} style={{ background: c, flexGrow: 4 - i }}>
              <span className={`label ${styles.hex}`} style={{ color: inkFor(c) }}>
                {c.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.specimen}>
          <p className={styles.glyph} aria-hidden="true">
            Aa
          </p>
          <div className={styles.specimenMeta}>
            <p className="label muted">Primary typeface</p>
            <p className={styles.specimenName}>Custom grotesk, variable width</p>
            <p className={`label muted ${styles.specimenChars}`} aria-hidden="true">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
              <br />
              abcdefghijklmnopqrstuvwxyz — 0123456789
            </p>
          </div>
        </div>
      </section>

      <section className={styles.block} data-theme="light" aria-labelledby="approach">
        <h2 id="approach" className={`label ${styles.blockLabel}`}>
          (Approach)
        </h2>
        <ol className={styles.steps}>
          {project.approach.map((step, i) => (
            <li key={i} className={styles.step}>
              <span className={`label ${styles.stepIndex}`}>0{i + 1}</span>
              <TextReveal as="p" className={styles.stepText}>
                {step}
              </TextReveal>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.detail} data-theme="dark">
        <div className={styles.detailFrame}>
          <Image src={project.cover} alt="" fill sizes="(max-width: 767px) 100vw, 55vw" unoptimized className={styles.detailImg} />
        </div>
        <p className={`label ${styles.detailCaption}`}>Detail — {project.name} system, 1:4 crop</p>
      </div>

      <section className={styles.block} data-theme="dark" aria-labelledby="outcome">
        <h2 id="outcome" className={`label ${styles.blockLabel}`}>
          (Outcome)
        </h2>
        <TextReveal as="p" className={styles.lead}>
          {project.outcome}
        </TextReveal>
        <dl className={styles.metrics}>
          {project.metrics.map((m) => {
            const parsed = parseMetric(m.value);
            return (
              <div key={m.label} className={styles.metric}>
                <dt className="label muted">{m.label}</dt>
                <dd className={styles.metricValue}>
                  {parsed ? (
                    <>
                      {parsed.prefix}
                      <Counter value={parsed.value} decimals={parsed.decimals} suffix={parsed.suffix} />
                    </>
                  ) : (
                    m.value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <nav className={styles.next} data-theme="dark" aria-label="Next project">
        <TransitionLink href={`/work/${next.slug}`} className={styles.nextLink}>
          <span className="label muted">Next project — {next.index}</span>
          <span className={styles.nextName}>{next.name}</span>
          <span className={styles.nextMedia} aria-hidden="true">
            <Image src={next.cover} alt="" fill sizes="30vw" unoptimized className={styles.nextImg} />
          </span>
        </TransitionLink>
        <TransitionLink href="/#work" className={`label ${styles.backLink}`}>
          ← All projects
        </TransitionLink>
      </nav>
    </article>
  );
}
