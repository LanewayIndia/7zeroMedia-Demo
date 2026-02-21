// src/app/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import Home from "@/components/home/Home"
import About from "@/components/about/About"
import Service from "@/components/services/Services"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
  title: "7ZeroMedia — AI-Powered Media & Marketing Agency",
  description:
    "7ZeroMedia builds AI-powered growth systems for ambitious brands — from strategy and brand identity to content, social media, and cinematic production. One unified growth engine.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "7ZeroMedia — AI-Powered Media & Marketing Agency",
    description:
      "AI-driven brand strategy, content creation, social media, and cinematic production. Six precision-engineered systems that compound your growth.",
    url: BASE_URL,
    type: "website",
  },
}

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="services"><Service /></section>
      </main>
      <Footer />
    </div>
  )
}
