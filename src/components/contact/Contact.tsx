"use client"

/**
 * Contact Page — Production-Grade Component
 *
 * Key engineering decisions:
 *
 *  1. CLASS-BASED GSAP SELECTOR REMOVED — `gsap.to(".submit-btn", …)` was a
 *     global DOM query that could animate ANY element with that class anywhere
 *     on the page. Replaced with `submitBtnRef` — scoped, predictable, safe.
 *
 *  2. HONEYPOT FIELD — a visually hidden `website` input is included in the
 *     form. Legitimate users never see or fill it (hidden with CSS, not
 *     `display:none`). Bots fill it, and the API route silently discards the
 *     submission.
 *
 *  3. FULL FORM STATE MACHINE — replaced a single `submitted` boolean with a
 *     proper `status` enum: "idle" | "submitting" | "success" | "error".
 *     This cleanly drives loading, disabled, success, and error UI states.
 *
 *  4. CLIENT-SIDE VALIDATION — validates required fields client-side before
 *     hitting the API. Per-field inline error messages are announced via
 *     `aria-describedby` for screen readers.
 *
 *  5. DOUBLE-SUBMIT PREVENTION — submit button is `disabled` while
 *     `status === "submitting"`, and an `isSubmitting` guard prevents race
 *     conditions.
 *
 *  6. FORM RESET ON SUCCESS — all form values and validation errors are
 *     cleared when the user clicks "Send another message".
 *
 *  7. GSAP PARALLAX SCRUB OPTIMIZED — the glow orb parallax uses
 *     `will-change: transform` and animates only `y` (GPU-composited), not
 *     `filter`/`opacity`. For `prefers-reduced-motion` users the entire GSAP
 *     block is skipped.
 *
 *  8. ALL LABELS LINKED TO INPUTS — every `<label>` has a matching `htmlFor`
 *     and each input has a corresponding `id`, satisfying WCAG 1.3.1.
 *
 *  9. DECORATIVE ELEMENTS aria-hidden — glow orbs, noise overlay, shimmer
 *     span, animated pulse dot are all `aria-hidden="true"`.
 *
 * 10. SUCCESS STATE FOCUS — on success, focus is moved to the confirmation
 *     heading so screen readers announce the state change.
 */

import { useRef, useEffect, useState, useCallback, useId } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/* ─── Module-level static data ──────────────────────────────────────────────
   Never re-created on render.
─────────────────────────────────────────────────────────────────────────── */

const CONTACT_DETAILS = [
    {
        icon: MapPin,
        label: "Head Office",
        value: "1087 B, Sankranthi, Perumbaikkad\nKottayam - 686016, Kerala",
        href: undefined as string | undefined,
    },
    {
        icon: MapPin,
        label: "Operational Office",
        value: "Koramangala 8th Block\nBangalore - 560095, Karnataka",
        href: undefined as string | undefined,
    },
    {
        icon: Mail,
        label: "Email Us",
        value: "info@7zero.media",
        href: "mailto:info@7zero.media",
    },
    {
        icon: Phone,
        label: "Call Us",
        value: "+91 9961348942",
        href: "tel:+919961348942",
    },
] as const

const SERVICES = [
    "Marketing Strategy",
    "Brand Identity",
    "Content Creation",
    "Filming & Production",
    "Social Media",
    "Other",
] as const

const SOCIAL_LINKS = [
    { name: "Instagram", href: "https://www.instagram.com/7zero.media" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/7zeromedia/" },
    { name: "Website", href: "https://www.7zero.media" },
] as const

/* ─── Types ──────────────────────────────────────────────────────────────── */

type FormStatus = "idle" | "submitting" | "success" | "error"

interface FormData {
    name: string
    email: string
    company: string
    service: string
    message: string
}

interface FormErrors {
    name?: string
    email?: string
    message?: string
    api?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const EMPTY_FORM: FormData = {
    name: "", email: "", company: "", service: "", message: "",
}

/* ─── Input base class ───────────────────────────────────────────────────── */

const inputBase =
    "w-full bg-[#111111]/5 border border-[#111111]/10 rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder-[#111111]/30 outline-none transition-all duration-300 focus:border-[#F97316]/60 focus:bg-[#111111]/[0.08] focus:shadow-[0_0_20px_rgba(249,115,22,0.08)]"

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Contact() {

    // ── Stable field IDs for label/input pairing ────────────────────────────
    const uid = useId()
    const fieldId = (f: string) => `${uid}-${f}`

    // ── Refs ─────────────────────────────────────────────────────────────────
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const taglineRef = useRef<HTMLParagraphElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)
    const detailCardsRef = useRef<HTMLDivElement>(null)
    const glowOrbRef = useRef<HTMLDivElement>(null)
    const submitBtnRef = useRef<HTMLButtonElement>(null)  // replaces ".submit-btn" selector
    const successHeadRef = useRef<HTMLHeadingElement>(null) // focus target after success

    // ── Form state ──────────────────────────────────────────────────────────
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
    const [errors, setErrors] = useState<FormErrors>({})
    const [status, setStatus] = useState<FormStatus>("idle")

    // Update a single field
    const setField = useCallback(
        <K extends keyof FormData>(key: K, value: FormData[K]) => {
            setFormData(prev => ({ ...prev, [key]: value }))
            // Clear per-field error on change
            if (errors[key as keyof FormErrors]) {
                setErrors(prev => ({ ...prev, [key]: undefined }))
            }
        },
        [errors]
    )

    // ── Client-side validation ───────────────────────────────────────────────
    function validate(data: FormData): FormErrors {
        const e: FormErrors = {}
        if (!data.name.trim() || data.name.trim().length < 2)
            e.name = "Please enter your name."
        if (!data.email.trim() || !EMAIL_RE.test(data.email.trim()))
            e.email = "Please enter a valid email address."
        if (!data.message.trim() || data.message.trim().length < 10)
            e.message = "Please tell us more (at least 10 characters)."
        return e
    }

    // ── Form submit ──────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        // Prevent double-submission
        if (status === "submitting") return

        // Client-side validation
        const validationErrors = validate(formData)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            // Move focus to the first errored field
            const firstErrorKey = Object.keys(validationErrors)[0]
            const el = document.getElementById(fieldId(firstErrorKey))
            el?.focus()
            return
        }

        setStatus("submitting")
        setErrors({})

        // Micro-animation on submit button (ref-based, not class-based)
        if (submitBtnRef.current) {
            gsap.to(submitBtnRef.current, {
                scale: 0.96,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
            })
        }

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    company: formData.company.trim(),
                    service: formData.service,
                    message: formData.message.trim(),
                    // Honeypot — legitimate users won't have a value here
                    website: (e.target as HTMLFormElement).website?.value ?? "",
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                // Surface server-side field errors if available
                if (data.errors) {
                    setErrors(data.errors)
                    setStatus("idle")
                } else {
                    throw new Error("Server error")
                }
                return
            }

            setStatus("success")
        } catch {
            setStatus("error")
            setErrors({ api: "Something went wrong. Please try again or email us directly." })
        }
    }, [status, formData, fieldId])

    // ── Focus success heading for screen readers ─────────────────────────────
    useEffect(() => {
        if (status === "success" && successHeadRef.current) {
            successHeadRef.current.focus()
        }
    }, [status])

    // ── GSAP animations ──────────────────────────────────────────────────────
    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReduced) return
        if (!sectionRef.current) return

        const ctx = gsap.context(() => {

            // Glow orb parallax — only `y` (GPU-composited), no blur animation
            if (glowOrbRef.current) {
                gsap.to(glowOrbRef.current, {
                    y: -80,
                    ease: "none",
                    clearProps: "transform",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,          // smoothed scrub — less jitter, less GPU strain
                        invalidateOnRefresh: true,
                    },
                })
            }

            // Heading
            if (headingRef.current) {
                gsap.from(headingRef.current, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: "power4.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 85%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                })
            }

            // Tagline
            if (taglineRef.current) {
                gsap.from(taglineRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.9,
                    delay: 0.2,
                    ease: "power3.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: taglineRef.current,
                        start: "top 90%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                })
            }

            // Info panel — slides in from left
            if (infoRef.current) {
                gsap.from(infoRef.current, {
                    x: -60,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: infoRef.current,
                        start: "top 80%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                })
            }

            // Form — slides in from right
            if (formRef.current) {
                gsap.from(formRef.current, {
                    x: 60,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 80%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                })
            }

            // Contact detail cards stagger
            if (detailCardsRef.current) {
                gsap.from(Array.from(detailCardsRef.current.children), {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    delay: 0.3,
                    ease: "power2.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: detailCardsRef.current,
                        start: "top 85%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                })
            }

        }, sectionRef) // scoped — no global side-effects

        return () => ctx.revert()
    }, [])

    // ── JSX ──────────────────────────────────────────────────────────────────

    return (
        <div
            ref={sectionRef}
            className="relative min-h-screen bg-[#F8F8F8] overflow-hidden px-5 md:px-12 lg:px-20 py-24 md:py-32"
        >
            {/* Decorative backgrounds — aria-hidden, pointer-events-none */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
                {/* Primary glow orb — parallax animated */}
                <div
                    ref={glowOrbRef}
                    className="absolute top-20 right-[-10%] rounded-full"
                    style={{
                        width: "min(500px, 80vw)",
                        height: "min(500px, 80vw)",
                        background:
                            "radial-gradient(circle, rgba(249,115,22,0.10) 0%, rgba(249,115,22,0.03) 50%, transparent 70%)",
                        filter: "blur(40px)",
                        willChange: "transform",
                    }}
                />
                {/* Secondary glow — static */}
                <div
                    className="absolute bottom-10 left-[-5%] rounded-full"
                    style={{
                        width: "min(400px, 70vw)",
                        height: "min(400px, 70vw)",
                        background:
                            "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
                {/* Noise grain overlay */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative">

                {/* ── Section header ──────────────────────────────────── */}
                <div className="mb-4">
                    <span className="text-xs tracking-[0.25em] uppercase text-[#F97316]/80 font-medium">
                        Let&apos;s Work Together
                    </span>
                </div>

                <div ref={headingRef} className="mb-6 overflow-hidden">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight">
                        Let&apos;s create{" "}
                        <span
                            className="relative inline-block"
                            style={{
                                background: "linear-gradient(135deg, #F97316 0%, #fb923c 50%, #fed7aa 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                color: "#F97316",   /* fallback */
                            }}
                            aria-label="something"
                        >
                            something
                        </span>
                        <br />
                        <span aria-hidden="true" className="text-[#111111]/25">iconic.</span>
                    </h1>
                </div>

                <p
                    ref={taglineRef}
                    className="text-[#111111]/50 text-base md:text-lg max-w-xl mb-16 leading-relaxed"
                >
                    Whether you&apos;re a startup looking to make noise or an established brand ready to evolve — we&apos;re
                    built for brands that refuse to be ordinary.
                </p>

                {/* ── Main content grid ───────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* ── LEFT — Info panel ──────────────────────────── */}
                    <div ref={infoRef}>

                        {/* Availability badge */}
                        <div
                            aria-hidden="true"
                            className="inline-flex items-center gap-2 border border-[#F97316]/25 bg-[#F97316]/8 rounded-full px-4 py-1.5 mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                            <span className="text-xs text-[#F97316]/90 tracking-wider">Available for projects</span>
                        </div>

                        {/* Contact info cards */}
                        <div ref={detailCardsRef} className="space-y-3 mb-10">
                            {CONTACT_DETAILS.map((detail) => {
                                const Icon = detail.icon
                                const cardInner = (
                                    <>
                                        <div className="mt-0.5 shrink-0 w-9 h-9 rounded-xl bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors">
                                            <Icon size={16} aria-hidden="true" className="text-[#F97316]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#111111]/40 tracking-wider uppercase mb-1">
                                                {detail.label}
                                            </p>
                                            <p className="text-sm text-[#111111]/80 leading-relaxed whitespace-pre-line">
                                                {detail.value}
                                            </p>
                                        </div>
                                        {detail.href && (
                                            <ArrowUpRight
                                                size={14}
                                                aria-hidden="true"
                                                className="ml-auto mt-1 text-[#111111]/20 group-hover:text-[#F97316] transition-colors shrink-0"
                                            />
                                        )}
                                    </>
                                )

                                const sharedClass =
                                    "group flex items-start gap-4 border border-[#111111]/8 bg-white hover:bg-[#F8F8F8] hover:border-[#F97316]/25 rounded-2xl p-4 transition-all duration-300"

                                return detail.href ? (
                                    <a
                                        key={detail.label}
                                        href={detail.href}
                                        aria-label={`${detail.label}: ${detail.value}`}
                                        className={`block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 rounded-2xl`}
                                    >
                                        <div className={sharedClass}>{cardInner}</div>
                                    </a>
                                ) : (
                                    <div key={detail.label} className={sharedClass}>
                                        {cardInner}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Social links */}
                        <div>
                            <p className="text-xs text-[#111111]/35 tracking-widest uppercase mb-4">
                                Find us on
                            </p>
                            <div className="flex gap-3 flex-wrap" role="list" aria-label="Social media profiles">
                                {SOCIAL_LINKS.map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.href}
                                        role="listitem"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${s.name} — opens in a new tab`}
                                        className="group flex items-center gap-1.5 text-xs text-[#111111]/50 border border-[#111111]/12 hover:border-[#F97316]/50 hover:text-[#F97316] px-4 py-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                                    >
                                        {s.name}
                                        <ArrowUpRight
                                            size={11}
                                            aria-hidden="true"
                                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT — Form / Success / Error ─────────────── */}
                    <div>
                        {status === "success" ? (

                            // ── Success state ────────────────────────────
                            <div
                                role="status"
                                aria-live="polite"
                                className="border border-[#F97316]/25 bg-[#F97316]/5 rounded-3xl p-10 text-center min-h-[500px] flex flex-col items-center justify-center"
                            >
                                <div aria-hidden="true" className="w-16 h-16 rounded-full bg-[#F97316]/10 flex items-center justify-center mb-6 mx-auto">
                                    <span className="text-2xl">✦</span>
                                </div>
                                <h3
                                    ref={successHeadRef}
                                    tabIndex={-1}
                                    className="text-2xl font-bold text-[#111111] mb-3 focus:outline-none"
                                >
                                    Message received.
                                </h3>
                                <p className="text-[#111111]/50 text-sm leading-relaxed max-w-xs">
                                    We&apos;ll review your brief and get back to you within 24 hours. Big things incoming.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatus("idle")
                                        setFormData(EMPTY_FORM)
                                        setErrors({})
                                    }}
                                    className="mt-8 text-xs text-[#F97316]/70 hover:text-[#F97316] underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded"
                                >
                                    Send another message
                                </button>
                            </div>

                        ) : (

                            // ── Form ─────────────────────────────────────
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                noValidate        /* we handle validation ourselves */
                                aria-label="Contact form"
                                className="border border-[#111111]/8 bg-white backdrop-blur-sm rounded-3xl p-7 md:p-9 space-y-5"
                            >
                                {/* ── Honeypot — visually hidden from humans ──
                                    Bots auto-fill this; humans never see it.
                                    Uses CSS offscreen technique, NOT display:none,
                                    so assistive tech can discover it's just an
                                    auto-completable web field. */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "-9999px",
                                        top: "-9999px",
                                        width: "1px",
                                        height: "1px",
                                        overflow: "hidden",
                                    }}
                                    aria-hidden="true"
                                >
                                    <label htmlFor={fieldId("website")}>Website</label>
                                    <input
                                        id={fieldId("website")}
                                        name="website"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                {/* API-level error banner */}
                                {status === "error" && errors.api && (
                                    <div
                                        role="alert"
                                        aria-live="assertive"
                                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                                    >
                                        {errors.api}
                                    </div>
                                )}

                                {/* ── Name + Email row ────────────────── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor={fieldId("name")}
                                            className="text-xs text-[#111111]/45 tracking-wider uppercase"
                                        >
                                            Your Name <span aria-hidden="true">*</span>
                                        </label>
                                        <input
                                            id={fieldId("name")}
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            aria-required="true"
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? fieldId("name-err") : undefined}
                                            placeholder="Alex Johnson"
                                            value={formData.name}
                                            onChange={(e) => setField("name", e.target.value)}
                                            className={`${inputBase} ${errors.name ? "border-red-400" : ""}`}
                                        />
                                        {errors.name && (
                                            <p id={fieldId("name-err")} role="alert" className="text-xs text-red-500 mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor={fieldId("email")}
                                            className="text-xs text-[#111111]/45 tracking-wider uppercase"
                                        >
                                            Email <span aria-hidden="true">*</span>
                                        </label>
                                        <input
                                            id={fieldId("email")}
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            required
                                            aria-required="true"
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? fieldId("email-err") : undefined}
                                            placeholder="alex@brand.com"
                                            value={formData.email}
                                            onChange={(e) => setField("email", e.target.value)}
                                            className={`${inputBase} ${errors.email ? "border-red-400" : ""}`}
                                        />
                                        {errors.email && (
                                            <p id={fieldId("email-err")} role="alert" className="text-xs text-red-500 mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* ── Company ─────────────────────────── */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor={fieldId("company")}
                                        className="text-xs text-[#111111]/45 tracking-wider uppercase"
                                    >
                                        Company / Brand
                                    </label>
                                    <input
                                        id={fieldId("company")}
                                        type="text"
                                        name="company"
                                        autoComplete="organization"
                                        placeholder="Your company name"
                                        value={formData.company}
                                        onChange={(e) => setField("company", e.target.value)}
                                        className={inputBase}
                                    />
                                </div>

                                {/* ── Service selector ────────────────── */}
                                <div className="space-y-2">
                                    <p
                                        id={fieldId("service-label")}
                                        className="text-xs text-[#111111]/45 tracking-wider uppercase"
                                    >
                                        I&apos;m interested in...
                                    </p>
                                    <div
                                        role="group"
                                        aria-labelledby={fieldId("service-label")}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {SERVICES.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                aria-pressed={formData.service === s}
                                                onClick={() => setField("service", formData.service === s ? "" : s)}
                                                className={`text-xs px-3.5 py-2 rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] ${formData.service === s
                                                        ? "border-[#F97316] bg-[#F97316]/15 text-[#F97316]"
                                                        : "border-[#111111]/12 text-[#111111]/45 hover:border-[#111111]/30 hover:text-[#111111]/70"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Message ─────────────────────────── */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor={fieldId("message")}
                                        className="text-xs text-[#111111]/45 tracking-wider uppercase"
                                    >
                                        Your Brief <span aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id={fieldId("message")}
                                        name="message"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!errors.message}
                                        aria-describedby={errors.message ? fieldId("message-err") : undefined}
                                        rows={4}
                                        placeholder="Tell us about your project, goals, and what success looks like for you..."
                                        value={formData.message}
                                        onChange={(e) => setField("message", e.target.value)}
                                        className={`${inputBase} resize-none ${errors.message ? "border-red-400" : ""}`}
                                    />
                                    {errors.message && (
                                        <p id={fieldId("message-err")} role="alert" className="text-xs text-red-500 mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {/* ── Submit button ────────────────────── */}
                                <button
                                    ref={submitBtnRef}
                                    type="submit"
                                    disabled={status === "submitting"}
                                    aria-disabled={status === "submitting"}
                                    aria-label={status === "submitting" ? "Sending your message…" : "Send My Brief"}
                                    className="group w-full relative overflow-hidden rounded-xl py-4 px-6 font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                                    style={{
                                        background: "linear-gradient(135deg, #F97316 0%, #ea6c0a 100%)",
                                        color: "#ffffff",
                                    }}
                                >
                                    {/* Shimmer — aria-hidden */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                                        }}
                                    />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {status === "submitting" ? (
                                            <>
                                                <Loader2 size={15} aria-hidden="true" className="animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                Send My Brief
                                                <Send size={15} aria-hidden="true" className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                            </>
                                        )}
                                    </span>
                                </button>

                                <p className="text-center text-xs text-[#111111]/25">
                                    No spam. Ever. We respond within 24 hours.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
