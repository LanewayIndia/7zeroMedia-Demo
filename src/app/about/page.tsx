// src/app/about/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import About from "@/components/about/About"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Meet the team behind 7ZeroMedia — an AI-powered media and marketing agency headquartered in Kerala and Bangalore, India. We build precision-engineered growth systems for ambitious brands.",
    alternates: {
        canonical: `${BASE_URL}/about`,
    },
    openGraph: {
        title: "About 7ZeroMedia — Our Story & Team",
        description:
            "Meet the team behind 7ZeroMedia. We are an AI-powered media and marketing agency building growth systems for ambitious brands across India and beyond.",
        url: `${BASE_URL}/about`,
        type: "website",
    },
}

export default function AboutPage() {
    return (
        <div>
            <Navbar />
            <main><About /></main>
            <Footer />
        </div>
    )
}