// src/app/careers/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import Careers from "@/components/careers/Careers"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
    title: "Careers",
    description:
        "Join the 7ZeroMedia team. We are hiring talented Social Media Strategists and Video Editors passionate about AI-powered marketing and creative production. Apply now.",
    keywords: [
        "marketing jobs",
        "social media manager job India",
        "video editor job Bangalore",
        "creative agency careers",
        "7ZeroMedia jobs",
    ],
    alternates: {
        canonical: `${BASE_URL}/careers`,
    },
    openGraph: {
        title: "Careers at 7ZeroMedia — Join Our Growth Team",
        description:
            "We are hiring talented people who are passionate about AI-powered marketing and creative storytelling. View open positions and apply today.",
        url: `${BASE_URL}/careers`,
        type: "website",
    },
}

export default function CareersPage() {
    return (
        <div>
            <Navbar />
            <main><Careers /></main>
            <Footer />
        </div>
    )
}