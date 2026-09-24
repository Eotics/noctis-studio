import type { Metadata } from "next";
import { Stories } from "@/components/sections/Stories";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Stories",
  description: "Notes from NOCTIS STUDIO on digital brands, real-time 3D on the web and designing for AI.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  return (
    <>
      <div style={{ paddingTop: "calc(var(--nav-h) + 4vh)" }} />
      <Stories standalone />
      <Contact />
    </>
  );
}
