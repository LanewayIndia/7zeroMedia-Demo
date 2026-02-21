"use client"

/**
 * Services Page — Production-Grade Component
 *
 * Key engineering decisions:
 *
 *  1. All static data (services, processSteps, auditSteps, stats) is defined
 *     at module level — zero allocation cost per render.
 *
 *  2. prefers-reduced-motion: the entire GSAP block is skipped when the user
 *     has opted out of motion. CSS handles initial opacity via .gsap-reveal.
 *
 *  3. ScrollTrigger pin on the process section is REMOVED and replaced with
 *     pure CSS `sticky` (already in the JSX via `lg:sticky lg:top-24`).
 *     The GSAP pin was fragile: it conflicted with CSS sticky on Safari,
 *     caused pinSpacing jitter, and broke on dynamic height changes.
 *
 *  4. `once: true` on every ScrollTrigger — prevents re-firing on scroll-up
 *     and stops duplicate instance creation during HMR.
 *
 *  5. `invalidateOnRefresh: true` on scroll-animated sections that have
 *     dynamic height (grid, process) so positions recalculate on resize.
 *
 *  6. GSAP context scoped to `rootRef` — no global side-effects.
 *
 *  7. Decorative backgrounds use aria-hidden="true" + pointer-events-none.
 *
 *  8. All gradient text spans have a `color` fallback for older browsers.
 *
 *  9. Glow divs use `min()` for dimensions — never cause horizontal overflow.
 */

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

/* ─── Module-level static data ──────────────────────────────────────────────
   Never re-created on render. Types are inferred from `as const`.
─────────────────────────────────────────────────────────────────────────── */

const SERVICES = [
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
] as const

const PROCESS_STEPS = [
    { icon: Brain, step: "01", label: "Discovery", desc: "Deep audit of your brand, market, and growth gaps." },
    { icon: Target, step: "02", label: "Strategy", desc: "Custom growth blueprint mapped to your revenue goals." },
    { icon: Zap, step: "03", label: "Activation", desc: "Rapid deployment of content, ads, and SEO systems." },
    { icon: BarChart2, step: "04", label: "Optimization", desc: "Continuous testing, reporting, and performance tuning." },
    { icon: RefreshCw, step: "05", label: "Compounding", desc: "Scale what works. Kill what doesn't. Iterate fast." },
    { icon: Rocket, step: "06", label: "Scale", desc: "Full-system scaling across channels, geographies, and products." },
] as const

const AUDIT_STEPS = [
    { step: "01", label: "Strategy", desc: "AI scans your market, competitors & positioning gaps", color: "#F97316" },
    { step: "02", label: "Content", desc: "Audit of content systems, formats & publishing cadence", color: "#fb923c" },
    { step: "03", label: "Ads", desc: "Performance analysis of paid channels & creative fatigue", color: "#fdba74" },
    { step: "04", label: "Optimization", desc: "CRO, UX, SEO technical health & conversion bottlenecks", color: "#fed7aa" },
    { step: "05", label: "Scale", desc: "Blueprint for 10× growth with resource allocation map", color: "#fff7ed" },
] as const

const STATS = [
    { value: "10×", label: "Average ROI" },
    { value: "48h", label: "Audit Turnaround" },
    { value: "100%", label: "Data-Driven" },
    { value: "AI-First", label: "Methodology" },
] as const

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Services() {

    // Root ref — all GSAP context scoped here, no global side-effects
    const rootRef = useRef<HTMLDivElement>(null)

    // Hero header refs
    const pageTagRef = useRef<HTMLSpanElement>(null)
    const pageHeadRef = useRef<HTMLHeadingElement>(null)
    const pageSubRef = useRef<HTMLParagraphElement>(null)
    const pageDivRef = useRef<HTMLDivElement>(null)

    // Scroll-section refs
    const stackWrapRef = useRef<HTMLDivElement>(null)   // wraps the grid — perspective origin for depth
    const row0Ref = useRef<HTMLDivElement>(null)   // first  row of cards (cards 0-2)
    const row1Ref = useRef<HTMLDivElement>(null)   // second row of cards (cards 3-5)
    const blueprintRef = useRef<HTMLElement>(null)
    const processRef = useRef<HTMLDivElement>(null)
    const processWrapperRef = useRef<HTMLElement>(null)  // process section wrapper
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // ── Respect prefers-reduced-motion ──────────────────────────────────
        // Skip all animations. Content is fully visible without JS animation.
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReduced) return

        // ── Null-safety: require root to be mounted ─────────────────────────
        if (!rootRef.current) return

        const ctx = gsap.context(() => {

            // ── 1. Page-load hero entrance ──────────────────────────────────
            // Null-safe: only animate refs that are present
            const headerElements = [
                pageTagRef.current,
                pageHeadRef.current,
                pageSubRef.current,
            ].filter(Boolean)

            if (headerElements.length) {
                gsap.timeline({ defaults: { ease: "power3.out" } })
                    .fromTo(pageTagRef.current,
                        { y: -16, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, clearProps: "transform,opacity,willChange" }
                    )
                    .fromTo(pageHeadRef.current,
                        { y: 44, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.9, clearProps: "transform,opacity,willChange" },
                        "-=0.35"
                    )
                    .fromTo(pageSubRef.current,
                        { y: 24, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.7, clearProps: "transform,opacity,willChange" },
                        "-=0.55"
                    )
                    .fromTo(pageDivRef.current,
                        { scaleX: 0, opacity: 0, transformOrigin: "left center" },
                        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut", clearProps: "transform,opacity,transformOrigin,willChange" },
                        "-=0.35"
                    )
            }

            // ── 2. Service cards — cinematic scroll stack (desktop) / fade-slide (mobile)
            //
            //   ARCHITECTURE DECISION:
            //   The grid is 3 columns on desktop → the cards form 2 natural rows.
            //   A true "per-card" pin-stack would require collapsing to 1 column and
            //   pinning each card, which violates the "no layout changes" constraint.
            //   Instead we treat each ROW as a single depth layer:
            //     • Row 1 starts at scale:1, translateY:0
            //     • As Row 2 scrolls into view, Row 1 compresses (scale→0.92,
            //       translateY→-80px, opacity→0.55) — giving the illusion it's
            //       receding into depth behind Row 2.
            //   This uses ScrollTrigger.matchMedia() to isolate desktop vs mobile
            //   behaviour and scrub:true for fluid 60fps tracking.

            const mm = ScrollTrigger.matchMedia({

                // ── DESKTOP (≥1024px) — depth stack ─────────────────────────────────
                "(min-width: 1024px)": () => {
                    if (!stackWrapRef.current || !row0Ref.current || !row1Ref.current) return

                    // Add perspective to the wrapper so scale transforms look 3D
                    stackWrapRef.current.style.perspective = "1200px"
                    stackWrapRef.current.style.perspectiveOrigin = "center top"

                    // Z-index layering — row 1 starts below (lower z), row 2 above
                    row0Ref.current.style.zIndex = "1"
                    row1Ref.current.style.zIndex = "2"

                    // Both rows enter from below on initial page reveal (once)
                    gsap.fromTo(
                        [row0Ref.current, row1Ref.current],
                        { y: 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.85,
                            stagger: 0.18,
                            ease: "power3.out",
                            // NOTE: clearProps deferred — scrub overwrites transform anyway
                            scrollTrigger: {
                                trigger: row0Ref.current,
                                start: "top 85%",
                                once: true,
                                invalidateOnRefresh: true,
                            },
                        }
                    )

                    // As row1 scrolls into the viewport, compress row0 backward
                    // scrub:1 = 1s of lag for perfect fluidity, no jitter
                    gsap.fromTo(
                        row0Ref.current,
                        { scale: 1, y: 0, opacity: 1 },
                        {
                            scale: 0.92,
                            y: -80,
                            opacity: 0.5,
                            ease: "none",   // linear so scrub tracks 1-to-1
                            scrollTrigger: {
                                trigger: row1Ref.current,
                                start: "top 75%",
                                end: "top 20%",
                                scrub: 1.2,
                                invalidateOnRefresh: true,
                            },
                        }
                    )

                    // Row1 rises FROM slightly below into final position (depth reveal)
                    gsap.fromTo(
                        row1Ref.current,
                        { y: 40, scale: 0.98 },
                        {
                            y: 0,
                            scale: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: row1Ref.current,
                                start: "top 80%",
                                end: "top 30%",
                                scrub: 1.2,
                                invalidateOnRefresh: true,
                            },
                        }
                    )

                    // Cleanup: revert inline styles added above
                    return () => {
                        if (stackWrapRef.current) {
                            stackWrapRef.current.style.perspective = ""
                            stackWrapRef.current.style.perspectiveOrigin = ""
                        }
                        if (row0Ref.current) {
                            row0Ref.current.style.zIndex = ""
                            gsap.set(row0Ref.current, { clearProps: "transform,opacity,willChange,zIndex" })
                        }
                        if (row1Ref.current) {
                            row1Ref.current.style.zIndex = ""
                            gsap.set(row1Ref.current, { clearProps: "transform,opacity,willChange,zIndex" })
                        }
                    }
                },

                // ── MOBILE / TABLET (<1024px) — simple fade/slide ────────────────────
                "(max-width: 1023px)": () => {
                    if (!stackWrapRef.current) return
                    gsap.fromTo(
                        Array.from(stackWrapRef.current.querySelectorAll("article")),
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.7,
                            stagger: { each: 0.09, ease: "power1.in" },
                            ease: "power3.out",
                            clearProps: "transform,opacity,willChange",
                            scrollTrigger: {
                                trigger: stackWrapRef.current,
                                start: "top 85%",
                                once: true,
                                invalidateOnRefresh: true,
                            },
                        }
                    )
                },
            })

            // mm.revert() is called by ctx.revert() automatically

            // ── 3. Blueprint section ─────────────────────────────────────────
            if (blueprintRef.current) {
                gsap.fromTo(
                    blueprintRef.current,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        clearProps: "transform,opacity,willChange",
                        scrollTrigger: {
                            trigger: blueprintRef.current,
                            start: "top 85%",
                            once: true,
                            invalidateOnRefresh: true,
                        },
                    }
                )
            }

            // ── 4. Process steps — scroll-triggered stagger ─────────────────
            //    NOTE: The fragile ScrollTrigger.pin() has been REMOVED.
            //    The left panel uses pure CSS `lg:sticky lg:top-24` which is
            //    browser-native, Safari-safe, and never causes pinSpacing jitter.
            if (processRef.current) {
                const steps = Array.from(processRef.current.children)
                if (steps.length) {
                    gsap.fromTo(
                        steps,
                        { y: 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            stagger: 0.13,
                            duration: 0.75,
                            ease: "power3.out",
                            clearProps: "transform,opacity,willChange",
                            scrollTrigger: {
                                trigger: processRef.current,
                                start: "top 80%",
                                once: true,
                                invalidateOnRefresh: true,
                            },
                        }
                    )
                }
            }

            // ── 5. Final CTA ─────────────────────────────────────────────────
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        clearProps: "transform,opacity,willChange",
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: "top 85%",
                            once: true,
                            invalidateOnRefresh: true,
                        },
                    }
                )
            }

        }, rootRef) // ← scoped: no global querySelector, no document-level effects

        return () => ctx.revert() // full cleanup: kills all tweens + ScrollTriggers
    }, [])

    return (
        <div ref={rootRef} className="w-full bg-white text-[#111111]">

            {/* ══════════════════════════════════════════
                PAGE LOAD HEADER
            ══════════════════════════════════════════ */}
            <section
                aria-label="Services hero"
                className="relative overflow-hidden px-6 md:px-16 lg:px-24 pt-28 md:pt-36 pb-12 md:pb-16 bg-white"
            >
                {/* Decorative backgrounds — aria-hidden, never focusable */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                    {/* Glow capped with min() — never causes horizontal overflow */}
                    <div
                        className="absolute top-0 right-0 rounded-full"
                        style={{
                            width: "min(500px, 80vw)",
                            height: "min(500px, 80vw)",
                            background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)",
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Eyebrow */}
                    <span
                        ref={pageTagRef}
                        className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#F97316] mb-6"
                    >
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                        Our Services | What We Build
                    </span>

                    {/* H1 — only one per page */}
                    <h1
                        ref={pageHeadRef}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.04] tracking-tight max-w-3xl mb-6"
                    >
                        Growth Systems
                        <br />
                        <span aria-hidden="true" className="text-[#111111]/20">Built to</span>{" "}
                        <span
                            className="text-gradient"
                            style={{ color: "#F97316" }}    /* fallback for unsupported browsers */
                            aria-label="Compound."
                        >
                            Compound.
                        </span>
                    </h1>

                    <p
                        ref={pageSubRef}
                        className="text-base md:text-lg text-[#111111]/50 max-w-xl leading-relaxed"
                    >
                        Six precision-engineered systems that work together as one unified growth engine.
                        Each layer compounds the next — strategy, content, distribution, performance.
                    </p>

                    {/* Animated divider */}
                    <div
                        ref={pageDivRef}
                        aria-hidden="true"
                        className="mt-12 h-px bg-linear-to-r from-[#F97316]/40 via-[#F97316]/10 to-transparent"
                    />
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SERVICES GRID
            ══════════════════════════════════════════ */}
            <section
                id="services-grid"
                aria-label="Our growth systems"
                className="px-6 md:px-4 lg:px-8 py-5"
            >
                <div className="max-w-7xl mx-auto">

                    {/* ── 6-card grid
                        stackWrapRef: receives perspective for 3D depth illusion.
                        row0Ref / row1Ref: the two logical rows — GSAP treats each
                        as a single depth layer on desktop (≥1024px).
                        On mobile the grid reverts to the normal stacked layout;
                        no ref-based row grouping is active.
                    */}
                    <div
                        ref={stackWrapRef}
                        className="relative"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Row 0 — cards 0, 1, 2 */}
                        <div
                            ref={row0Ref}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5"
                        >
                            {SERVICES.slice(0, 3).map((service) => {
                                const Icon = service.icon
                                return (
                                    <article
                                        key={service.headline}
                                        className="group relative bg-white border border-[#111111]/6 rounded-2xl p-10 flex flex-col gap-6 hover:shadow-[0_8px_40px_rgba(249,115,22,0.10)] hover:border-[#F97316]/30 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-14 h-14 rounded-xl bg-[#F97316]/8 flex items-center justify-center group-hover:bg-[#F97316]/15 transition-colors">
                                                <Icon size={28} className="text-[#F97316]" aria-hidden="true" />
                                            </div>
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F97316]/70 px-2.5 py-1 border border-[#F97316]/20 rounded-full">
                                                {service.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#111111] leading-tight">{service.headline}</h3>
                                        <p className="text-base text-[#111111]/50 leading-relaxed flex-1">{service.description}</p>
                                        <ul className="space-y-2.5" aria-label={`${service.headline} capabilities`}>
                                            {service.bullets.map((b) => (
                                                <li key={b} className="flex items-center gap-2.5 text-sm text-[#111111]/55">
                                                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#F97316] shrink-0" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={service.href}
                                            aria-label={`Learn more about ${service.headline}`}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111]/40 group-hover:text-[#F97316] transition-colors duration-200 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 rounded"
                                        >
                                            Learn more
                                            <ArrowUpRight size={13} aria-hidden="true" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                        </Link>
                                    </article>
                                )
                            })}
                        </div>

                        {/* Row 1 — cards 3, 4, 5 */}
                        <div
                            ref={row1Ref}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {SERVICES.slice(3).map((service) => {
                                const Icon = service.icon
                                return (
                                    <article
                                        key={service.headline}
                                        className="group relative bg-white border border-[#111111]/6 rounded-2xl p-10 flex flex-col gap-6 hover:shadow-[0_8px_40px_rgba(249,115,22,0.10)] hover:border-[#F97316]/30 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-14 h-14 rounded-xl bg-[#F97316]/8 flex items-center justify-center group-hover:bg-[#F97316]/15 transition-colors">
                                                <Icon size={28} className="text-[#F97316]" aria-hidden="true" />
                                            </div>
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F97316]/70 px-2.5 py-1 border border-[#F97316]/20 rounded-full">
                                                {service.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#111111] leading-tight">{service.headline}</h3>
                                        <p className="text-base text-[#111111]/50 leading-relaxed flex-1">{service.description}</p>
                                        <ul className="space-y-2.5" aria-label={`${service.headline} capabilities`}>
                                            {service.bullets.map((b) => (
                                                <li key={b} className="flex items-center gap-2.5 text-sm text-[#111111]/55">
                                                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#F97316] shrink-0" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={service.href}
                                            aria-label={`Learn more about ${service.headline}`}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111]/40 group-hover:text-[#F97316] transition-colors duration-200 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 rounded"
                                        >
                                            Learn more
                                            <ArrowUpRight size={13} aria-hidden="true" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                        </Link>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                AI BLUEPRINT — DARK SECTION
            ══════════════════════════════════════════ */}
            <section
                ref={blueprintRef}
                aria-label="AI Marketing Audit & Growth Blueprint"
                className="relative bg-[#111111] overflow-hidden px-6 md:px-16 lg:px-24 py-24 md:py-32"
            >
                {/* Decorative backgrounds */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                    <div
                        className="absolute top-0 right-0 rounded-full"
                        style={{
                            width: "min(600px, 80vw)",
                            height: "min(600px, 80vw)",
                            background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 60%)",
                        }}
                    />
                </div>

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
                                aria-label="Get early access to AI Marketing Audit"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#F97316] text-white font-semibold text-sm hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_8px_40px_rgba(249,115,22,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
                            >
                                Coming Soon
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>

                        {/* Right — AI flow diagram */}
                        <div className="flex flex-col gap-3">
                            {AUDIT_STEPS.map((item, i) => (
                                <div
                                    key={item.step}
                                    className="flex items-center gap-5 bg-white/3 border border-white/8 rounded-xl px-5 py-4 hover:bg-white/6 hover:border-[#F97316]/25 transition-all duration-300"
                                >
                                    <div
                                        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                                        style={{ background: `${item.color}18`, color: item.color }}
                                        aria-hidden="true"
                                    >
                                        {item.step}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                                        <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                                    </div>
                                    {/* Connector arrow — decorative */}
                                    {i < AUDIT_STEPS.length - 1 && (
                                        <ChevronRight size={14} aria-hidden="true" className="text-white/15 shrink-0" />
                                    )}
                                </div>
                            ))}

                            <div className="mt-2 px-5 py-3.5 rounded-xl border border-[#F97316]/20 bg-[#F97316]/5 flex items-center gap-3">
                                <Brain size={18} aria-hidden="true" className="text-[#F97316] shrink-0" />
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
                CSS sticky replaces the fragile GSAP pin —
                native, Safari-safe, zero pinSpacing jitter.
            ══════════════════════════════════════════ */}
            <section
                ref={processWrapperRef}
                aria-label="Our 6-phase growth process"
                className="bg-white px-6 md:px-16 lg:px-24 py-16 md:py-24 lg:py-32"
            >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

                    {/* LEFT — sticky label panel (CSS sticky, not GSAP pin) */}
                    <div className="h-fit lg:sticky lg:top-24">
                        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-4 block">
                            How We Operate
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#111111] leading-tight">
                            From Zero to Scale
                        </h2>
                        <p className="text-[#111111]/45 text-base mt-6 max-w-md leading-relaxed">
                            A precision-engineered 6-phase system. No timelines that slip. Just a repeatable engine for growth.
                        </p>
                    </div>

                    {/* RIGHT — stacked steps (scroll-triggered stagger) */}
                    <div ref={processRef} className="flex flex-col gap-10">
                        {PROCESS_STEPS.map((s) => {
                            const Icon = s.icon
                            return (
                                <article
                                    key={s.step}
                                    className="relative bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-8 hover:border-[#F97316]/25 hover:shadow-[0_6px_40px_rgba(249,115,22,0.08)] transition-all duration-300"
                                >
                                    {/* Step watermark — decorative */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-6 right-8 text-[72px] font-black leading-none text-[#111111]/5 select-none pointer-events-none"
                                    >
                                        {s.step}
                                    </span>

                                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center mb-6">
                                        <Icon size={22} aria-hidden="true" className="text-[#F97316]" />
                                    </div>

                                    <h3 className="text-xl font-bold text-[#111111] mb-3">
                                        {s.label}
                                    </h3>

                                    <p className="text-sm text-[#111111]/55 leading-relaxed max-w-md">
                                        {s.desc}
                                    </p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                FINAL CTA
            ══════════════════════════════════════════ */}
            <section
                aria-label="Call to action"
                className="bg-[#F8F8F8] border-t border-[#111111]/6 px-6 md:px-16 lg:px-24 py-16 md:py-24 lg:py-32"
            >
                <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-6 block">
                        Ready to Build?
                    </span>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.04] mb-7">
                        Stop Running Campaigns.
                        <br />
                        <span aria-hidden="true" className="text-[#111111]/20">Start Building</span>{" "}
                        <span
                            className="text-gradient"
                            style={{ color: "#F97316" }}   /* fallback */
                            aria-label="Systems."
                        >
                            Systems.
                        </span>
                    </h2>

                    <p className="text-[#111111]/45 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
                        Your competitors are still buying ads. We&apos;ll build the infrastructure that makes you
                        impossible to ignore.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            aria-label="Get your growth blueprint"
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-[#F97316] text-white font-semibold text-base hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_12px_40px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                        >
                            Get Your Growth Blueprint
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl border border-[#111111]/15 text-[#111111] font-medium text-base hover:border-[#111111]/35 transition-all duration-200 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/40 focus-visible:ring-offset-2"
                        >
                            About 7ZeroMedia
                        </Link>
                    </div>

                    {/* Stats strip */}
                    <dl className="mt-14 pt-10 border-t border-[#111111]/8 flex flex-wrap items-center justify-center gap-8">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <dt className="text-xs text-[#111111]/40 mt-0.5 tracking-wide order-2">{stat.label}</dt>
                                <dd className="text-2xl font-black text-[#111111] order-1">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        </div>
    )
}
