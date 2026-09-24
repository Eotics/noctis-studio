import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stories } from "@/lib/content";
import { RevealImage } from "@/components/ui/RevealImage";
import { TextReveal } from "@/components/ui/TextReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import styles from "@/styles/subpage.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.excerpt,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: { title: story.title, description: story.excerpt, type: "article", publishedTime: story.dateTime },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const index = stories.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const story = stories[index];
  const next = stories[(index + 1) % stories.length];

  return (
    <article className={styles.article} data-theme="light" aria-labelledby="story-title">
      <header className={styles.articleHead}>
        <p className={`label ${styles.articleMeta}`}>
          <span>{story.category}</span>
          <time dateTime={story.dateTime}>{story.date}</time>
          <span className="muted">{story.readingTime}</span>
        </p>
        <TextReveal as="h1" id="story-title" className={styles.articleTitle} by="words" immediate>
          {story.title}
        </TextReveal>
        <p className={styles.articleLede}>{story.excerpt}</p>
      </header>

      <RevealImage src={story.cover} alt={story.alt} className={styles.articleCover} sizes="100vw" width={1200} height={800} priority immediate interactive={false} />

      <div className={styles.articleBody}>
        {story.body.map((block, i) => (
          <section key={i} className={styles.articleSection}>
            {block.heading && <h2 className={styles.articleH2}>{block.heading}</h2>}
            {block.paragraphs.map((p, j) => (
              <p key={j} className={i === 0 && j === 0 ? styles.dropcap : undefined}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <nav className={styles.articleNext} aria-label="Next story">
        <TransitionLink href={`/stories/${next.slug}`} className={styles.articleNextLink}>
          <span className="label muted">Next story</span>
          <span className={styles.articleNextTitle}>{next.title}</span>
        </TransitionLink>
        <TransitionLink href="/stories" className={`label ${styles.back}`}>
          ← All stories
        </TransitionLink>
      </nav>
    </article>
  );
}
