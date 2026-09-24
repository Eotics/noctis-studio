import type { NextConfig } from "next";

// `npm run deploy` builds a static export for GitHub Pages, served from /<repo-name>.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport ? { output: "export" as const } : {}),
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
