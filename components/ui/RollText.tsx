import type { CSSProperties } from "react";
import styles from "./RollText.module.css";

const NBSP = " ";

/** Text that rolls letter by letter when its closest link/button parent is hovered or focused. */
export function RollText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`${styles.roll} ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span className={styles.track} aria-hidden="true">
        {Array.from(text).map((c, i) => {
          const char = c === " " ? NBSP : c;
          return (
            <span key={i} className={styles.char} style={{ "--i": i } as CSSProperties} data-char={char}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
