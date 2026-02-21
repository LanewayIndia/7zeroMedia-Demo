// src/app/layout.tsx

import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import PageTransition from "@/components/PageTransition"
import "./globals.css"

/* ─── Fonts ───────────────────────────────────────────────────────────────── */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",       // prevent FOIT — text visible in fallback font immediately
  preload: true,
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

/* ─── Site constants ──────────────────────────────────────────────────────── */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

// Shared OG image used as the global fallback across every page.
// Individual pages can override by exporting their own `metadata.openGraph.images`.
const OG_IMAGE = {
  url: `${BASE_URL}/og-image.png`,   // 1200×630 PNG (see: public/og-image.png)
  width: 1200,
  height: 630,
  alt: "7ZeroMedia — AI-Powered Media & Marketing Agency",
  type: "image/png",
} as const

/* ─── Root metadata (global fallback) ────────────────────────────────────────
   Every page inherits these via the `template` title pattern and can selectively
   override individual fields by exporting its own `metadata` object.
   Docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
─────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  /* ── Base URL — resolves all relative paths in metadata ─────────────────
     Production: set NEXT_PUBLIC_SITE_URL in your hosting environment (.env.production).
     Local:  falls back to localhost so dev OG previews still work.
  ──────────────────────────────────────────────────────────────────────── */
  metadataBase: new URL(BASE_URL),

  /* ── Title ──────────────────────────────────────────────────────────────
     `template` applies to every page that sets `title` as a string.
     `default` is shown on pages that export no metadata at all.
  ──────────────────────────────────────────────────────────────────────── */
  title: {
    default: "7ZeroMedia — AI-Powered Media & Marketing Agency",
    template: "%s | 7ZeroMedia",
  },

  /* ── Description ────────────────────────────────────────────────────────
     Aim for 150-160 characters — Google truncates beyond that.
  ──────────────────────────────────────────────────────────────────────── */
  description:
    "7ZeroMedia is an AI-powered media and marketing agency specialising in brand strategy, content creation, social media management, and cinematic production — built to compound your growth.",

  /* ── Keywords ───────────────────────────────────────────────────────────
     Used by some secondary search engines & Bing. Google ignores meta keywords
     but other tools (Yoast, SEMrush) read them for auditing.
  ──────────────────────────────────────────────────────────────────────── */
  keywords: [
    "AI marketing agency",
    "media marketing",
    "brand identity",
    "content creation",
    "social media management",
    "video production",
    "digital marketing India",
    "marketing agency Bangalore",
    "marketing agency Kerala",
    "7ZeroMedia",
    "7zero.media",
    "growth marketing",
    "performance marketing",
  ],

  /* ── Authors & generator ────────────────────────────────────────────────*/
  authors: [{ name: "7ZeroMedia", url: BASE_URL }],
  creator: "7ZeroMedia",
  publisher: "7ZeroMedia",

  /* ── Canonical URL (root) ────────────────────────────────────────────── */
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL,
      "en-IN": BASE_URL,
    },
  },

  /* ── Robots ─────────────────────────────────────────────────────────────
     index + follow: let Google index and follow links.
     googleBot block provides Google-specific overrides (more snippet control).
  ──────────────────────────────────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,   // no limit on video snippet
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Open Graph ─────────────────────────────────────────────────────────
     Used by Facebook, LinkedIn, WhatsApp, Discord, Slack previews.
  ──────────────────────────────────────────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "7ZeroMedia",
    title: "7ZeroMedia — AI-Powered Media & Marketing Agency",
    description:
      "AI-driven brand strategy, content creation, social media, and cinematic production — one growth engine for ambitious brands.",
    images: [OG_IMAGE],
  },

  /* ── Twitter / X Card ───────────────────────────────────────────────────
     summary_large_image shows a full-width image card in the feed.
  ──────────────────────────────────────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "7ZeroMedia — AI-Powered Media & Marketing Agency",
    description:
      "AI-driven brand strategy, content creation, social media, and cinematic production — one growth engine for ambitious brands.",
    images: [OG_IMAGE.url],
    site: "@7zeromedia",          // Twitter/X handle — update if different
    creator: "@7zeromedia",
  },

  /* ── Category ────────────────────────────────────────────────────────── */
  category: "Marketing & Advertising",

  /* ── Verification tokens ─────────────────────────────────────────────────
     Add your Google Search Console / Bing Webmaster verification codes here.
     See: https://search.google.com/search-console → Settings → Ownership verification
  ──────────────────────────────────────────────────────────────────────── */
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  //   bing: "YOUR_BING_TOKEN",
  // },

  /* ── Icons ───────────────────────────────────────────────────────────── */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  /* ── Manifest ────────────────────────────────────────────────────────── */
  manifest: "/site.webmanifest",
}

/* ─── Viewport ────────────────────────────────────────────────────────────── */

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,           // allow pinch-to-zoom — required for accessibility (WCAG 1.4.4)
  userScalable: true,
}

/* ─── JSON-LD Structured Data ─────────────────────────────────────────────────
   Schema.org structured data improves rich results in Google (Knowledge Panel,
   Sitelinks Searchbox, etc.).  Added via a <script type="application/ld+json">
   tag in the <head> — this is the recommended approach for Next.js App Router.
─────────────────────────────────────────────────────────────────────────── */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "7ZeroMedia",
  alternateName: "7Zero Media",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: "512",
    height: "512",
  },
  description:
    "7ZeroMedia is an AI-powered media and marketing agency specialising in brand strategy, content creation, social media management, and cinematic production.",
  foundingDate: "2024",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9961348942",
      contactType: "customer service",
      email: "info@7zero.media",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "1087 B, Sankranthi, Perumbaikkad",
      addressLocality: "Kottayam",
      addressRegion: "Kerala",
      postalCode: "686016",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Koramangala 8th Block",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560095",
      addressCountry: "IN",
    },
  ],
  sameAs: [
    "https://www.instagram.com/7zero.media",
    "https://www.linkedin.com/company/7zeromedia/",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Marketing & Media Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Marketing Strategy" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Identity" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Content Creation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Social Media Management" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Filming & Production" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Marketing Audit" } },
    ],
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "7ZeroMedia",
  description: "AI-powered media and marketing agency.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

/* ─── Root Layout ─────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <head>
        {/* ── JSON-LD: Organization ──────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* ── JSON-LD: WebSite (enables Sitelinks Searchbox) ─────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground">
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}