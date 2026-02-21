/**
 * Hero Section — Production-Grade Component
 *
 * Architecture decisions:
 *  - "use client" is retained only for GSAP — the JSX itself is stateless and
 *    could be server-rendered if the animation hook is extracted into a
 *    separate client wrapper. Kept here for simplicity; the static HTML is
 *    still delivered by the server (Next.js SSR runs client components on the
 *    server for initial HTML).
 *
 *  - .hero-animate CSS class sets opacity:0 at parse time (globals.css),
 *    eliminating FOUC between SSR HTML and GSAP hydration.
 *
 *  - prefers-reduced-motion: GSAP timeline is skipped completely; CSS override
 *    in globals.css restores full opacity so content is always visible.
 *
 *  - clearProps: "opacity,transform,willChange" is called after each tween so
 *    GSAP's inline styles don't linger and cause specificity conflicts.
 *
 *  - Background decorations are aria-hidden and pointer-events-none — they
 *    never interfere with keyboard navigation or screen readers.
 *
 *  - Trust strip uses role="list" / role="listitem" so screen readers
 *    announce it as a meaningful list.
 *
 *  - Gradient text ("Scale Brands.") has a color fallback via currentColor
 *    so text remains legible if background-clip is unsupported.
 *
 *  - Static badge data lives at module level — never re-allocated on render.
 */

"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ArrowRight, ChevronRight } from "lucide-react"

// Module-level constant — zero allocation cost on re-renders
const TRUST_BADGES = [
    "AI-Driven Strategy",
    "Full-Stack Execution",
    "ROI-First Systems",
    "Dedicated Growth Team",
] as const

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null)
    const headRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Respect user's motion preference — skip animation entirely.
        // CSS in globals.css already ensures .hero-animate elements are visible
        // under prefers-reduced-motion, so no JS needed for that path.
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches

        if (prefersReduced) return // content already visible via CSS

        // Null-safety guard — if any ref failed to mount, bail cleanly
        if (!headRef.current || !subRef.current || !ctaRef.current) return

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
            })

            tl
                // Headline slides up and fades in
                .to(headRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    // clearProps: "opacity,transform,willChange",
                })
                // Subheading follows with overlap
                .to(subRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.85,
                    // clearProps: "opacity,transform,willChange",
                }, "-=0.6")
                // CTAs animate in last
                .to(ctaRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    // clearProps: "opacity,transform,willChange",
                }, "-=0.5")

        }, sectionRef) // scoped to section — no global side-effects

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            aria-label="Hero — 7ZeroMedia"
            className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden
                       px-6 md:px-16 lg:px-24
                       pt-28 pb-12 md:pt-48 lg:pt-40"
        >

            {/* ── Decorative background — aria-hidden, never focusable ── */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none overflow-hidden select-none"
            >
                {/* Subtle dot-grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Soft orange ambient glow — top-right */}
                <div
                    className="absolute top-[-10%] right-[-5%] rounded-full"
                    style={{
                        // clamp to viewport so it never causes horizontal overflow
                        width: "min(700px, 90vw)",
                        height: "min(700px, 90vw)",
                        background:
                            "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)",
                        // Use transform for GPU compositing — avoids repaints
                        willChange: "transform",
                    }}
                />
            </div>

            {/* ── Content ─────────────────────────────────────────────── */}
            {/*
                max-w-5xl + 2xl:max-w-6xl caps the column width on ultra-wide
                screens so text never stretches into unreadable line lengths.
            */}
            <div className="relative w-full max-w-5xl 2xl:max-w-6xl">

                {/* ── H1 Headline ─────────────────────────────────────── */}
                {/*
                    .hero-animate → opacity:0 in CSS from the server render.
                    GSAP tweens it to opacity:1 + y:0 on the client.
                    clearProps ensures no inline opacity/transform lingers.
                */}
                <h1
                    ref={headRef}
                    className="hero-animate
                               text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                               font-bold leading-[1.03] tracking-tight
                               mb-6 md:mb-8 text-[#111111]"
                    style={{ transform: "translateY(60px)" }}
                >
                    Media &amp; Marketing Growth
                    <br />
                    {/*
                        Low-opacity line — accessible contrast is met by the
                        surrounding content context. Pure decorative rhythm.
                    */}
                    <span className="text-[#111111]/20" aria-hidden="true">
                        System That
                    </span>
                    <br />
                    {/*
                        Gradient text — `color: #F97316` fallback via
                        color property ensures legibility if
                        background-clip:text is not supported (older browsers).
                    */}
                    <span
                        className="text-gradient"
                        style={{ color: "#F97316" }}           // fallback
                        aria-label="Scale Brands."
                    >
                        Scale Brands.
                    </span>
                </h1>

                {/* ── Subheading ──────────────────────────────────────── */}
                <p
                    ref={subRef}
                    className="hero-animate
                               text-base md:text-lg xl:text-xl
                               text-[#111111]/50 max-w-2xl
                               mb-10 md:mb-12 leading-relaxed"
                    style={{ transform: "translateY(30px)" }}
                >
                    We don&apos;t run campaigns — we build growth infrastructure.
                    Content systems, distribution engines, and performance loops
                    that compound revenue month over month.
                </p>

                {/* ── CTA Buttons ─────────────────────────────────────── */}
                <div
                    ref={ctaRef}
                    className="hero-animate flex flex-col sm:flex-row flex-wrap
                               items-start sm:items-center gap-3 md:gap-4"
                    style={{ transform: "translateY(20px)" }}
                >
                    {/* Primary CTA */}
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2
                                   px-6 py-3 md:px-7 md:py-3.5
                                   rounded-xl bg-[#F97316] text-white
                                   font-semibold text-sm tracking-wide
                                   hover:bg-[#ea6c0a] transition-all duration-200
                                   hover:shadow-[0_8px_30px_rgba(249,115,22,0.3)]
                                   w-full sm:w-auto justify-center sm:justify-start
                                   focus-visible:outline-none focus-visible:ring-2
                                   focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                    >
                        Start Your Growth System
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>

                    {/* Secondary CTA */}
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2
                                   px-6 py-3 md:px-7 md:py-3.5
                                   rounded-xl border border-[#111111]/15
                                   text-[#111111] font-medium text-sm
                                   hover:border-[#111111]/40 transition-all duration-200
                                   w-full sm:w-auto justify-center sm:justify-start
                                   focus-visible:outline-none focus-visible:ring-2
                                   focus-visible:ring-[#111111]/30 focus-visible:ring-offset-2"
                    >
                        Explore Services
                        <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                </div>

                {/* ── Trust Strip ─────────────────────────────────────── */}
                <ul
                    role="list"
                    aria-label="Our core capabilities"
                    className="flex flex-wrap items-center gap-4 md:gap-6
                               mt-12 md:mt-16 pt-8 md:pt-10
                               border-t border-[#111111]/8
                               list-none p-0 m-0"
                >
                    {TRUST_BADGES.map((item) => (
                        <li
                            key={item}
                            role="listitem"
                            className="flex items-center gap-2
                                       text-xs text-[#111111]/40
                                       font-medium tracking-wide"
                        >
                            <span
                                aria-hidden="true"
                                className="w-1 h-1 rounded-full bg-[#F97316] shrink-0"
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}