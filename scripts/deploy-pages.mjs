// Builds a static export and publishes it to the `gh-pages` branch (GitHub Pages).
// Usage: npm run deploy
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const read = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const remote = read("git remote get-url origin");
const match = remote.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
if (!match) throw new Error(`Cannot read the GitHub repository from remote "${remote}"`);
const [, owner, repo] = match;
const basePath = `/${repo}`;
const siteUrl = `https://${owner.toLowerCase()}.github.io${basePath}`;

console.log(`\n→ Building for ${siteUrl}\n`);
const out = join(process.cwd(), "out");
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
run("npx next build", {
  env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_SITE_URL: siteUrl },
});

// GitHub Pages must not run Jekyll on the export (it would drop the _next folder).
writeFileSync(join(out, ".nojekyll"), "");

// On Windows the export writes route-segment prefetch files as nested folders
// (`__next.work/$d$slug/__PAGE__.txt`) while the client requests flat names
// (`__next.work.$d$slug.__PAGE__.txt`): add the flat copies.
function flattenSegments(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith("__next.")) {
      flattenSegments(full);
      continue;
    }
    const walk = (current, prefix) => {
      for (const child of readdirSync(current, { withFileTypes: true })) {
        const name = `${prefix}.${child.name}`;
        if (child.isDirectory()) walk(join(current, child.name), name);
        else copyFileSync(join(current, child.name), join(dir, name));
      }
    };
    walk(full, entry.name);
  }
}
flattenSegments(out);

console.log("\n→ Publishing to the gh-pages branch\n");
const git = (cmd) => run(`git ${cmd}`, { cwd: out });
git("init -q -b gh-pages");
git("add -A");
git('commit -q -m "Deploy to GitHub Pages"');
git(`push -f ${remote} gh-pages`);
rmSync(join(out, ".git"), { recursive: true, force: true });

console.log(`\n✓ Published: ${siteUrl}\n`);
