import { clients, principles, stats } from "@/lib/content";
import { Counter } from "@/components/ui/Counter";
import { TextReveal } from "@/components/ui/TextReveal";
import { Marquee } from "@/components/ui/Marquee";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} data-theme="light" aria-labelledby="about-title">
      <div className={styles.head}>
        <p className="label">
          <span className={styles.index}>02</span> — About
        </p>
        <h2 id="about-title" className={`label ${styles.kicker}`}>
          About the studio
        </h2>
      </div>

      <TextReveal as="p" className={styles.statement}>
        <span className="indent" aria-hidden="true" />
        We are a small independent creative studio building identities, websites and digital experiences for ambitious brands.
      </TextReveal>

      <div className={styles.columns}>
        <TextReveal as="p" className={styles.body} delay={0.1}>
          Founded in Paris in 2014, NOCTIS works with founders, cultural institutions and global brands who believe the details are the product. We
          keep the team small on purpose: every project is led by the people who design and build it.
        </TextReveal>
        <TextReveal as="p" className={styles.body} delay={0.2}>
          Our clients come to us for a website and stay for everything around it — identity systems, product interfaces, launch films and
          installations. Different media, one conviction: people remember how things make them feel.
        </TextReveal>
      </div>

      <dl className={styles.stats}>
        {stats.map((s, i) => (
          <div key={s.label} className={styles.stat}>
            <dt className={`label ${styles.statLabel}`}>{s.label}</dt>
            <dd className={styles.statValue}>
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} delay={i * 0.12} />
            </dd>
          </div>
        ))}
      </dl>

      <ol className={styles.principles}>
        {principles.map((p, i) => (
          <li key={p.title} className={styles.principle}>
            <span className={`label ${styles.pIndex}`}>({String(i + 1).padStart(2, "0")})</span>
            <TextReveal as="h3" className={styles.pTitle}>
              {p.title}
            </TextReveal>
            <p className={styles.pText}>{p.text}</p>
          </li>
        ))}
      </ol>

      <div className={styles.clients}>
        <p className={`label ${styles.clientsLabel}`}>Trusted by</p>
        <Marquee items={clients} />
      </div>
    </section>
  );
}
