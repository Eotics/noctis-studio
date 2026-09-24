import styles from "./SceneFallback.module.css";

/** Static vector stand-in used when WebGL is unavailable. */
export function SceneFallback({ variant = "crystal" }: { variant?: "crystal" | "form" }) {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <svg viewBox="0 0 400 400" className={styles.svg}>
        <defs>
          <linearGradient id={`fb-a-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1efea" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#6a70b8" stopOpacity="0.35" />
            <stop offset="1" stopColor="#09090b" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`fb-b-${variant}`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff3d00" stopOpacity="0.55" />
            <stop offset="1" stopColor="#09090b" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="200" rx="185" ry="48" fill="none" stroke="#ff3d00" strokeWidth="1" transform="rotate(-14 200 200)" />
        <ellipse cx="200" cy="200" rx="165" ry="60" fill="none" stroke="#f1efea" strokeOpacity="0.3" strokeWidth="0.75" transform="rotate(18 200 200)" />
        {variant === "crystal" ? (
          <g stroke="#f1efea" strokeOpacity="0.35" strokeWidth="0.75">
            <polygon points="200,40 262,140 200,360" fill={`url(#fb-a-${variant})`} />
            <polygon points="200,40 138,140 200,360" fill={`url(#fb-b-${variant})`} />
            <polygon points="138,140 200,40 262,140 200,170" fill="#f1efea" fillOpacity="0.12" />
          </g>
        ) : (
          <circle cx="200" cy="200" r="120" fill={`url(#fb-a-${variant})`} stroke="#f1efea" strokeOpacity="0.3" />
        )}
      </svg>
    </div>
  );
}
