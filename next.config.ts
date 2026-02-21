import type { NextConfig } from "next";

/**
 * ENVIRONMENT VARIABLES REQUIRED FOR PRODUCTION:
 *
 *   NEXT_PUBLIC_SITE_URL=https://www.7zero.media
 *
 * Add this to your Vercel / hosting environment variables.
 * It is used by metadata (OG URLs, canonical, sitemap, robots).
 * Without it, the fallback "https://www.7zero.media" is used.
 */

const nextConfig: NextConfig = {
  /* ── Security Headers ────────────────────────────────────────────────────
       Applied to every route. These headers harden the app against common
       attacks — clickjacking, MIME sniffing, referrer leakage, etc.
    ─────────────────────────────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent the page being embedded in an iframe on another origin (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Block MIME-sniffing — browser must respect the declared Content-Type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't send the full Referer to external domains
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Enable XSS auditor in legacy browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HSTS — tell browsers to always use HTTPS (1 year, include subdomains)
          // IMPORTANT: only enable after you have HTTPS confirmed on production.
          // { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },

  /* ── Image domains ───────────────────────────────────────────────────────
       Add external image hostnames here if you serve images from a CDN.
    ─────────────────────────────────────────────────────────────────────── */
  // images: {
  //   remotePatterns: [{ protocol: "https", hostname: "cdn.7zero.media" }],
  // },
};

export default nextConfig;
