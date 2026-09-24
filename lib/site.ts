export const site = {
  name: "NOCTIS STUDIO",
  shortName: "NOCTIS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://noctis.studio",
  tagline: "We design digital experiences that people remember.",
  description:
    "NOCTIS STUDIO is an independent creative studio in Paris crafting visual identities, experimental websites, digital products and interactive 3D experiences for ambitious brands.",
  email: "hello@noctis.studio",
  phone: "+33 1 99 00 26 26",
  address: "48 rue de la Folie-Méricourt, 75011 Paris",
  city: "Paris",
  country: "France",
  timeZone: "Europe/Paris",
  founded: 2014,
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
  ],
} as const;

export const navigation = [
  { index: "01", label: "Work", href: "/#work" },
  { index: "02", label: "About", href: "/#about" },
  { index: "03", label: "Services", href: "/#services" },
  { index: "04", label: "Stories", href: "/#stories" },
  { index: "05", label: "Contact", href: "/#contact" },
] as const;

export const mailto = `mailto:${site.email}?subject=${encodeURIComponent("New project — NOCTIS STUDIO")}`;
