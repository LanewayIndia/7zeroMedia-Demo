// src/app/services/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import Service from "@/components/services/Services"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
    title: "Our Services",
    description:
        "Explore 7ZeroMedia's six precision-engineered growth systems: Marketing Strategy, Brand Identity, Content Creation, Social Media Management, Filming & Production, and AI Marketing Audit. Each service compounds the next.",
    keywords: [
        "marketing strategy agency",
        "brand identity design",
        "content creation agency",
        "social media management India",
        "video production agency",
        "AI marketing audit",
        "growth marketing services",
    ],
    alternates: {
        canonical: `${BASE_URL}/services`,
    },
    openGraph: {
        title: "7ZeroMedia Services — Six Growth Systems Built to Compound",
        description:
            "Six precision-engineered systems — Marketing Strategy, Brand Identity, Content Creation, Social Media, Filming & Production, and AI Audit — one unified growth engine.",
        url: `${BASE_URL}/services`,
        type: "website",
    },
}

export default function ServicePage() {
    return (
        <div>
            <Navbar />
            <main><Service /></main>
            <Footer />
        </div>
    )
}