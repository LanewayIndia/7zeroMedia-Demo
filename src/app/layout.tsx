import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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
  icons: {
    icon: "/favicon.ico",
  },
  title: "7zeroMedia",
  description: "7zeroMedia - Marketing, Branding, Content Creation, Filming Company",

  openGraph: {
    title: "7zeroMedia",
    description: "7zeroMedia - Marketing, Branding, Content Creation, Filming Company",
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
    description: "7zeroMedia - Marketing, Branding, Content Creation, Filming Company",
    images: [`${siteUrl}/logo.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <head></head>
      <body className="font-sans bg-background text-foreground"
        data-new-gr-c-s-check-loaded="14.1274.0"
        data-gr-ext-installed="">
        {children}
      </body>
    </html>
  );
}
