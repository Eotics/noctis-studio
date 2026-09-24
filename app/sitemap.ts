import type { MetadataRoute } from "next";
import { legalPages, projects, stories } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-24");
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/stories"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.8 })),
    ...stories.map((s) => ({ url: absoluteUrl(`/stories/${s.slug}`), lastModified: new Date(s.dateTime), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...legalPages.map((l) => ({ url: absoluteUrl(`/legal/${l.slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
