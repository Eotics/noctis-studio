import type { MetadataRoute } from "next";
import { legalPages, projects, stories } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-24");
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/stories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.8 })),
    ...stories.map((s) => ({ url: `${site.url}/stories/${s.slug}`, lastModified: new Date(s.dateTime), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...legalPages.map((l) => ({ url: `${site.url}/legal/${l.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
