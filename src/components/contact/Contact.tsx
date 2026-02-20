"use client"

import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Mail, Phone, MapPin, Send } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const contactDetails = [
    {
        icon: MapPin,
        label: "Head Office",
        value: "1087 B, Sankranthi, Perumbaikkad\nKottayam - 686016, Kerala",
    },
    {
        icon: MapPin,
        label: "Operational Office",
        value: "Koramangala 8th Block\nBangalore - 560095, Karnataka",
    },
    {
        icon: Mail,
        label: "Email Us",
        value: "info@laneway.in",
        href: "mailto:info@laneway.in",
    },
    {
        icon: Phone,
        label: "Call Us",
        value: "+91 9961348942",
        href: "tel:+919961348942",
    },
]

const services = [
    "Marketing Strategy",
    "Brand Identity",
    "Content Creation",
    "Filming & Production",
    "Social Media",
    "Other",
]

export default function Contact() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const taglineRef = useRef<HTMLParagraphElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)
    const detailCardsRef = useRef<HTMLDivElement>(null)
    const glowOrbRef = useRef<HTMLDivElement>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        service: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Floating glow orb parallax
            gsap.to(glowOrbRef.current, {
                y: -80,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            })

            // Heading split character animation
            gsap.from(headingRef.current, {
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 85%",
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power4.out",
            })

            // Tagline fade in
            gsap.from(taglineRef.current, {
                scrollTrigger: {
                    trigger: taglineRef.current,
                    start: "top 90%",
                },
                y: 30,
                opacity: 0,
                duration: 0.9,
                delay: 0.2,
                ease: "power3.out",
            })

            // Info panel slides in from left
            gsap.from(infoRef.current, {
                scrollTrigger: {
                    trigger: infoRef.current,
                    start: "top 80%",
                },
                x: -60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            })

            // Form slides in from right
            gsap.from(formRef.current, {
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 80%",
                },
                x: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            })

            // Contact detail cards stagger
            if (detailCardsRef.current) {
                gsap.from(detailCardsRef.current.children, {
                    scrollTrigger: {
                        trigger: detailCardsRef.current,
                        start: "top 85%",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power2.out",
                    delay: 0.3,
                })
            }

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Animate the button
        gsap.to(".submit-btn", {
            scale: 0.96,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            onComplete: () => setSubmitted(true),
        })
    }

    const inputBase =
        "w-full bg-[#111111]/5 border border-[#111111]/10 rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder-[#111111]/30 outline-none transition-all duration-300 focus:border-[#F97316]/60 focus:bg-[#111111]/8 focus:shadow-[0_0_20px_rgba(249,115,22,0.08)]"

    return (
        <div
            ref={sectionRef}
            className="relative min-h-screen bg-[#F8F8F8] overflow-hidden px-5 md:px-12 lg:px-20 py-24 md:py-32"
        >
            {/* Background glow orb */}
            <div
                ref={glowOrbRef}
                className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(249,115,22,0.10) 0%, rgba(249,115,22,0.03) 50%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />
            <div
                className="absolute bottom-10 left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Noise grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Section Header */}
            <div className="max-w-7xl mx-auto">
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
                            }}
                        >
                            something
                        </span>
                        <br />
                        <span className="text-[#111111]/25">iconic.</span>
                    </h1>
                </div>

                <p ref={taglineRef} className="text-[#111111]/50 text-base md:text-lg max-w-xl mb-16 leading-relaxed">
                    Whether you&apos;re a startup looking to make noise or an established brand ready to evolve — we&apos;re
                    built for brands that refuse to be ordinary.
                </p>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Left — Info Panel */}
                    <div ref={infoRef}>
                        {/* Neon pill badge */}
                        <div className="inline-flex items-center gap-2 border border-[#F97316]/25 bg-[#F97316]/8 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                            <span className="text-xs text-[#F97316]/90 tracking-wider">Available for projects</span>
                        </div>

                        {/* Contact info cards */}
                        <div ref={detailCardsRef} className="space-y-3 mb-10">
                            {contactDetails.map((detail) => {
                                const Icon = detail.icon
                                const inner = (
                                    <div
                                        key={detail.label}
                                        className="group flex items-start gap-4 border border-[#111111]/8 bg-white hover:bg-[#F8F8F8] hover:border-[#F97316]/25 rounded-2xl p-4 transition-all duration-300"
                                    >
                                        <div className="mt-0.5 shrink-0 w-9 h-9 rounded-xl bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-colors">
                                            <Icon size={16} className="text-[#F97316]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#111111]/40 tracking-wider uppercase mb-1">{detail.label}</p>
                                            <p className="text-sm text-[#111111]/80 leading-relaxed whitespace-pre-line">{detail.value}</p>
                                        </div>
                                        {detail.href && (
                                            <ArrowUpRight
                                                size={14}
                                                className="ml-auto mt-1 text-[#111111]/20 group-hover:text-[#F97316] transition-colors shrink-0"
                                            />
                                        )}
                                    </div>
                                )
                                return detail.href ? (
                                    <a key={detail.label} href={detail.href} className="block">
                                        {inner}
                                    </a>
                                ) : (
                                    <div key={detail.label}>{inner}</div>
                                )
                            })}
                        </div>

                        {/* Social links */}
                        <div>
                            <p className="text-xs text-[#111111]/35 tracking-widest uppercase mb-4">Find us on</p>
                            <div className="flex gap-3 flex-wrap">
                                {[
                                    { name: "Instagram", href: "https://www.instagram.com/7zero.media" },
                                    { name: "LinkedIn", href: "https://www.linkedin.com/company/7zeromedia/" },
                                    { name: "Website", href: "https://www.7zero.media" },
                                ].map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-1.5 text-xs text-[#111111]/50 border border-[#111111]/12 hover:border-[#F97316]/50 hover:text-[#F97316] px-4 py-2 rounded-full transition-all duration-300"
                                    >
                                        {s.name}
                                        <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Contact Form */}
                    <div>
                        {submitted ? (
                            // Success State
                            <div className="border border-[#F97316]/25 bg-[#F97316]/5 rounded-3xl p-10 text-center min-h-[500px] flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-[#F97316]/10 flex items-center justify-center mb-6 mx-auto">
                                    <span className="text-2xl">✦</span>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111111] mb-3">Message received.</h3>
                                <p className="text-[#111111]/50 text-sm leading-relaxed max-w-xs">
                                    We&apos;ll review your brief and get back to you within 24 hours. Big things incoming.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-xs text-[#F97316]/70 hover:text-[#F97316] underline underline-offset-4 transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            // Form
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="border border-[#111111]/8 bg-white backdrop-blur-sm rounded-3xl p-7 md:p-9 space-y-5"
                            >
                                {/* Name + Email row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-[#111111]/45 tracking-wider uppercase">Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Alex Johnson"
                                            value={formData.name}
                                            onFocus={() => setFocused("name")}
                                            onBlur={() => setFocused(null)}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`${inputBase} ${focused === "name" ? "border-[#F97316]/60" : ""}`}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-[#111111]/45 tracking-wider uppercase">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="alex@brand.com"
                                            value={formData.email}
                                            onFocus={() => setFocused("email")}
                                            onBlur={() => setFocused(null)}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`${inputBase} ${focused === "email" ? "border-[#F97316]/60" : ""}`}
                                        />
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-[#111111]/45 tracking-wider uppercase">Company / Brand</label>
                                    <input
                                        type="text"
                                        placeholder="Your company name"
                                        value={formData.company}
                                        onFocus={() => setFocused("company")}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className={`${inputBase} ${focused === "company" ? "border-[#F97316]/60" : ""}`}
                                    />
                                </div>

                                {/* Service selector */}
                                <div className="space-y-2">
                                    <label className="text-xs text-[#111111]/45 tracking-wider uppercase">
                                        I&apos;m interested in...
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {services.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, service: s })}
                                                className={`text-xs px-3.5 py-2 rounded-full border transition-all duration-200 ${formData.service === s
                                                    ? "border-[#F97316] bg-[#F97316]/15 text-[#F97316]"
                                                    : "border-[#111111]/12 text-[#111111]/45 hover:border-[#111111]/30 hover:text-[#111111]/70"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-[#111111]/45 tracking-wider uppercase">Your Brief *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Tell us about your project, goals, and what success looks like for you..."
                                        value={formData.message}
                                        onFocus={() => setFocused("message")}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className={`${inputBase} resize-none ${focused === "message" ? "border-[#F97316]/60" : ""}`}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="submit-btn group w-full relative overflow-hidden rounded-xl py-4 px-6 font-semibold text-sm tracking-wide transition-all duration-300"
                                    style={{
                                        background: "linear-gradient(135deg, #F97316 0%, #ea6c0a 100%)",
                                        color: "#ffffff",
                                    }}
                                >
                                    {/* Shimmer effect */}
                                    <span
                                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                                        }}
                                    />
                                    <span className="relative flex items-center justify-center gap-2">
                                        Send My Brief
                                        <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
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
