import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import PageTransition from "@/components/PageTransition"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const siteUrl = "http://localhost:3000/"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "/favicon.ico" },
  title: "7zeroMedia",
  description:
    "7zeroMedia - Marketing, Branding, Content Creation, Filming Company",
  openGraph: {
    title: "7zeroMedia",
    description:
      "7zeroMedia - Marketing, Branding, Content Creation, Filming Company",
    url: siteUrl,
    siteName: "7zeroMedia",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "7zeroMedia",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "7zeroMedia",
    description:
      "7zeroMedia - Marketing, Branding, Content Creation, Filming Company",
    images: [`${siteUrl}/logo.png`],
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

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
      <body className="font-sans bg-background text-foreground overflow-x-hidden">
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}