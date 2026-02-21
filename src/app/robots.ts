import type { MetadataRoute } from "next";

/**
 * Generates /robots.txt via Next.js App Router.
 *
 * Rules:
 *  - Allow all crawlers on public pages
 *  - Disallow API routes, auth pages, and private directories
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // server-side API routes — not indexable content
          "/auth/", // authentication pages
          "/_next/", // Next.js internals
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
