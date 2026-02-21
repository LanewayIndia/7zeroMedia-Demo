// src/app/our-work/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
    title: "Our Work",
    description:
        "Browse the 7ZeroMedia portfolio — case studies, campaigns, brand identities, and cinematic productions we have delivered for clients across India and beyond.",
    alternates: {
        canonical: `${BASE_URL}/our-work`,
    },
    openGraph: {
        title: "Our Work — 7ZeroMedia Portfolio & Case Studies",
        description:
            "Real campaigns, real results. Explore 7ZeroMedia's portfolio of brand identity design, content campaigns, social media strategies, and cinematic productions.",
        url: `${BASE_URL}/our-work`,
        type: "website",
    },
}

export default function OurWorkPage() {
    return (
        <div>
            <Navbar />
            <main>
                {/* Portfolio / case studies content goes here */}
                <section
                    className="min-h-screen flex items-center justify-center px-6 py-32"
                    aria-label="Our Work — coming soon"
                >
                    <div className="text-center max-w-lg">
                        <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#F97316] mb-6 block">
                            Portfolio
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#111111] leading-tight mb-6">
                            Our Work
                        </h1>
                        <p className="text-[#111111]/50 text-base leading-relaxed">
                            Case studies, campaigns, and productions are on their way. Check back soon.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
