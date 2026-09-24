import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { CaseStudy } from "@/components/sections/CaseStudy";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.category}`,
    description: project.excerpt,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.name} — NOCTIS STUDIO`, description: project.excerpt, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const next = projects[(index + 1) % projects.length];
  return <CaseStudy project={projects[index]} next={next} />;
}
