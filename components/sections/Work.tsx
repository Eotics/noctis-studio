import { projects } from "@/lib/content";
import { TextReveal } from "@/components/ui/TextReveal";
import { ProjectShowcase } from "./ProjectShowcase";
import { ProjectItem } from "./ProjectItem";
import styles from "./Work.module.css";

export function Work() {
  return (
    <section id="work" className={styles.work} data-theme="dark" aria-labelledby="work-title">
      <header className={styles.header}>
        <p className={`label ${styles.kicker}`}>
          <span className="accent">01</span> — Work
        </p>
        <h2 id="work-title" className={styles.title}>
          <TextReveal as="span" className={styles.t1} by="chars" stagger={0.03}>
            Selected
          </TextReveal>
          <span className={styles.t2}>
            <sup className={`label ${styles.count}`}>({String(projects.length).padStart(2, "0")})</sup>
            <TextReveal as="span" by="chars" stagger={0.03} delay={0.15}>
              Work
            </TextReveal>
          </span>
        </h2>
        <TextReveal as="p" className={styles.lede} delay={0.2}>
          Five projects from 2024 to 2026, where strategy, design and code were a single gesture.
        </TextReveal>
      </header>

      <ProjectShowcase projects={projects} />

      <ol className={styles.list}>
        {projects.map((p, i) => (
          <ProjectItem key={p.slug} project={p} reverse={i % 2 === 1} />
        ))}
      </ol>
    </section>
  );
}
