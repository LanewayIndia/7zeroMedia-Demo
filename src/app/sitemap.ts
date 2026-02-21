import type { MetadataRoute } from "next";

/**
 * Dynamically generates sitemap.xml served at /sitemap.xml.
 * Next.js reads this at build time (static) or on demand (dynamic).
 *
 * Priority scale used here:
 *   1.0  — Homepage (most important)
 *   0.9  — Core service/marketing pages (Services, Our Work)
 *   0.8  — Supporting content pages (About, Blogs)
 *   0.7  — Utility / form pages (Contact, Careers)
 *
 * changeFrequency reflects how often content actually changes.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/our-work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
