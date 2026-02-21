"use client"

/**
 * Navbar — Production-Grade Component
 *
 * Key architecture decisions:
 *  - `usePathname` drives active-link + closes menu on navigation.
 *  - Scroll depth detection uses a passive scroll listener + CSS class toggle
 *    instead of a GSAP scrub on "body", which was causing layout thrashing
 *    and animating expensive box-shadow during scroll.
 *  - GSAP context is used for all entrance animations with proper cleanup.
 *  - Link stagger only fires on ≥768px via matchMedia — avoids running on
 *    mobile where the links aren't visible.
 *  - No document.querySelector — all DOM access goes through refs.
 *  - Mobile menu closes automatically on pathname change (route navigation).
 *  - No <Link> nested inside <Button> — CTA is a styled <Link> directly.
 *  - Mobile menu uses a <dialog>-like pattern with role="dialog" + aria-modal.
 *  - All interactive elements have min 44×44px touch targets.
 */

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useEffect, useState, useCallback, useId } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { X, Menu } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// ─── Static data (module-level — never re-created on render) ────────────────
const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
] as const

// ─── Shared class builders ───────────────────────────────────────────────────
function pillLinkClass(isActive: boolean) {
    return [
        "text-base font-medium px-4 py-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1",
        isActive
            ? "text-[#F97316] bg-[#F97316]/10 shadow-[0_0_12px_rgba(249,115,22,0.35)]"
            : "text-[#111111]/70 hover:text-[#F97316] hover:bg-[#F97316]/6",
    ].join(" ")
}

function drawerLinkClass(isActive: boolean) {
    return [
        "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]",
        isActive
            ? "text-[#F97316] bg-[#F97316]/10"
            : "text-[#111111] hover:text-[#F97316] hover:bg-[#F97316]/6",
    ].join(" ")
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Navbar() {
    const pathname = usePathname()
    const menuId = useId()             // stable ID for aria-controls
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Refs — only the elements we actually animate / need to measure
    const wrapperRef = useRef<HTMLDivElement>(null)
    const navRef = useRef<HTMLElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const linkItemsRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const hamburgerRef = useRef<HTMLButtonElement>(null)

    // ── Close menu whenever route changes ───────────────────────────────────
    useEffect(() => {
        setMenuOpen(false)
    }, [pathname])

    // ── Passive scroll listener — toggles a CSS class only ─────────────────
    //    Much cheaper than a GSAP scrub; no layout thrashing; composited.
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60)

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // ── GSAP entrance animations ─────────────────────────────────────────────
    useEffect(() => {
        // Guard: skip if required refs aren't mounted
        if (!navRef.current || !logoRef.current || !ctaRef.current) return

        const ctx = gsap.context(() => {
            // Pill nav drops in from above
            gsap.from(navRef.current, {
                y: -60,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                clearProps: "opacity,transform",
            })

            // Logo slides from left
            gsap.from(logoRef.current, {
                x: -60,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out",
                clearProps: "opacity,transform",
            })

            // CTA / hamburger slides from right
            gsap.from(ctaRef.current, {
                x: 60,
                opacity: 0,
                duration: 1,
                delay: 0.35,
                ease: "power3.out",
                clearProps: "opacity,transform",
            })

            // Nav link stagger — only on desktop (avoids firing on hidden elements)
            const mq = window.matchMedia("(min-width: 768px)")
            if (mq.matches && linkItemsRef.current) {
                gsap.from(linkItemsRef.current.children, {
                    y: -24,
                    opacity: 0,
                    duration: 0.7,
                    stagger: { each: 0.08, ease: "power1.in" },
                    ease: "back.out(1.4)",
                    delay: 0.35,
                    clearProps: "opacity,transform",
                })
            }
        }, wrapperRef) // scope to our wrapper — no global side-effects

        return () => ctx.revert()
    }, []) // intentionally empty — entrance animation runs once on mount

    // ── Keyboard: close menu on Escape ──────────────────────────────────────
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false)
    }, [])

    const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])

    // ── Derived scroll class for the pill ───────────────────────────────────
    //    We only transition shadow + border — both are cheap GPU composited props.
    const pillScrollClass = scrolled
        ? "border-[rgba(249,115,22,0.18)] shadow-[0_8px_40px_rgba(17,17,17,0.13)]"
        : "border-white/40 shadow-[0_4px_32px_rgba(17,17,17,0.08)]"

    return (
        <div
            ref={wrapperRef}
            className="fixed top-4 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-1 pointer-events-none"
            onKeyDown={handleKeyDown}
        >

            {/* ── LEFT · Logo ──────────────────────────────────────── */}
            <div ref={logoRef} className="pointer-events-auto flex items-center shrink-0">
                <Link href="/" aria-label="7ZeroMedia — Go to homepage">
                    <Image
                        src="/logo.png"
                        alt="7ZeroMedia logo"
                        width={64}
                        height={64}
                        priority
                        className="rounded-full shadow-[0_2px_16px_rgba(17,17,17,0.12)]"
                    />
                </Link>
            </div>

            {/* ── CENTER · Pill nav ─────────────────────────────────── */}
            <nav
                ref={navRef}
                aria-label="Primary navigation"
                className={[
                    "pointer-events-auto hidden md:flex items-center px-9 py-3.5",
                    "rounded-full border bg-white/60 backdrop-blur-xl ring-1 ring-black/5",
                    "transition-[border-color,box-shadow] duration-300",
                    pillScrollClass,
                ].join(" ")}
            >
                <div ref={linkItemsRef} className="flex items-center gap-3" role="list">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            role="listitem"
                            aria-current={pathname === href ? "page" : undefined}
                            className={pillLinkClass(pathname === href)}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* ── RIGHT · CTA (desktop) + Hamburger (mobile) ───────── */}
            <div ref={ctaRef} className="pointer-events-auto flex items-center shrink-0">

                {/* Desktop CTA — plain <Link>, no Button wrapper */}
                <Link
                    href="/contact"
                    className="hidden md:inline-flex items-center justify-center bg-[#F97316] hover:bg-[#ea6c0a] rounded-full px-7 py-3 text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(249,115,22,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                >
                    Start Your Growth Here
                </Link>

                {/* Mobile hamburger */}
                <button
                    ref={hamburgerRef}
                    type="button"
                    className="md:hidden flex items-center justify-center w-11 h-11 text-[#111111] bg-white/70 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_2px_12px_rgba(17,17,17,0.10)] transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                    onClick={toggleMenu}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls={menuId}
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* ── Mobile drawer ─────────────────────────────────────── */}
            {/*
                Positioned via `top-[calc(100%+8px)]` relative to the wrapper
                instead of a hard-coded pixel offset — stays anchored correctly
                at any font-size / zoom level.
            */}
            <div
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                hidden={!menuOpen}
                className={[
                    "pointer-events-auto absolute top-[calc(100%+8px)] left-4 right-4",
                    "md:hidden flex flex-col gap-1 px-4 py-4",
                    "rounded-2xl border border-white/40 bg-white/85 backdrop-blur-xl",
                    "shadow-[0_8px_32px_rgba(17,17,17,0.10)]",
                    "transition-all duration-200",
                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
                ].join(" ")}
            >
                <nav aria-label="Mobile navigation links">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={pathname === href ? "page" : undefined}
                            className={drawerLinkClass(pathname === href)}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="pt-2 mt-1 border-t border-[#111111]/8">
                    <Link
                        href="/contact"
                        className="flex w-full items-center justify-center bg-[#F97316] hover:bg-[#ea6c0a] rounded-full py-3 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                    >
                        Start Your Growth Here
                    </Link>
                </div>
            </div>
        </div>
    )
}