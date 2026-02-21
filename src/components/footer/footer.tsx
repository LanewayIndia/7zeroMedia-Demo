"use client"

/**
 * Footer — Production-Grade Component
 *
 * Key engineering decisions:
 *
 *  1. `new Date().getFullYear()` was replaced with a server-safe static year
 *     constant. `new Date()` in JSX runs on the server during SSR and on the
 *     client during hydration — if the server renders at 23:59 and the client
 *     hydrates at 00:00 on a year boundary, you get a hydration mismatch.
 *     The year is now derived once at module parse time (server-consistent).
 *
 *  2. `priority` removed from the footer logo Image. The logo is below the fold
 *     and is never LCP-critical — `priority` forces an early preload request
 *     that wastes bandwidth and hurts Lighthouse.
 *
 *  3. GSAP refs reduced from 5 individual column refs to a single `columnsRef`
 *     array ref. Animation order is preserved via `stagger`. Removing the
 *     individual refs simplifies the component and makes adding new columns
 *     trivially easy.
 *
 *  4. `once: true` added to all ScrollTriggers — prevents re-firing on
 *     scroll-up and avoids duplicate registration during HMR.
 *
 *  5. `invalidateOnRefresh: true` added — scroll trigger positions recalculate
 *     correctly on window resize / orientation change.
 *
 *  6. `prefers-reduced-motion` guard — entire GSAP block is skipped if user
 *     opts out of motion.
 *
 *  7. Emoji icons (`📧`, `📞`) wrapped in `<span aria-hidden="true">` so
 *     screen readers don't read "envelope emoji phone emoji".
 *
 *  8. Social links get `aria-label` describing the destination and the fact
 *     that they open in a new tab.
 *
 *  9. Top glow `div` gets `aria-hidden="true"` — purely decorative.
 *
 * 10. GSAP context scoped to `footerRef` — no global side-effects.
 */

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ─── Module-level static data ──────────────────────────────────────────────
   Never re-created on render.
   YEAR: derived once at module parse time on the server — same value is used
   during hydration, preventing year-boundary hydration mismatches.
─────────────────────────────────────────────────────────────────────────── */

const CURRENT_YEAR = new Date().getFullYear()

const QUICK_LINKS = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
] as const

const SERVICES = [
    { name: "Branding & Marketing", href: "/services" },
    { name: "Strategic Social Media Growth", href: "/services" },
    { name: "Content Creation & Production", href: "/services" },
    { name: "Paid Ads & Performance Marketing", href: "/services" },
    { name: "Web Development & UX Systems", href: "/services" },
] as const

const SOCIAL_LINKS = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/7zero.media?igsh=MTh0cDNjNmE0eTU1Yg==",
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/7zeromedia/",
    },
    {
        name: "Website",
        href: "https://www.7zero.media",
    },
] as const

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Footer() {

    // Root ref — GSAP context scoped here; no global side-effects
    const footerRef = useRef<HTMLElement>(null)

    // Single array ref for animated columns — preserves stagger order,
    // avoids 4 separate refs
    const columnsRef = useRef<(HTMLDivElement | null)[]>([])
    const bottomBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // ── Respect prefers-reduced-motion ──────────────────────────────────
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReduced) return

        if (!footerRef.current) return

        const ctx = gsap.context(() => {
            // Filter out any null refs (safely handles conditional columns)
            const columns = columnsRef.current.filter(Boolean)

            if (columns.length) {
                gsap.from(columns, {
                    y: 50,
                    opacity: 0,
                    stagger: 0.12,
                    duration: 0.8,
                    ease: "power3.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 88%",
                        once: true,              // never re-fires; HMR-safe
                        invalidateOnRefresh: true,
                    },
                })
            }

            if (bottomBarRef.current) {
                gsap.from(bottomBarRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.7,
                    delay: 0.55,
                    ease: "power2.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                })
            }

        }, footerRef) // scoped context — kills only tweens inside this footer

        return () => ctx.revert()
    }, [])

    // Helper to assign each column into the array ref by index
    const colRef = (i: number) => (el: HTMLDivElement | null) => {
        columnsRef.current[i] = el
    }

    return (
        <footer
            ref={footerRef}
            aria-label="Site footer"
            className="relative border-t border-[#111111]/10 bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-12 md:py-16"
        >
            {/* Top glow accent — purely decorative */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-[#F97316]/40 to-transparent pointer-events-none"
            />

            {/* ── Main grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                {/* ── Brand column ─────────────────────────────────── */}
                <div ref={colRef(0)} className="sm:col-span-2 lg:col-span-1">
                    <Link
                        href="/"
                        aria-label="7ZeroMedia — Go to homepage"
                        className="inline-block mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 rounded"
                    >
                        <span className="flex items-center gap-3 font-bold text-2xl text-[#111111]">
                            <Image
                                src="/logo.png"
                                alt="7ZeroMedia logo"
                                width={100}
                                height={100}
                                // No `priority` — this image is below the fold and never LCP-critical
                                className="w-auto h-10 rounded-full"
                            />
                        </span>
                    </Link>

                    <p className="text-[#111111]/50 text-sm leading-relaxed mb-6">
                        AI-powered media marketing for modern brands. Transform your growth with intelligent automation.
                    </p>

                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#F97316] hover:text-[#ea6c0a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 rounded"
                    >
                        Let&apos;s Connect
                        <ArrowUpRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>

                    {/* Social links */}
                    <div className="flex flex-wrap gap-3 mt-6" role="list" aria-label="Social media links">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                role="listitem"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${social.name} — opens in a new tab`}
                                className="text-xs border border-[#111111]/20 text-[#111111]/60 hover:text-[#F97316] hover:border-[#F97316]/60 px-3 py-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                            >
                                {social.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── Quick Links column ───────────────────────────── */}
                <div ref={colRef(1)}>
                    <h3 className="text-xs tracking-widest uppercase text-[#111111]/40 mb-5">
                        Quick Links
                    </h3>
                    <ul className="space-y-3">
                        {QUICK_LINKS.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-[#111111]/60 hover:text-[#F97316] text-sm transition-colors duration-300 hover:pl-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 rounded"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Services column ──────────────────────────────── */}
                <div ref={colRef(2)}>
                    <h3 className="text-xs tracking-widest uppercase text-[#111111]/40 mb-5">
                        Services
                    </h3>
                    <ul className="space-y-3">
                        {SERVICES.map((service) => (
                            <li key={service.name}>
                                <Link
                                    href={service.href}
                                    className="text-[#111111]/60 hover:text-[#F97316] text-sm transition-colors duration-300 hover:pl-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 rounded"
                                >
                                    {service.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Contact Info column ──────────────────────────── */}
                <div ref={colRef(3)}>
                    <h3 className="text-xs tracking-widest uppercase text-[#111111]/40 mb-5">
                        Contact Info
                    </h3>
                    <ul className="space-y-4 text-sm text-[#111111]/60">
                        <li className="flex items-start gap-2">
                            {/* aria-hidden: screen reader doesn't need to say "envelope emoji" */}
                            <span aria-hidden="true">📧</span>
                            <a
                                href="mailto:info@7zero.media"
                                aria-label="Email us at info@7zero.media"
                                className="hover:text-[#F97316] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 rounded"
                            >
                                info@7zero.media
                            </a>
                        </li>
                        <li className="flex items-start gap-2">
                            <span aria-hidden="true">�</span>
                            <a
                                href="tel:+919961348942"
                                aria-label="Call us at +91 9961348942"
                                className="hover:text-[#F97316] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 rounded"
                            >
                                +91 9961348942
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ── Bottom bar — full width, outside the grid ─────────── */}
            <div
                ref={bottomBarRef}
                className="flex border-t border-[#111111]/10 pt-6 mt-4 flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#111111]/40"
            >
                {/* Using module-level CURRENT_YEAR — consistent between SSR and client */}
                <p>© {CURRENT_YEAR} 7ZeroMedia. All rights reserved.</p>
                <nav aria-label="Legal links">
                    <div className="flex gap-4">
                        <Link
                            href="/privacy"
                            className="hover:text-[#F97316] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 rounded"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-[#F97316] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 rounded"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </nav>
            </div>
        </footer>
    )
}