export type Project = {
  slug: string;
  index: string;
  name: string;
  category: string;
  client: string;
  location: string;
  year: string;
  excerpt: string;
  services: string[];
  cover: string;
  alt: string;
  palette: string[];
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: { value: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "aether",
    index: "01",
    name: "Aether",
    category: "Digital Experience",
    client: "Aether Observatory",
    location: "Valais, Switzerland",
    year: "2026",
    excerpt:
      "An immersive web journey for a private Alpine observatory, turning forty years of sky data into a universe you can navigate.",
    services: ["Art Direction", "WebGL", "Creative Development", "Sound Design"],
    cover: "/images/work/aether.svg",
    alt: "Deep blue planet circled by thin orbital lines, with a single orange satellite on a starry background.",
    palette: ["#04050A", "#1F2677", "#9AA3FF", "#FF3D00"],
    challenge:
      "Aether holds one of Europe's longest private records of the night sky — 1.2 billion observations that had never left a research server. The observatory wanted the public to feel the scale of that archive without reading a single chart.",
    approach: [
      "We built a real-time star field from the actual dataset, streamed in tiles so the first frame renders in under a second, even on a mid-range phone.",
      "Scrolling becomes time travel: every notch of the wheel moves the sky by a year, and the interface quietly annotates the events worth stopping for.",
      "A generative score, composed with the observatory's own radio recordings, reacts to the density of stars on screen.",
    ],
    outcome:
      "Aether became the observatory's main fundraising tool. Visitors spend an average of seven minutes exploring, and the membership programme sold out within the first month.",
    metrics: [
      { value: "7m12s", label: "Average session" },
      { value: "1.2B", label: "Data points rendered" },
      { value: "+310%", label: "Memberships" },
    ],
  },
  {
    slug: "motorlab",
    index: "02",
    name: "Motorlab",
    category: "Brand Identity / Web",
    client: "Motorlab Torino",
    location: "Turin, Italy",
    year: "2025",
    excerpt:
      "A kinetic identity and launch platform for an electric motorcycle lab that builds its machines from first principles.",
    services: ["Brand Strategy", "Identity System", "Web Design", "Motion"],
    cover: "/images/work/motorlab.svg",
    alt: "Black wheel with fine spokes next to horizontal speed stripes and a geometric ML monogram on off-white paper.",
    palette: ["#E8E5DE", "#0B0B0C", "#FF3D00", "#8C8A84"],
    challenge:
      "Founded by former Formula E engineers, Motorlab had a prototype that outperformed the market and a brand that looked like a spreadsheet. They needed an identity as precise as their engineering, ready for a public launch in five months.",
    approach: [
      "The identity is built on a single rule: every element is derived from the geometry of the wheel. Spokes become a grid, speed becomes stripes, torque becomes type weight.",
      "A variable monogram stretches with velocity — static on paper, alive on screens and on the machine's own dashboard.",
      "The launch site was designed as a technical dossier: dense, honest, and fast, with every specification one click away.",
    ],
    outcome:
      "The pre-order campaign reached its annual target in eleven days. The identity system is now used across product, retail and racing liveries.",
    metrics: [
      { value: "11 days", label: "To annual pre-order target" },
      { value: "64", label: "Identity components" },
      { value: "0.8s", label: "Largest contentful paint" },
    ],
  },
  {
    slug: "orbit",
    index: "03",
    name: "Orbit",
    category: "AI Experience",
    client: "Orbit Climate Lab",
    location: "Amsterdam, Netherlands",
    year: "2026",
    excerpt:
      "A conversational interface for a climate research model, designed to make uncertainty legible to policymakers.",
    services: ["AI Product Design", "UX Research", "Interface Design", "Prototyping"],
    cover: "/images/work/orbit.svg",
    alt: "Glowing white core surrounded by dotted orbital rings and connected nodes over violet and teal light, above a voice waveform.",
    palette: ["#060608", "#5B3CFF", "#22D3C5", "#FFFFFF"],
    challenge:
      "Orbit's forecasting model is remarkably accurate, but its answers were being quoted without their margins of error. The lab asked us to design an assistant that never hides what it does not know.",
    approach: [
      "Every answer is displayed as an orbit: the core is the most probable outcome, the rings are the plausible ones. Confidence is visible before the text is even read.",
      "We prototyped with forty policymakers across six countries, iterating weekly on real questions rather than scripted scenarios.",
      "Latency became part of the language — the interface shows what the model is doing while it thinks, instead of a spinner.",
    ],
    outcome:
      "Orbit is now used by three European ministries. In testing, misquoted forecasts dropped by 72% compared with the previous report format.",
    metrics: [
      { value: "−72%", label: "Misquoted forecasts" },
      { value: "40", label: "Policymakers interviewed" },
      { value: "3", label: "Ministries onboard" },
    ],
  },
  {
    slug: "nova",
    index: "04",
    name: "Nova",
    category: "E-Commerce Experience",
    client: "Nova Parfums",
    location: "Copenhagen, Denmark",
    year: "2025",
    excerpt:
      "A sensorial storefront for a Copenhagen fragrance house where every scent comes with its own weather.",
    services: ["E-Commerce", "Art Direction", "Shopify Headless", "3D Product"],
    cover: "/images/work/nova.svg",
    alt: "Frosted glass perfume bottle labelled NOVA Nº07 Brume against a warm peach sunset horizon.",
    palette: ["#F5E6D8", "#EBBF9F", "#C46E4F", "#17110F"],
    challenge:
      "Fragrance is the hardest product to sell online: you cannot smell a screen. Nova wanted a store that sells a feeling first and a bottle second — without sacrificing conversion.",
    approach: [
      "Each fragrance lives in its own atmosphere: light, grain, temperature and sound are tuned to its notes, and shift with the visitor's local time.",
      "A guided discovery flow translates moods into scents in four questions, then ships a sample set before the full bottle.",
      "Under the poetry, a headless Shopify stack keeps checkout fast, accessible and familiar.",
    ],
    outcome:
      "Online revenue doubled in the first season, and the sample-to-bottle conversion rate reached 38%.",
    metrics: [
      { value: "×2.1", label: "Online revenue" },
      { value: "38%", label: "Sample to bottle" },
      { value: "98", label: "Lighthouse performance" },
    ],
  },
  {
    slug: "form",
    index: "05",
    name: "Form",
    category: "Creative Technology",
    client: "Biennale of Spatial Design",
    location: "Venice, Italy",
    year: "2024",
    excerpt:
      "A generative installation and web tool that lets visitors sculpt their own pavilion — with their hands, in real time.",
    services: ["Creative Technology", "Installation", "Generative Design", "Web App"],
    cover: "/images/work/form.svg",
    alt: "Isometric field of grey extruded columns of varying heights with one orange block standing out.",
    palette: ["#0E0E10", "#3A3A3F", "#8A8A90", "#FF3D00"],
    challenge:
      "The biennale wanted an installation that would outlive the exhibition: something visitors could create in the room and continue at home.",
    approach: [
      "Hand tracking turns gestures into architecture. Raise a palm and the columns follow; close it and the structure freezes.",
      "Every pavilion is saved as a seed — a short code that rebuilds the exact same form in the browser, months later.",
      "The same engine powers the installation, the website and a 3D-printable export, from a single codebase.",
    ],
    outcome:
      "Over 26,000 pavilions were generated during the six months of the exhibition. A selection was printed and shown in the closing show.",
    metrics: [
      { value: "26K", label: "Pavilions generated" },
      { value: "6", label: "Months on site" },
      { value: "1", label: "Shared codebase" },
    ],
  },
];

export type Service = {
  index: string;
  title: string;
  description: string;
  deliverables: string[];
  preview: string;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Brand Identity",
    description:
      "Strategy, naming and visual systems designed to flex across every screen, space and surface — built to move, not just to sit on a page.",
    deliverables: ["Strategy", "Naming", "Logotype", "Guidelines"],
    preview: "/images/work/motorlab.svg",
  },
  {
    index: "02",
    title: "Web Design",
    description:
      "Editorial, art-directed websites where hierarchy, rhythm and motion are designed together, from the first sketch to the last pixel.",
    deliverables: ["Art direction", "UX architecture", "Interface", "Design system"],
    preview: "/images/work/aether.svg",
  },
  {
    index: "03",
    title: "Creative Development",
    description:
      "Next.js, WebGL and GSAP engineered in-house. We prototype in code from day one, so ideas survive all the way to production.",
    deliverables: ["Front-end", "WebGL", "Headless CMS", "Performance"],
    preview: "/images/work/form.svg",
  },
  {
    index: "04",
    title: "AI Experiences",
    description:
      "Conversational products, generative tools and agent interfaces that stay useful, legible and honest about what they know.",
    deliverables: ["AI product design", "Prototyping", "Conversation design", "Evaluation"],
    preview: "/images/work/orbit.svg",
  },
  {
    index: "05",
    title: "Product Design",
    description:
      "Research, UX and design systems for digital products people open every day — and would miss if they disappeared.",
    deliverables: ["Research", "UX", "UI", "Design ops"],
    preview: "/images/work/nova.svg",
  },
  {
    index: "06",
    title: "Motion & 3D",
    description:
      "Real-time 3D, motion languages and interactive installations that give brands a physical presence on the screen.",
    deliverables: ["Motion language", "Real-time 3D", "Installations", "Launch films"],
    preview: "/images/stories/why-3d-changes-web-design.svg",
  },
];

export const stats = [
  { value: 12, decimals: 0, suffix: "+", label: "Years" },
  { value: 38, decimals: 0, suffix: "", label: "Projects" },
  { value: 14, decimals: 0, suffix: "", label: "Countries" },
  { value: 2.4, decimals: 1, suffix: "M+", label: "Users reached" },
];

export const principles = [
  { title: "Small by design", text: "Seven people. No account managers, no hand-offs. The people you meet are the people who make." },
  { title: "Code is craft", text: "Designers prototype in the browser and developers sit in art direction. The line between them is deliberately blurry." },
  { title: "Built to last", text: "Fast, accessible and maintainable. Beauty that breaks in six months is not beauty." },
];

export const clients = ["Aether", "Motorlab", "Orbit", "Nova", "Biennale", "Maison Ferrand", "Kōdo", "Atelier Sève", "Northwind", "Halden"];

export type Story = {
  slug: string;
  title: string;
  date: string;
  dateTime: string;
  readingTime: string;
  category: string;
  excerpt: string;
  cover: string;
  alt: string;
  body: { heading?: string; paragraphs: string[] }[];
};

export const stories: Story[] = [
  {
    slug: "the-future-of-digital-brands",
    title: "The future of digital brands",
    date: "12.03.2026",
    dateTime: "2026-03-12",
    readingTime: "6 min read",
    category: "Branding",
    excerpt: "Logos are becoming systems, and systems are becoming behaviours. What it means to design a brand that moves.",
    cover: "/images/stories/future-of-digital-brands.svg",
    alt: "Grid of black shapes morphing from rotated squares into circles, with one orange shape.",
    body: [
      {
        paragraphs: [
          "For most of the twentieth century, a brand was something you could print. A mark, a typeface, two colours and a manual thick enough to stop a door. That model assumed the brand would be seen in a handful of predictable places, at a handful of predictable sizes.",
          "Today a brand lives in a notification, a voice assistant, a dashboard, a store window and a three-second video — often at the same moment. The static logo has not disappeared, but it has become the smallest part of the job.",
        ],
      },
      {
        heading: "From marks to systems",
        paragraphs: [
          "The identities we design now start with rules rather than artefacts. How does the brand behave when the screen is tiny? When it is waiting? When it is wrong? A good system answers these questions before anyone asks them, so that a product team in another time zone can make the right decision without calling us.",
          "In practice this means designing tokens, motion curves and sound as carefully as the logotype. It also means accepting that the brand will be assembled by people and software we will never meet.",
        ],
      },
      {
        heading: "From systems to behaviours",
        paragraphs: [
          "The next step is already visible: brands defined less by how they look than by how they respond. The speed of an animation, the tone of an error message, the way an interface admits it does not know — these are brand decisions, and users remember them longer than colours.",
          "Our advice to clients is simple. Write down how your brand should behave, not just how it should look. Then build it in code as early as possible, because behaviour cannot be judged on a slide.",
        ],
      },
    ],
  },
  {
    slug: "why-3d-changes-web-design",
    title: "Why 3D changes web design",
    date: "28.05.2026",
    dateTime: "2026-05-28",
    readingTime: "8 min read",
    category: "Technology",
    excerpt: "Depth is no longer a gimmick. How real-time rendering is quietly rewriting the grammar of the web page.",
    cover: "/images/stories/why-3d-changes-web-design.svg",
    alt: "White wireframe cube floating above a perspective grid that fades into darkness.",
    body: [
      {
        paragraphs: [
          "Ten years ago, putting 3D on a website meant a heavy plugin, a loading bar and a warning for mobile users. Today every phone in your pocket ships a GPU more capable than the workstations that rendered the first Pixar films.",
          "The technology is ready. The real question is no longer whether we can use depth on the web, but when it genuinely serves the story.",
        ],
      },
      {
        heading: "Depth as hierarchy",
        paragraphs: [
          "Flat design taught us to organise information on a plane. Real-time 3D adds an axis — and with it, a new way to signal importance. Objects closer to the viewer feel urgent; objects further away feel contextual. Used with restraint, depth is simply another typographic tool.",
          "Most of the 3D we build is never the main content. It is lighting, atmosphere, a reflection that tells you where the cursor is. The best compliment we receive is when people do not notice it until it is gone.",
        ],
      },
      {
        heading: "Performance is the design",
        paragraphs: [
          "A beautiful scene that stutters is a broken scene. We set a performance budget before we set a colour palette: draw calls, texture memory, a frame target for a three-year-old Android phone. Everything else follows.",
          "That discipline shapes the aesthetic. Procedural geometry instead of heavy models. Light instead of textures. A single object, perfectly lit, instead of a crowded world. Constraints, as always, produce style.",
        ],
      },
    ],
  },
  {
    slug: "designing-for-ai",
    title: "Designing for AI",
    date: "09.09.2026",
    dateTime: "2026-09-09",
    readingTime: "7 min read",
    category: "AI",
    excerpt: "Interfaces that think need interfaces that explain. Notes on trust, latency and designing for the unknown.",
    cover: "/images/stories/designing-for-ai.svg",
    alt: "Topographic white contour lines rippling across a dark field, with one orange line.",
    body: [
      {
        paragraphs: [
          "Traditional software is deterministic: the same input produces the same output, and a designer can map every state. AI products break that contract. The same question can produce a different answer tomorrow, and some answers will be wrong with total confidence.",
          "Designing for that uncertainty is the most interesting problem our studio has worked on in years.",
        ],
      },
      {
        heading: "Make confidence visible",
        paragraphs: [
          "When we designed Orbit for a climate research lab, the first principle was that uncertainty should be seen before it is read. A forecast with wide margins looks different from a forecast with narrow ones, at a glance, before a single word is parsed.",
          "This is not a visual flourish. It changes how people quote and share results, and in high-stakes contexts it is the difference between a useful tool and a dangerous one.",
        ],
      },
      {
        heading: "Latency is a feeling",
        paragraphs: [
          "Models take time to think, and a spinner tells the user nothing. We treat waiting as a moment to build trust: showing which sources are being read, which steps are being taken, and giving people the chance to redirect before the answer arrives.",
          "The goal is not to make AI feel magical. It is to make it feel accountable — a collaborator whose reasoning you can follow, question and, when necessary, overrule.",
        ],
      },
    ],
  },
];

export type LegalPage = {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; text: string }[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    updated: "1er septembre 2026",
    sections: [
      {
        heading: "Éditeur du site",
        text: "Le site noctis.studio est édité par NOCTIS STUDIO, société par actions simplifiée au capital de 20 000 €, dont le siège social est situé au 48 rue de la Folie-Méricourt, 75011 Paris, France. Contact : hello@noctis.studio.",
      },
      {
        heading: "Directeur de la publication",
        text: "Le directeur de la publication est le président de NOCTIS STUDIO, joignable à l'adresse hello@noctis.studio.",
      },
      {
        heading: "Hébergement",
        text: "Le site est hébergé par un prestataire d'hébergement cloud situé dans l'Union européenne. Les coordonnées complètes de l'hébergeur sont communiquées sur simple demande.",
      },
      {
        heading: "Propriété intellectuelle",
        text: "L'ensemble des contenus présents sur ce site (textes, visuels, animations, code, identité graphique) est la propriété exclusive de NOCTIS STUDIO ou de ses clients. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.",
      },
    ],
  },
  {
    slug: "politique-de-confidentialite",
    title: "Politique de confidentialité",
    updated: "1er septembre 2026",
    sections: [
      {
        heading: "Données collectées",
        text: "NOCTIS STUDIO ne collecte que les données que vous nous transmettez volontairement lorsque vous nous écrivez : nom, adresse e-mail et contenu de votre message. Aucune donnée n'est revendue ni cédée à des tiers.",
      },
      {
        heading: "Finalités",
        text: "Ces données sont utilisées exclusivement pour répondre à vos demandes et, le cas échéant, établir une proposition commerciale. Elles sont conservées trois ans au maximum après le dernier contact.",
      },
      {
        heading: "Vos droits",
        text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données. Pour l'exercer, écrivez-nous à hello@noctis.studio. Vous pouvez également introduire une réclamation auprès de la CNIL.",
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookies",
    updated: "1er septembre 2026",
    sections: [
      {
        heading: "Notre approche",
        text: "Ce site n'utilise aucun cookie publicitaire ni traceur tiers. Nous ne pratiquons ni profilage ni ciblage.",
      },
      {
        heading: "Stockage technique",
        text: "Seules des informations strictement nécessaires au fonctionnement du site peuvent être conservées localement dans votre navigateur, par exemple pour éviter de rejouer l'écran de chargement à chaque visite. Elles ne permettent pas de vous identifier.",
      },
      {
        heading: "Mesure d'audience",
        text: "Si une mesure d'audience est mise en place, elle sera anonymisée, hébergée en Europe et exemptée de consentement conformément aux recommandations de la CNIL.",
      },
    ],
  },
  {
    slug: "cgv",
    title: "Conditions générales de vente",
    updated: "1er septembre 2026",
    sections: [
      {
        heading: "Objet",
        text: "Les présentes conditions régissent les prestations de conseil, de design et de développement réalisées par NOCTIS STUDIO pour ses clients professionnels. Toute commande implique leur acceptation sans réserve.",
      },
      {
        heading: "Devis et commande",
        text: "Chaque projet fait l'objet d'un devis détaillé, valable trente jours. La commande est ferme à réception du devis signé et d'un acompte de 40 %.",
      },
      {
        heading: "Paiement",
        text: "Sauf mention contraire, les factures sont payables à trente jours. Tout retard entraîne l'application de pénalités au taux légal et d'une indemnité forfaitaire de 40 € pour frais de recouvrement.",
      },
      {
        heading: "Propriété intellectuelle",
        text: "Les droits d'exploitation des livrables sont cédés au client après paiement intégral, pour les usages définis au devis. NOCTIS STUDIO se réserve le droit de présenter le projet dans ses références.",
      },
    ],
  },
];
