import Image from "next/image";
import { stories } from "@/lib/content";
import { TextReveal } from "@/components/ui/TextReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { RollText } from "@/components/ui/RollText";
import styles from "./Stories.module.css";

export function Stories({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const ItemHeading = standalone ? "h2" : "h3";

  return (
    <section id="stories" className={styles.stories} data-theme="light" aria-labelledby="stories-title">
      <header className={styles.header}>
        <p className="label">
          <span className={styles.strong}>04</span> — Journal
        </p>
        <TextReveal as={Heading} id="stories-title" className={styles.title} by="chars" stagger={0.03} immediate={standalone}>
          Stories
        </TextReveal>
        <p className={styles.lede}>Notes from the studio on brands, the web and the tools that are changing both.</p>
        {!standalone && (
          <TransitionLink href="/stories" className={`label ${styles.all}`}>
            <RollText text="All stories" /> <span aria-hidden="true">↗</span>
          </TransitionLink>
        )}
      </header>

      <ol className={styles.list}>
        {stories.map((story, i) => (
          <li key={story.slug} className={styles.item}>
            <article aria-labelledby={`story-${story.slug}`}>
              <TransitionLink href={`/stories/${story.slug}`} className={styles.link}>
                <span className={`rule ${styles.rule}`} aria-hidden="true" />
                <p className={`label ${styles.meta}`}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <time dateTime={story.dateTime}>{story.date}</time>
                  <span className="muted">{story.readingTime}</span>
                </p>
                <ItemHeading id={`story-${story.slug}`} className={styles.itemTitle}>
                  {story.title}
                </ItemHeading>
                <p className={styles.excerpt}>{story.excerpt}</p>
                <span className={styles.media} aria-hidden="true">
                  <Image src={story.cover} alt="" fill sizes="(max-width: 767px) 100vw, 22vw" unoptimized className={styles.img} />
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </TransitionLink>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
