# NOCTIS STUDIO

Site vitrine d'une agence créative fictive — Next.js 16, React 19, TypeScript, GSAP (ScrollTrigger + SplitText), Lenis, Three.js via React Three Fiber.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production (20 routes statiques)
npm run start      # sert le build
npm run typecheck
node scripts/generate-art.mjs   # régénère les visuels SVG des projets et articles
npm run deploy     # export statique + publication sur GitHub Pages (branche gh-pages)
```

Site en ligne : https://eotics.github.io/noctis-studio

## Structure

```
app/                 routes (home, /work/[slug], /stories, /stories/[slug], /legal/[slug]), SEO (robots, sitemap, OG, icon)
components/
  providers/         SmoothScroll (Lenis ⇄ GSAP ticker), TransitionProvider (transitions de page)
  ui/                Preloader, CustomCursor, Navigation, MobileMenu, TextReveal, RevealImage, Magnetic, RollText, Clock, Counter…
  sections/          Hero, Intro, Work (ProjectShowcase + ProjectItem), About, Services, Experience, Stories, Contact, Footer, CaseStudy
  3d/                HeroScene (cristal en verre), ExperienceScene (forme chromée → wireframe), SceneFallback (sans WebGL)
lib/                 contenus, config du site, GSAP, registre de chargement, état partagé DOM ⇄ WebGL, hooks
styles/              tokens et styles globaux
public/images/       visuels SVG générés
```

## Conventions

- Thème : chaque section déclare `data-theme="dark|light"` ; le fond du site se transforme au scroll.
- Curseur : `data-cursor="view|drag|read|button|hidden"` + `data-cursor-label` optionnel.
- Tout le contenu éditorial est dans `lib/content.ts` et `lib/site.ts`.
