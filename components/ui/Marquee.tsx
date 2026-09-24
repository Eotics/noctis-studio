import styles from "./Marquee.module.css";

/** Infinite, slowly drifting row. Content is duplicated once for the loop; the copy is hidden from assistive tech. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
          <span className={styles.sep} aria-hidden="true">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
