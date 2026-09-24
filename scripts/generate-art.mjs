// Generates the original, seeded artwork used across the site (projects + stories).
// Run with: node scripts/generate-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const ACCENT = "#FF3D00";
const MONO = "ui-monospace, 'JetBrains Mono', Menlo, monospace";

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 100) / 100;

const grain = (id, opacity = 0.14) => ({
  defs: `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.35"/></filter>`,
  layer: (w, h) => `<rect width="${w}" height="${h}" filter="url(#${id})" opacity="${opacity}" style="mix-blend-mode:overlay"/>`,
});

const label = (x, y, text, fill, size = 15, anchor = "start", opacity = 0.7) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" letter-spacing="1.5" fill="${fill}" fill-opacity="${opacity}" text-anchor="${anchor}">${text}</text>`;

const cross = (x, y, c, o = 0.5) =>
  `<g stroke="${c}" stroke-opacity="${o}" stroke-width="1"><line x1="${x - 8}" y1="${y}" x2="${x + 8}" y2="${y}"/><line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}"/></g>`;

const svg = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${body}</svg>\n`;

/* ───────────────────────── AETHER ───────────────────────── */
function aether() {
  const W = 1600, H = 1000, r = rng(11);
  const g = grain("ga", 0.12);
  const cx = 1010, cy = 500;
  let stars = "";
  for (let i = 0; i < 110; i++) {
    stars += `<circle cx="${f(r() * W)}" cy="${f(r() * H)}" r="${f(0.5 + r() * 1.5)}" fill="#E6E9FF" opacity="${f(0.15 + r() * 0.7)}"/>`;
  }
  let orbits = "";
  for (let i = 0; i < 9; i++) {
    const rx = 250 + i * 95;
    orbits += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * 0.33)}" fill="none" stroke="#C9D0FF" stroke-opacity="${f(0.22 - i * 0.02)}" stroke-width="1"${i % 3 === 1 ? ' stroke-dasharray="3 9"' : ""}/>`;
  }
  const defs = `${g.defs}
  <radialGradient id="a-glow" cx="0.63" cy="0.5" r="0.62"><stop offset="0" stop-color="#3342FF" stop-opacity="0.65"/><stop offset="0.45" stop-color="#101556" stop-opacity="0.45"/><stop offset="1" stop-color="#04050A" stop-opacity="0"/></radialGradient>
  <radialGradient id="a-warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${ACCENT}" stop-opacity="0.55"/><stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient>
  <radialGradient id="a-planet" cx="0.5" cy="0.5" r="0.5" fx="0.32" fy="0.28"><stop offset="0" stop-color="#F6F7FF"/><stop offset="0.16" stop-color="#9AA3FF"/><stop offset="0.5" stop-color="#1F2677"/><stop offset="1" stop-color="#03040C"/></radialGradient>
  <linearGradient id="a-ring" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0.05"/></linearGradient>
  <filter id="a-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>`;
  const body = `<rect width="${W}" height="${H}" fill="#04050A"/>
  <rect width="${W}" height="${H}" fill="url(#a-glow)"/>
  <circle cx="1290" cy="230" r="240" fill="url(#a-warm)" filter="url(#a-blur)"/>
  ${stars}
  <g transform="rotate(-16 ${cx} ${cy})">${orbits}
    <ellipse cx="${cx}" cy="${cy}" rx="330" ry="66" fill="none" stroke="url(#a-ring)" stroke-width="2" opacity="0.45"/>
  </g>
  <circle cx="${cx}" cy="${cy}" r="188" fill="url(#a-planet)"/>
  <g transform="rotate(-16 ${cx} ${cy})"><path d="M ${cx - 330} ${cy} A 330 66 0 0 0 ${cx + 330} ${cy}" fill="none" stroke="url(#a-ring)" stroke-width="2.5"/></g>
  <circle cx="1392" cy="382" r="7" fill="${ACCENT}"/>
  <line x1="80" y1="120" x2="80" y2="880" stroke="#fff" stroke-opacity="0.12"/>
  ${label(104, 132, "AETHER / OBSERVATORY", "#fff")}
  ${label(104, 158, "SKY INDEX — 1984→2026", "#fff", 13, "start", 0.4)}
  ${label(1520, 880, "46°33′N  7°59′E", "#fff", 13, "end", 0.5)}
  ${cross(1520, 120, "#fff")}${cross(80, 880, "#fff")}
  ${g.layer(W, H)}`;
  return svg(W, H, defs, body);
}

/* ───────────────────────── MOTORLAB ───────────────────────── */
function motorlab() {
  const W = 1600, H = 1000, r = rng(23);
  const g = grain("gm", 0.2);
  let grid = "";
  for (let x = 100; x < W; x += 100) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = 100; y < H; y += 100) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  let spokes = "";
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    spokes += `<line x1="${f(430 + Math.cos(a) * 92)}" y1="${f(540 + Math.sin(a) * 92)}" x2="${f(430 + Math.cos(a) * 238)}" y2="${f(540 + Math.sin(a) * 238)}"/>`;
  }
  let stripes = "";
  let y = 250;
  for (let i = 0; i < 11; i++) {
    const h = 10 + Math.floor(r() * 30);
    const len = 180 + r() * 560;
    const x = 860 + r() * 80;
    const fill = i === 6 ? ACCENT : "#0B0B0C";
    stripes += `<rect x="${f(x)}" y="${y}" width="${f(len)}" height="${h}" fill="${fill}"/>`;
    y += h + 10 + Math.floor(r() * 16);
  }
  const defs = g.defs;
  const body = `<rect width="${W}" height="${H}" fill="#E8E5DE"/>
  <g stroke="#0B0B0C" stroke-opacity="0.07">${grid}</g>
  <circle cx="430" cy="540" r="372" fill="#0B0B0C"/>
  <circle cx="430" cy="540" r="300" fill="none" stroke="#E8E5DE" stroke-opacity="0.25" stroke-width="1"/>
  <circle cx="430" cy="540" r="250" fill="#E8E5DE"/>
  <g stroke="#0B0B0C" stroke-width="2.5">${spokes}</g>
  <circle cx="430" cy="540" r="92" fill="#0B0B0C"/>
  <circle cx="430" cy="540" r="18" fill="${ACCENT}"/>
  ${stripes}
  <g fill="#0B0B0C" transform="translate(1180 690)">
    <polygon points="0,210 0,0 70,0 130,110 190,0 260,0 260,210 205,210 205,95 150,195 110,195 55,95 55,210"/>
    <rect x="285" y="0" width="55" height="210"/><rect x="285" y="155" width="130" height="55"/>
  </g>
  ${label(100, 80, "MOTORLAB®", "#0B0B0C", 18, "start", 0.9)}
  ${label(100, 106, "IDENTITY SYSTEM — v2.0", "#0B0B0C", 13, "start", 0.55)}
  ${label(1500, 80, "TORINO / 45.07N", "#0B0B0C", 13, "end", 0.55)}
  ${cross(1500, 960, "#0B0B0C", 0.6)}${cross(100, 960, "#0B0B0C", 0.6)}
  ${g.layer(W, H)}`;
  return svg(W, H, defs, body);
}

/* ───────────────────────── ORBIT ───────────────────────── */
function orbit() {
  const W = 1600, H = 1000, r = rng(37);
  const g = grain("go", 0.14);
  const cx = 800, cy = 450;
  const radii = [130, 220, 320, 440];
  let rings = "", nodes = "", links = "";
  const pts = [];
  radii.forEach((rad, i) => {
    rings += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#fff" stroke-opacity="${f(0.28 - i * 0.05)}" stroke-dasharray="${i % 2 ? "2 7" : "1 0"}"/>`;
    const n = 3 + Math.floor(r() * 4);
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2;
      const p = [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      pts.push(p);
      const accent = i === 2 && k === 0;
      nodes += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${accent ? 8 : f(3 + r() * 3)}" fill="${accent ? ACCENT : "#fff"}" opacity="${accent ? 1 : f(0.5 + r() * 0.5)}"/>`;
    }
  });
  pts.forEach((p, i) => {
    if (r() > 0.45) links += `<line x1="${cx}" y1="${cy}" x2="${f(p[0])}" y2="${f(p[1])}"/>`;
    const q = pts[(i + 3) % pts.length];
    if (r() > 0.5) links += `<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}"/>`;
  });
  let wave = "";
  for (let x = 220, i = 0; x <= 1380; x += 9, i++) {
    const t = i / 130;
    const env = Math.sin(t * Math.PI) ** 1.5;
    const h = f(4 + env * (18 + 48 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) + r() * 16));
    wave += `<rect x="${x}" y="${f(900 - h / 2)}" width="3" height="${h}" rx="1.5"/>`;
  }
  const defs = `${g.defs}
  <filter id="o-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="95"/></filter>
  <filter id="o-soft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="22"/></filter>`;
  const body = `<rect width="${W}" height="${H}" fill="#060608"/>
  <circle cx="610" cy="380" r="330" fill="#5B3CFF" opacity="0.6" filter="url(#o-blur)"/>
  <circle cx="1030" cy="560" r="300" fill="#22D3C5" opacity="0.32" filter="url(#o-blur)"/>
  ${rings}
  <g stroke="#fff" stroke-opacity="0.14">${links}</g>
  ${nodes}
  <circle cx="${cx}" cy="${cy}" r="70" fill="#fff" opacity="0.5" filter="url(#o-soft)"/>
  <circle cx="${cx}" cy="${cy}" r="30" fill="#fff"/>
  <g fill="#fff" opacity="0.55">${wave}</g>
  ${label(90, 90, "ORBIT — CLIMATE INTELLIGENCE", "#fff")}
  ${label(1510, 90, "CONFIDENCE 0.87 ± 0.04", "#fff", 13, "end", 0.5)}
  ${label(90, 116, "MODEL / TIDE-3", "#fff", 13, "start", 0.4)}
  ${g.layer(W, H)}`;
  return svg(W, H, defs, body);
}

/* ───────────────────────── NOVA ───────────────────────── */
function nova() {
  const W = 1600, H = 1000;
  const g = grain("gn", 0.22);
  let lines = "";
  for (let i = 0, y = 690; i < 16; i++) {
    lines += `<line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}"/>`;
    y += 6 + i * 2.2;
  }
  const bx = 800;
  const defs = `${g.defs}
  <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5E6D8"/><stop offset="0.55" stop-color="#EBBF9F"/><stop offset="1" stop-color="#C46E4F"/></linearGradient>
  <linearGradient id="n-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.7"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.8" stop-color="#fff" stop-opacity="0.32"/><stop offset="1" stop-color="#fff" stop-opacity="0.6"/></linearGradient>
  <linearGradient id="n-liquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ACCENT}" stop-opacity="0.35"/><stop offset="1" stop-color="#8E2F14" stop-opacity="0.55"/></linearGradient>
  <filter id="n-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="36"/></filter>
  <filter id="n-shadow" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="16"/></filter>`;
  const body = `<rect width="${W}" height="${H}" fill="url(#n-sky)"/>
  <circle cx="1110" cy="370" r="240" fill="#FFF3E6" opacity="0.95" filter="url(#n-blur)"/>
  <g stroke="#6B2A17" stroke-opacity="0.14">${lines}</g>
  <ellipse cx="${bx}" cy="822" rx="210" ry="22" fill="#4E1F10" opacity="0.35" filter="url(#n-shadow)"/>
  <rect x="${bx - 44}" y="300" width="88" height="70" fill="#fff" fill-opacity="0.35" stroke="#fff" stroke-opacity="0.6"/>
  <rect x="${bx - 72}" y="214" width="144" height="92" rx="4" fill="#17110F"/>
  <rect x="${bx - 72}" y="214" width="144" height="10" fill="#fff" fill-opacity="0.08"/>
  <rect x="${bx - 135}" y="362" width="270" height="456" rx="38" fill="url(#n-glass)" stroke="#fff" stroke-opacity="0.8" stroke-width="1.5"/>
  <rect x="${bx - 126}" y="530" width="252" height="280" rx="30" fill="url(#n-liquid)"/>
  <rect x="${bx - 116}" y="384" width="22" height="410" rx="11" fill="#fff" opacity="0.55"/>
  <rect x="${bx - 70}" y="600" width="140" height="120" fill="#F7EFE8" fill-opacity="0.92"/>
  <text x="${bx}" y="648" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="6" fill="#17110F" text-anchor="middle">NOVA</text>
  ${label(bx, 678, "Nº07 — BRUME", "#17110F", 11, "middle", 0.8)}
  ${label(bx, 700, "50 ML / EAU DE PARFUM", "#17110F", 9, "middle", 0.55)}
  ${label(90, 90, "NOVA PARFUMS — KØBENHAVN", "#3A1A0F", 15, "start", 0.75)}
  ${label(1510, 90, "WEATHER: FOG / 11°C", "#3A1A0F", 13, "end", 0.55)}
  ${cross(1510, 930, "#3A1A0F", 0.5)}
  ${g.layer(W, H)}`;
  return svg(W, H, defs, body);
}

/* ───────────────────────── FORM ───────────────────────── */
function form() {
  const W = 1600, H = 1000, r = rng(59);
  const g = grain("gf", 0.12);
  const s = 50, n = 9, cx = 800, cy = 230;
  const hx = s * 0.866, hy = s * 0.5;
  const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const d = Math.hypot(i - 4, j - 4);
    const h = Math.max(0, Math.round((5.5 - d) * 0.9 + r() * 3.2 - 1)) * 34;
    cells.push({ i, j, h });
  }
  cells.sort((a, b) => a.i + a.j - (b.i + b.j));
  const accentIdx = cells.findIndex((c) => c.i === 5 && c.j === 3);
  let blocks = "";
  cells.forEach((c, k) => {
    const x = cx + (c.i - c.j) * hx;
    const y = cy + (c.i + c.j) * hy;
    const top = [[x, y - c.h], [x + hx, y + hy - c.h], [x, y + 2 * hy - c.h], [x - hx, y + hy - c.h]];
    const pt = (arr) => arr.map((p) => `${f(p[0])},${f(p[1])}`).join(" ");
    const acc = k === accentIdx;
    const lift = Math.min(1, c.h / 200);
    const topC = acc ? ACCENT : `hsl(240 4% ${f(20 + lift * 34)}%)`;
    const leftC = acc ? "#9E2A00" : `hsl(240 4% ${f(9 + lift * 10)}%)`;
    const rightC = acc ? "#CC3300" : `hsl(240 4% ${f(14 + lift * 14)}%)`;
    if (c.h > 0) {
      blocks += `<polygon points="${pt([[x - hx, y + hy - c.h], [x, y + 2 * hy - c.h], [x, y + 2 * hy], [x - hx, y + hy]])}" fill="${leftC}"/>`;
      blocks += `<polygon points="${pt([[x, y + 2 * hy - c.h], [x + hx, y + hy - c.h], [x + hx, y + hy], [x, y + 2 * hy]])}" fill="${rightC}"/>`;
    }
    blocks += `<polygon points="${pt(top)}" fill="${topC}" stroke="#0E0E10" stroke-width="1"/>`;
  });
  let dots = "";
  for (let x = 60; x < W; x += 40) for (let y = 60; y < H; y += 40) dots += `<circle cx="${x}" cy="${y}" r="1"/>`;
  const defs = `${g.defs}<radialGradient id="f-glow" cx="0.5" cy="0.55" r="0.55"><stop offset="0" stop-color="#2B2B33"/><stop offset="1" stop-color="#0E0E10"/></radialGradient>`;
  const body = `<rect width="${W}" height="${H}" fill="url(#f-glow)"/>
  <g fill="#fff" opacity="0.08">${dots}</g>
  ${blocks}
  ${label(90, 90, "FORM — PAVILION GENERATOR 01", "#fff")}
  ${label(90, 116, "SEED 2026.04 / 81 MODULES", "#fff", 13, "start", 0.4)}
  ${label(1510, 930, "VENEZIA — BIENNALE", "#fff", 13, "end", 0.5)}
  ${cross(1510, 90, "#fff")}
  ${g.layer(W, H)}`;
  return svg(W, H, defs, body);
}

/* ───────────────────────── STORIES ───────────────────────── */
function storyBrands() {
  const W = 1200, H = 800;
  const g = grain("gs1", 0.2);
  const cols = 8, rows = 5, size = 96, gap = 34;
  const ox = (W - (cols * size + (cols - 1) * gap)) / 2, oy = (H - (rows * size + (rows - 1) * gap)) / 2;
  let shapes = "";
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const t = (i / (cols - 1)) * 0.75 + (j / (rows - 1)) * 0.25;
    const rad = f(t * size * 0.5);
    const acc = i === 5 && j === 2;
    const rot = f((1 - t) * 45);
    const x = ox + i * (size + gap), y = oy + j * (size + gap);
    shapes += `<rect x="${f(x)}" y="${f(y)}" width="${size}" height="${size}" rx="${rad}" fill="${acc ? ACCENT : "#0B0B0C"}" transform="rotate(${rot} ${f(x + size / 2)} ${f(y + size / 2)})"/>`;
  }
  return svg(W, H, g.defs, `<rect width="${W}" height="${H}" fill="#E8E5DE"/>${shapes}${label(60, 60, "SYSTEM → BEHAVIOUR", "#0B0B0C", 13, "start", 0.6)}${g.layer(W, H)}`);
}

function storyDepth() {
  const W = 1200, H = 800;
  const g = grain("gs2", 0.14);
  const vx = 600, vy = 330;
  let grid = "";
  for (let k = -14; k <= 14; k++) grid += `<line x1="${vx}" y1="${vy}" x2="${vx + k * 110}" y2="${H}"/>`;
  for (let i = 1; i < 14; i++) {
    const y = vy + Math.pow(i / 13, 2.2) * (H - vy);
    grid += `<line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}"/>`;
  }
  const c = [600, 250], s = 120;
  const P = (x, y, z) => [c[0] + (x - z) * s * 0.86, c[1] + (x + z) * s * 0.5 - y * s];
  const v = [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]].map((p) => P(p[0] * 0.8, p[1] * 0.8 + 0.2, p[2] * 0.8));
  const e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const edges = e.map(([a, b]) => `<line x1="${f(v[a][0])}" y1="${f(v[a][1])}" x2="${f(v[b][0])}" y2="${f(v[b][1])}"/>`).join("");
  const verts = v.map((p, i) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${i === 6 ? 7 : 4}" fill="${i === 6 ? ACCENT : "#fff"}"/>`).join("");
  const defs = `${g.defs}<linearGradient id="d-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#0A0A0C" stop-opacity="1"/><stop offset="0.6" stop-color="#0A0A0C" stop-opacity="0"/></linearGradient><radialGradient id="d-glow" cx="0.5" cy="0.35" r="0.45"><stop offset="0" stop-color="#3a3a48"/><stop offset="1" stop-color="#0A0A0C"/></radialGradient>`;
  return svg(W, H, defs, `<rect width="${W}" height="${H}" fill="url(#d-glow)"/><g stroke="#fff" stroke-opacity="0.22">${grid}</g><rect width="${W}" height="${H}" fill="url(#d-fade)"/><g stroke="#fff" stroke-opacity="0.85" stroke-width="1.5">${edges}</g>${verts}${label(60, 60, "Z-AXIS / REAL-TIME", "#fff", 13, "start", 0.55)}${g.layer(W, H)}`);
}

function storyAI() {
  const W = 1200, H = 800;
  const g = grain("gs3", 0.14);
  let paths = "";
  for (let k = 0; k < 26; k++) {
    const base = 90 + k * 26;
    let d = "";
    for (let x = -20; x <= W + 20; x += 20) {
      const y = base + Math.sin(x * 0.006 + k * 0.4) * 38 + Math.sin(x * 0.017 - k * 0.25) * 14 + Math.exp(-((x - 760) ** 2) / 26000) * -70 * Math.sin((k / 26) * Math.PI);
      d += `${x === -20 ? "M" : "L"}${x} ${f(y)} `;
    }
    const acc = k === 15;
    paths += `<path d="${d}" fill="none" stroke="${acc ? ACCENT : "#fff"}" stroke-opacity="${acc ? 1 : f(0.12 + (k % 5 === 0 ? 0.35 : 0.1))}" stroke-width="${acc ? 2 : 1}"/>`;
  }
  return svg(W, H, g.defs, `<rect width="${W}" height="${H}" fill="#131316"/>${paths}${label(60, 60, "LATENT FIELD / 26 LAYERS", "#fff", 13, "start", 0.55)}${g.layer(W, H)}`);
}

const out = {
  "work/aether.svg": aether(),
  "work/motorlab.svg": motorlab(),
  "work/orbit.svg": orbit(),
  "work/nova.svg": nova(),
  "work/form.svg": form(),
  "stories/future-of-digital-brands.svg": storyBrands(),
  "stories/why-3d-changes-web-design.svg": storyDepth(),
  "stories/designing-for-ai.svg": storyAI(),
};

for (const [file, content] of Object.entries(out)) {
  const p = join(root, file);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log(`✓ ${file} (${(content.length / 1024).toFixed(1)} KB)`);
}
