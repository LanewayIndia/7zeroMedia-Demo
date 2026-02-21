"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
    ArrowRight,
    ArrowUpRight,
    Brain,
    BarChart2,
    ChevronRight,
    Film,
    Globe,
    Palette,
    Search,
    Zap,
    Target,
    TrendingUp,
    RefreshCw,
    Rocket,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ─────────────────────────────────────────────────────────── */

const services = [
    {
        tag: "Brand Identity",
        icon: Palette,
        headline: "Branding & Marketing",
        description:
            "We architect brands that speak before you do. From visual identity to messaging frameworks, we build systems that compound attention over time.",
        bullets: ["Brand Strategy & Positioning", "Visual Identity Systems", "Messaging Architecture"],
        href: "/services/branding",
    },
    {
        tag: "Social Growth",
        icon: TrendingUp,
        headline: "Strategic Social Media Growth",
        description:
            "Audience-first growth programs built on data, not guesses. Platform-native content strategies that convert followers into revenue.",
        bullets: ["Platform Growth Roadmaps", "Community Building", "Viral Content Frameworks"],
        href: "/services/social-media",
    },
    {
        tag: "Production",
        icon: Film,
        headline: "Content Creation & Production",
        description:
            "High-fidelity content at production scale. From scripting to shooting to post — every asset is built to perform, not just look good.",
        bullets: ["Video & Reel Production", "Script & Storyboard Systems", "Photo & Visual Assets"],
        href: "/services/content-creation",
    },
    {
        tag: "Performance",
        icon: BarChart2,
        headline: "Paid Ads & Performance Marketing",
        description:
            "ROI-driven paid systems across Meta, Google, and emerging channels. Every rupee tracked, every creative A/B tested.",
        bullets: ["Meta & Google Campaigns", "Creative Testing Frameworks", "Attribution & Reporting"],
        href: "/services/paid-ads",
    },
    {
        tag: "Organic Growth",
        icon: Search,
        headline: "SEO & Organic Growth",
        description:
            "Infrastructure-level SEO built for long-term compounding. Technical audits, content systems, and programmatic scale.",
        bullets: ["Technical SEO Architecture", "Content-Led SEO", "Programmatic Rank Strategy"],
        href: "/services/seo",
    },
    {
        tag: "Engineering",
        icon: Globe,
        headline: "Web Development & UX Systems",
        description:
            "We build conversion-first digital products. From landing pages to full-stack platforms — performance, design, and CRO baked in.",
        bullets: ["High-Performance Landing Pages", "CRO & UX Optimization", "Full-Stack Web Products"],
        href: "/services/web-development",
    },
]

const processSteps = [
    { icon: Brain, step: "01", label: "Discovery", desc: "Deep audit of your brand, market, and growth gaps." },
    { icon: Target, step: "02", label: "Strategy", desc: "Custom growth blueprint mapped to your revenue goals." },
    { icon: Zap, step: "03", label: "Activation", desc: "Rapid deployment of content, ads, and SEO systems." },
    { icon: BarChart2, step: "04", label: "Optimization", desc: "Continuous testing, reporting, and performance tuning." },
    { icon: RefreshCw, step: "05", label: "Compounding", desc: "Scale what works. Kill what doesn't. Iterate fast." },
    { icon: Rocket, step: "06", label: "Scale", desc: "Full-system scaling across channels, geographies, and products." },
]

/* ─── Component ─────────────────────────────────────────────────────── */

export default function Services() {

    // ── Page-load header refs (animate on mount)
    const pageTagRef = useRef<HTMLSpanElement>(null)
    const pageHeadRef = useRef<HTMLHeadingElement>(null)
    const pageSubRef = useRef<HTMLParagraphElement>(null)
    const pageDivRef = useRef<HTMLDivElement>(null)

    // ── Scroll-section refs
    const gridRef = useRef<HTMLDivElement>(null)
    const blueprintRef = useRef<HTMLDivElement>(null)
    const processRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── 1. Page-load entrance — fires immediately on mount
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .fromTo(pageTagRef.current,
                    { y: -16, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6 }
                )
                .fromTo(pageHeadRef.current,
                    { y: 44, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9 },
                    "-=0.35"
                )
                .fromTo(pageSubRef.current,
                    { y: 24, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7 },
                    "-=0.55"
                )
                .fromTo(pageDivRef.current,
                    { scaleX: 0, opacity: 0, transformOrigin: "left center" },
                    { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                    "-=0.35"
                )

            // ── 2. Service cards — stagger on scroll
            if (gridRef.current) {
                gsap.fromTo(
                    Array.from(gridRef.current.children),
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.75,
                        stagger: { each: 0.1, ease: "power1.in" },
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top bottom",
                            once: true,
                        },
                    }
                )
            }

            // ── 3. Blueprint section
            gsap.fromTo(
                blueprintRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: blueprintRef.current,
                        start: "top bottom",
                        once: true,
                    },
                }
            )

            // ── 4. Process steps — stagger on scroll
            if (processRef.current) {
                gsap.fromTo(
                    Array.from(processRef.current.children),
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.65,
                        stagger: { each: 0.12, ease: "power1.in" },
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: processRef.current,
                            start: "top bottom",
                            once: true,
                        },
                    }
                )
            }

            // ── 5. Final CTA
            gsap.fromTo(
                ctaRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top bottom",
                        once: true,
                    },
                }
            )

        }) // end context

        return () => ctx.revert()
    }, [])

    return (
        <div className="w-full bg-white text-[#111111]">

            {/* ══════════════════════════════════════════
                PAGE LOAD HEADER
            ══════════════════════════════════════════ */}
            <section className="relative overflow-hidden px-6 md:px-16 lg:px-24 pt-36 pb-16 bg-white">

                {/* Subtle dot-grid background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Orange radial glow — top right */}
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)" }}
                />

                <div className="relative max-w-7xl mx-auto">

                    {/* Eyebrow tag */}
                    <span
                        ref={pageTagRef}
                        className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#F97316] mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                        Our Services
                    </span>

                    {/* Main heading */}
                    <h1
                        ref={pageHeadRef}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.04] tracking-tight max-w-3xl mb-6"
                    >
                        Growth Systems
                        <br />
                        <span className="text-[#111111]/20">Built to</span>{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #F97316 0%, #fb923c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            Compound.
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p
                        ref={pageSubRef}
                        className="text-base md:text-lg text-[#111111]/45 max-w-xl leading-relaxed"
                    >
                        Six precision-engineered systems that work together as one unified growth engine.
                        Each layer compounds the next — strategy, content, distribution, performance.
                    </p>

                    {/* Animated divider — draws in from left on load */}
                    <div
                        ref={pageDivRef}
                        className="mt-12 h-px bg-linear-to-r from-[#F97316]/40 via-[#F97316]/10 to-transparent"
                    />
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SERVICES GRID
            ══════════════════════════════════════════ */}
            <section id="services-grid" className="px-6 md:px-16 lg:px-24 py-20">
                <div className="max-w-7xl mx-auto">

                    {/* Section header */}
                    <div className="mb-16">
                        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-4 block">
                            What We Build
                        </span>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <h2 className="text-4xl md:text-5xl font-bold text-[#111111] leading-tight max-w-xl">
                                Our Growth Systems
                            </h2>
                            <p className="text-[#111111]/45 text-base max-w-sm leading-relaxed">
                                Six precision-engineered systems, one unified growth engine. Each service compounds the next.
                            </p>
                        </div>
                    </div>

                    {/* 6-card grid */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 gap-5"
                    >
                        {services.map((service) => {
                            const Icon = service.icon
                            return (
                                <div
                                    key={service.headline}
                                    className="group relative bg-white border border-[#111111]/6 rounded-2xl p-10 flex flex-col gap-6 hover:shadow-[0_8px_40px_rgba(249,115,22,0.10)] hover:border-[#F97316]/30 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Icon + tag row */}
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-xl bg-[#F97316]/8 flex items-center justify-center group-hover:bg-[#F97316]/15 transition-colors">
                                            <Icon size={28} className="text-[#F97316]" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F97316]/70 px-2.5 py-1 border border-[#F97316]/20 rounded-full">
                                            {service.tag}
                                        </span>
                                    </div>

                                    {/* Headline */}
                                    <h3 className="text-2xl font-bold text-[#111111] leading-tight">
                                        {service.headline}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-base text-[#111111]/50 leading-relaxed flex-1">
                                        {service.description}
                                    </p>

                                    {/* Bullets */}
                                    <ul className="space-y-2.5">
                                        {service.bullets.map((b) => (
                                            <li key={b} className="flex items-center gap-2.5 text-sm text-[#111111]/55">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] shrink-0" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA link */}
                                    <Link
                                        href={service.href}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111]/40 group-hover:text-[#F97316] transition-colors duration-200 mt-2"
                                    >
                                        Learn more
                                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                AI BLUEPRINT — DARK SECTION
            ══════════════════════════════════════════ */}
            <section
                ref={blueprintRef}
                className="relative bg-[#111111] overflow-hidden px-6 md:px-16 lg:px-24 py-24 md:py-32"
            >
                {/* Subtle grid on dark */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Orange glow */}
                <div
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 60%)" }}
                />

                <div className="relative max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left copy */}
                        <div>
                            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#F97316] mb-6 block">
                                AI Service — Intelligence Layer
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.06] mb-7">
                                AI Marketing Audit
                                <br />
                                <span className="text-white/30">&amp; Growth Blueprint</span>
                            </h2>
                            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                                Before we build anything, we run a comprehensive AI-powered audit of your current marketing
                                infrastructure — identifying every gap, leak, and untapped lever in your growth system.
                            </p>
                            <p className="text-white/35 text-sm leading-relaxed mb-10 max-w-lg">
                                You receive a detailed, actionable Growth Blueprint — a fully prioritised roadmap that tells you
                                exactly where to invest, what to cut, and how to reach your next revenue milestone.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#F97316] text-white font-semibold text-sm hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_8px_40px_rgba(249,115,22,0.4)]"
                            >
                                Coming Soon
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Right — AI system flow diagram */}
                        <div className="flex flex-col gap-3">
                            {[
                                { step: "01", label: "Strategy", desc: "AI scans your market, competitors & positioning gaps", color: "#F97316" },
                                { step: "02", label: "Content", desc: "Audit of content systems, formats & publishing cadence", color: "#fb923c" },
                                { step: "03", label: "Ads", desc: "Performance analysis of paid channels & creative fatigue", color: "#fdba74" },
                                { step: "04", label: "Optimization", desc: "CRO, UX, SEO technical health & conversion bottlenecks", color: "#fed7aa" },
                                { step: "05", label: "Scale", desc: "Blueprint for 10× growth with resource allocation map", color: "#fff7ed" },
                            ].map((item, i) => (
                                <div
                                    key={item.step}
                                    className="flex items-center gap-5 bg-white/3 border border-white/8 rounded-xl px-5 py-4 hover:bg-white/6 hover:border-[#F97316]/25 transition-all duration-300"
                                >
                                    <div
                                        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                                        style={{ background: `${item.color}18`, color: item.color }}
                                    >
                                        {item.step}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                                        <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                                    </div>
                                    {i < 4 && (
                                        <ChevronRight size={14} className="text-white/15 shrink-0" />
                                    )}
                                </div>
                            ))}

                            <div className="mt-2 px-5 py-3.5 rounded-xl border border-[#F97316]/20 bg-[#F97316]/5 flex items-center gap-3">
                                <Brain size={18} className="text-[#F97316] shrink-0" />
                                <p className="text-xs text-white/55 leading-relaxed">
                                    Powered by proprietary AI analysis across 40+ growth signals
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                PROCESS SECTION
            ══════════════════════════════════════════ */}
            <section className="bg-white px-6 md:px-16 lg:px-24 py-24">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="mb-16 text-center">
                        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-4 block">
                            How We Operate
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#111111] leading-tight">
                            From Zero to Scale
                        </h2>
                        <p className="text-[#111111]/45 text-base mt-4 max-w-xl mx-auto leading-relaxed">
                            A precision-engineered 6-phase system. No fluff. No timelines that slip. Just a repeatable engine for growth.
                        </p>
                    </div>

                    {/* Steps */}
                    <div
                        ref={processRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {processSteps.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <div
                                    key={s.step}
                                    className="relative group bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-7 hover:border-[#F97316]/25 hover:shadow-[0_4px_30px_rgba(249,115,22,0.08)] transition-all duration-300"
                                >
                                    {/* Step number — watermark */}
                                    <span className="absolute top-5 right-6 text-[64px] font-black leading-none text-[#111111]/4 select-none">
                                        {s.step}
                                    </span>

                                    {/* Icon */}
                                    <div className="w-11 h-11 rounded-xl bg-[#F97316]/8 flex items-center justify-center mb-6 group-hover:bg-[#F97316]/15 transition-colors">
                                        <Icon size={20} className="text-[#F97316]" />
                                    </div>

                                    <h3 className="text-lg font-bold text-[#111111] mb-2">{s.label}</h3>
                                    <p className="text-sm text-[#111111]/50 leading-relaxed">{s.desc}</p>

                                    {i < processSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-[#111111]/10" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                FINAL CTA
            ══════════════════════════════════════════ */}
            <section className="bg-[#F8F8F8] border-t border-[#111111]/6 px-6 md:px-16 lg:px-24 py-24 md:py-32">
                <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-6 block">
                        Ready to Build?
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.04] mb-7">
                        Stop Running Campaigns.
                        <br />
                        <span className="text-[#111111]/20">Start Building</span>{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #F97316 0%, #fb923c 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Systems.
                        </span>
                    </h2>
                    <p className="text-[#111111]/45 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
                        Your competitors are still buying ads. We&apos;ll build the infrastructure that makes you
                        impossible to ignore.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-[#F97316] text-white font-semibold text-base hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_12px_40px_rgba(249,115,22,0.35)] hover:-translate-y-0.5"
                        >
                            Get Your Growth Blueprint
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl border border-[#111111]/15 text-[#111111] font-medium text-base hover:border-[#111111]/35 transition-all duration-200"
                        >
                            About 7ZeroMedia
                        </Link>
                    </div>

                    {/* Social proof strip */}
                    <div className="mt-14 pt-10 border-t border-[#111111]/8 flex flex-wrap items-center justify-center gap-8">
                        {[
                            { value: "10×", label: "Average ROI" },
                            { value: "48h", label: "Audit Turnaround" },
                            { value: "100%", label: "Data-Driven" },
                            { value: "AI-First", label: "Methodology" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl font-black text-[#111111]">{stat.value}</p>
                                <p className="text-xs text-[#111111]/40 mt-0.5 tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}