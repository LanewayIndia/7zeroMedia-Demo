"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ArrowRight, ChevronRight } from "lucide-react"

export default function Home() {
    const heroHeadRef = useRef<HTMLHeadingElement>(null)
    const heroSubRef = useRef<HTMLParagraphElement>(null)
    const heroCTARef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance timeline — fires immediately on mount
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
            tl
                .fromTo(heroHeadRef.current,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 }
                )
                .fromTo(heroSubRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.85 },
                    "-=0.6"
                )
                .fromTo(heroCTARef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.75 },
                    "-=0.5"
                )
        })

        return () => ctx.revert()
    }, [])

    return (
        <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden px-6 md:px-16 lg:px-24 pt-32 pb-24 bg-white">

            {/* ── Background decorations ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Orange glow — top right */}
                <div
                    className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)",
                    }}
                />
                {/* Abstract AI node diagram — right side */}
                <svg
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] opacity-[0.045]"
                    viewBox="0 0 520 520"
                    fill="none"
                >
                    <circle cx="260" cy="260" r="200" stroke="#111" strokeWidth="1" strokeDasharray="6 10" />
                    <circle cx="260" cy="260" r="130" stroke="#111" strokeWidth="1" />
                    <circle cx="260" cy="260" r="60" stroke="#F97316" strokeWidth="1.5" />
                    <circle cx="260" cy="60" r="6" fill="#F97316" opacity="0.7" />
                    <circle cx="460" cy="260" r="6" fill="#111" opacity="0.5" />
                    <circle cx="260" cy="460" r="6" fill="#111" opacity="0.5" />
                    <circle cx="60" cy="260" r="6" fill="#111" opacity="0.5" />
                    <line x1="260" y1="60" x2="260" y2="200" stroke="#F97316" strokeWidth="1" opacity="0.4" />
                    <line x1="460" y1="260" x2="390" y2="260" stroke="#111" strokeWidth="1" opacity="0.3" />
                    <line x1="60" y1="260" x2="130" y2="260" stroke="#111" strokeWidth="1" opacity="0.3" />
                </svg>
            </div>

            {/* ── Content ── */}
            <div className="relative max-w-5xl">

                {/* Eyebrow tag */}
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-[#F97316]/25 rounded-full bg-[#F97316]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#F97316]">
                        AI-First Growth Infrastructure
                    </span>
                </div>

                {/* Headline */}
                <h1
                    ref={heroHeadRef}
                    className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.03] tracking-tight mb-8 text-[#111111]"
                >
                    AI-Powered Growth
                    <br />
                    <span className="text-[#111111]/20">Systems That</span>
                    <br />
                    <span
                        style={{
                            background: "linear-gradient(135deg, #F97316 0%, #fb923c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Scale Brands.
                    </span>
                </h1>

                {/* Subheading */}
                <p
                    ref={heroSubRef}
                    className="text-lg md:text-xl text-[#111111]/50 max-w-2xl mb-12 leading-relaxed"
                >
                    We don&apos;t run campaigns — we build growth infrastructure. Content systems, distribution
                    engines, and performance loops that compound revenue month over month.
                </p>

                {/* CTAs */}
                <div ref={heroCTARef} className="flex flex-wrap items-center gap-4">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#F97316] text-white font-semibold text-sm tracking-wide hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(249,115,22,0.3)]"
                    >
                        Start Your Growth System
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#111111]/15 text-[#111111] font-medium text-sm hover:border-[#111111]/40 transition-all duration-200"
                    >
                        Explore Services
                        <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center gap-6 mt-16 pt-10 border-t border-[#111111]/8">
                    {["AI-Driven Strategy", "Full-Stack Execution", "ROI-First Systems", "Dedicated Growth Team"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-[#111111]/40 font-medium tracking-wide">
                            <span className="w-1 h-1 rounded-full bg-[#F97316]" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}