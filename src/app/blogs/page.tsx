// src/app/blogs/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import Blogs from "@/components/blogs/Blogs"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Insights on AI marketing, brand strategy, content creation, social media, and growth from the 7ZeroMedia team. Stay ahead with expert perspectives on modern marketing.",
    alternates: {
        canonical: `${BASE_URL}/blogs`,
    },
    openGraph: {
        title: "7ZeroMedia Blog — Marketing Insights & Growth Intelligence",
        description:
            "Expert perspectives on AI marketing, brand strategy, content creation, and social media from the 7ZeroMedia team.",
        url: `${BASE_URL}/blogs`,
        type: "website",
    },
}

export default function BlogsPage() {
    return (
        <div>
            <Navbar />
            <main><Blogs /></main>
            <Footer />
        </div>
    )
}