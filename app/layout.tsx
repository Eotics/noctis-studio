import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { Preloader } from "@/components/ui/Preloader";
import { Navigation } from "@/components/ui/Navigation";
import { ThemeController } from "@/components/ui/ThemeController";
import { Footer } from "@/components/sections/Footer";
import "@/styles/globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "NOCTIS STUDIO — We design digital experiences that people remember",
    template: "%s — NOCTIS STUDIO",
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["creative studio", "digital agency Paris", "brand identity", "web design", "creative development", "WebGL", "AI experiences", "motion design"],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "NOCTIS STUDIO — We design digital experiences that people remember",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "NOCTIS STUDIO",
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  foundingDate: String(site.founded),
  address: { "@type": "PostalAddress", streetAddress: "48 rue de la Folie-Méricourt", postalCode: "75011", addressLocality: "Paris", addressCountry: "FR" },
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{"[data-preloader]{display:none!important}"}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <TransitionProvider>
            <Preloader />
            <Navigation />
            <main id="main">{children}</main>
            <Footer />
            <ThemeController />
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
