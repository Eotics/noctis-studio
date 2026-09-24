import type { Project } from "@/lib/content";
import { RevealImage } from "@/components/ui/RevealImage";
import { TextReveal } from "@/components/ui/TextReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "./ProjectItem.module.css";

/** Editorial project entry used on mobile, tablet and in reduced-motion mode. */
export function ProjectItem({ project, reverse }: { project: Project; reverse?: boolean }) {
  return (
    <li className={`${styles.item} ${reverse ? styles.reverse : ""}`}>
      <article aria-labelledby={`pi-${project.slug}`}>
        <TransitionLink href={`/work/${project.slug}`} className={styles.link}>
          <RevealImage src={project.cover} alt={project.alt} className={styles.media} sizes="(max-width: 1023px) 100vw, 60vw" />
          <div className={styles.meta}>
            <p className={`label ${styles.index}`}>
              <span className="accent">{project.index}</span> — {project.category}
            </p>
            <TextReveal as="h3" id={`pi-${project.slug}`} className={styles.name}>
              {project.name}
            </TextReveal>
            <p className={styles.excerpt}>{project.excerpt}</p>
            <ul className={`label ${styles.services}`}>
              {project.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <span className={`label ${styles.cta}`} aria-hidden="true">
              View project ↗
            </span>
          </div>
        </TransitionLink>
      </article>
    </li>
  );
}
