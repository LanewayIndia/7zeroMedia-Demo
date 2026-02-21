"use client"

/**
 * Careers Page — Production-Grade Component
 *
 * Key engineering decisions:
 *
 *  1. `useState<any>` ELIMINATED
 *     `selectedJob` was `useState<any>(null)` — zero type safety, no
 *     autocomplete, no compile-time protection. Replaced with the explicit
 *     `Job | null` union using a typed module-level interface.
 *
 *  2. FILE UPLOAD HARDENING (CRITICAL)
 *     The original file input had no `accept` attribute (any file type
 *     uploadable), no size limit, and used `(e: any)` to suppress TS errors.
 *     Now:
 *       - `accept=".pdf,.doc,.docx"` restricts the file-picker UI
 *       - ALLOWED_MIME validates the actual MIME type (not just the name)
 *       - MAX_FILE_BYTES (5 MB) is enforced client-side
 *       - `fileError` state surfaces the error inline
 *       - The file ref is cleared on form reset / job change
 *
 *  3. FORM STATE MACHINE
 *     Replaced missing state with proper enum: "idle"|"submitting"|"success"|"error".
 *     - Submit button is disabled + shows spinner while submitting
 *     - Success confirmation replaces the form
 *     - Error banner is aria-live="assertive"
 *
 *  4. CLIENT-SIDE VALIDATION
 *     All required fields validated before sending. Per-field error messages
 *     are linked via `aria-describedby` and announced by screen readers.
 *     URL fields use a URL constructor check (not a fragile regex).
 *
 *  5. HONEYPOT ANTI-SPAM
 *     A visually offscreen `website` input is included. Bots fill it;
 *     humans never see it. The submit handler silently discards on detection.
 *
 *  6. ACCESSIBILITY — LABELS + KEYBOARD + ARIA
 *     - Every `<input>`, `<select>`, `<textarea>` has `id` + a matching
 *       `<label htmlFor>` via `useId()` — satisfies WCAG 1.3.1.
 *     - `aria-required` on all required fields.
 *     - `aria-invalid` + `aria-describedby` on errored fields.
 *     - Job cards are `role="button"` + `tabIndex={0}` + `onKeyDown` —
 *       fully keyboard-navigable.
 *     - File drop-zone label has matching `htmlFor`.
 *     - Focus rings are visible (`focus-visible:ring-2`).
 *
 *  7. BACK BUTTON TYPE FIXED
 *     `<button onClick={() => setSelectedJob(null)}>` had no `type` attribute,
 *     so it defaulted to `type="submit"` inside a form context and would
 *     trigger form validation. Fixed to `type="button"`.
 *
 *  8. GSAP HARDENING
 *     - `gsap.context(…, listRef)` scopes all tweens — no global side effects.
 *     - `once: true` + `invalidateOnRefresh: true` on the ScrollTrigger.
 *     - `clearProps: "transform,opacity,willChange"` after animation.
 *     - `prefers-reduced-motion` guard skips all GSAP entirely.
 *     - Proper cleanup via `ctx.revert()` in the effect return.
 *
 *  9. FORM RESET ON JOB CHANGE
 *     When the user picks a different job or goes back, all form fields,
 *     validation errors, file state, status, and the file input's DOM value
 *     are all fully reset.
 *
 * 10. DEAD CODE REMOVED
 *     The original file was 525 lines; the first 198 were entirely commented-
 *     out previous implementations adding no value.
 */

import { useState, useRef, useEffect, useCallback, useId } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Job {
    id: number
    title: string
    type: string
    location: string
    intro: string
    tech: string[]
    responsibilities: string[]
    expectations: string[]
}

type FormStatus = "idle" | "submitting" | "success" | "error"

interface FormData {
    name: string
    email: string
    portfolio: string
    linkedin: string
    github: string
    experience: string
    about: string
}

interface FormErrors {
    name?: string
    email?: string
    portfolio?: string
    linkedin?: string
    github?: string
    experience?: string
    about?: string
    file?: string
    api?: string
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const ALLOWED_MIME = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const EXPERIENCE_OPTIONS = [
    "Fresher",
    "1-3 Years",
    "3-5 Years",
    "5+ Years",
    "Currently Attending College",
] as const

const EMPTY_FORM: FormData = {
    name: "", email: "", portfolio: "", linkedin: "",
    github: "", experience: "", about: "",
}

/* ─── Static job data ────────────────────────────────────────────────────────
   Module-level — never re-created on render. Ready for future extraction
   to a CMS / data file for dynamic routes like /careers/[slug].
─────────────────────────────────────────────────────────────────────────── */

const JOBS: Job[] = [
    {
        id: 1,
        title: "Performance Marketing Specialist",
        type: "Full-Time",
        location: "Remote",
        intro:
            "We are building a performance-first growth infrastructure. This role is critical in designing, optimizing, and scaling ROI-positive acquisition systems across paid media channels.",
        tech: [
            "Meta Ads Manager",
            "Google Ads",
            "Google Analytics 4",
            "Conversion Tracking & Pixel Setup",
            "A/B Testing Frameworks",
        ],
        responsibilities: [
            "Plan and execute paid campaigns across platforms",
            "Build structured testing frameworks",
            "Optimize CPA, ROAS, and funnel performance",
            "Analyze data and generate actionable insights",
        ],
        expectations: [
            "Strong analytical thinking",
            "Bias toward experimentation",
            "Ownership mentality",
            "Clear communication skills",
        ],
    },
    {
        id: 2,
        title: "Social Media Strategist",
        type: "Full-Time",
        location: "Remote",
        intro:
            "A Social Media Strategist develops and executes strategies to grow a brand's presence across digital platforms. This role focuses on audience engagement, content planning, performance analysis, and trend monitoring to increase reach, conversions, and brand awareness.",
        tech: [
            "Analytics Tools: Google Analytics, Meta Business Suite",
            "Scheduling Tools: Hootsuite, Buffer",
            "Design Tools: Canva, Adobe Photoshop",
            "Platforms: Instagram, Facebook, LinkedIn, TikTok",
        ],
        responsibilities: [
            "Develop and implement social media content strategies.",
            "Create and manage content calendars.",
            "Analyze performance metrics and optimize campaigns.",
            "Engage with followers and manage online communities.",
            "Track trends, competitors, and emerging platform features.",
        ],
        expectations: [
            "Strong understanding of social media algorithms and trends.",
            "Data-driven mindset with analytical skills.",
            "Creative thinking and brand storytelling ability.",
            "Excellent communication and copywriting skills.",
            "Consistency, adaptability, and strategic planning skills.",
        ],
    },
    {
        id: 3,
        title: "Video Editor & Content Producer",
        type: "Full-Time",
        location: "Remote",
        intro:
            "A Video Editor & Content Producer is responsible for transforming raw footage into engaging visual stories that align with a brand's goals. This role combines creative storytelling, technical editing skills, and production planning to create high-quality video content for digital platforms, advertisements, YouTube, events, and social media.",
        tech: [
            "Editing Software: Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve",
            "Graphics & Motion: Adobe After Effects, Canva",
            "Audio Editing: Adobe Audition",
            "Equipment: DSLR/Mirrorless cameras, lighting setups, microphones",
            "Collaboration Tools: Frame.io, Google Drive",
        ],
        responsibilities: [
            "Edit and assemble recorded raw material into polished final videos.",
            "Add motion graphics, sound design, color correction, and visual effects.",
            "Plan and execute video shoots (script, storyboard, production coordination).",
            "Optimize videos for different platforms (YouTube, Instagram, ads, etc.).",
            "Manage video archives and ensure timely delivery of projects.",
        ],
        expectations: [
            "Strong storytelling and visual sense.",
            "Proficiency in editing and motion graphics tools.",
            "Ability to meet tight deadlines and manage multiple projects.",
            "Attention to detail in audio, visuals, and transitions.",
            "Good communication and collaboration skills.",
        ],
    },
]

/* ─── Shared input class ─────────────────────────────────────────────────── */

const inputBase =
    "w-full p-4 rounded-lg border border-[#111111]/10 bg-white text-[#111111] placeholder-[#111111]/35 outline-none transition-colors duration-200 focus:border-[#F97316] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:ring-offset-1"

/* ─── URL validator ──────────────────────────────────────────────────────── */

function isValidUrl(value: string): boolean {
    if (!value) return true // optional fields — empty is valid
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Careers() {

    // ── Stable IDs for label/input pairing ──────────────────────────────────
    const uid = useId()
    const fid = (f: string) => `${uid}-${f}`

    // ── State ────────────────────────────────────────────────────────────────
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
    const [errors, setErrors] = useState<FormErrors>({})
    const [status, setStatus] = useState<FormStatus>("idle")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string>("")

    // ── Refs ─────────────────────────────────────────────────────────────────
    const listRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const successHeadRef = useRef<HTMLHeadingElement>(null)

    // ── GSAP scroll reveal on job list ───────────────────────────────────────
    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReduced || !listRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                Array.from(listRef.current!.children),
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power3.out",
                    clearProps: "transform,opacity,willChange",
                    scrollTrigger: {
                        trigger: listRef.current,
                        start: "top 80%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                }
            )
        }, listRef)

        return () => ctx.revert()
    }, [])

    // ── Focus success heading for screen readers ─────────────────────────────
    useEffect(() => {
        if (status === "success" && successHeadRef.current) {
            successHeadRef.current.focus()
        }
    }, [status])

    // ── Reset all form state when a job is selected / deselected ────────────
    const resetForm = useCallback(() => {
        setFormData(EMPTY_FORM)
        setErrors({})
        setStatus("idle")
        setSelectedFile(null)
        setFileError("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }, [])

    const openJob = useCallback((job: Job) => {
        resetForm()
        setSelectedJob(job)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [resetForm])

    const goBack = useCallback(() => {
        resetForm()
        setSelectedJob(null)
    }, [resetForm])

    // ── Update a single form field, clear its error on change ───────────────
    const setField = useCallback(
        <K extends keyof FormData>(key: K, value: FormData[K]) => {
            setFormData(prev => ({ ...prev, [key]: value }))
            if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
        },
        [errors]
    )

    // ── File validation ──────────────────────────────────────────────────────
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setFileError("")
        setSelectedFile(null)

        if (!file) return

        if (!ALLOWED_MIME.has(file.type)) {
            setFileError("Only PDF, DOC, or DOCX files are allowed.")
            if (fileInputRef.current) fileInputRef.current.value = ""
            return
        }
        if (file.size > MAX_FILE_BYTES) {
            setFileError("File must be 5 MB or smaller.")
            if (fileInputRef.current) fileInputRef.current.value = ""
            return
        }

        setSelectedFile(file)
    }, [])

    // ── Client-side validation ───────────────────────────────────────────────
    function validate(data: FormData, file: File | null): FormErrors {
        const e: FormErrors = {}

        if (!data.name.trim() || data.name.trim().length < 2)
            e.name = "Please enter your full name."

        if (!data.email.trim() || !EMAIL_RE.test(data.email.trim()))
            e.email = "Please enter a valid email address."

        if (data.portfolio && !isValidUrl(data.portfolio))
            e.portfolio = "Please enter a valid URL (e.g. https://...)."

        if (data.linkedin && !isValidUrl(data.linkedin))
            e.linkedin = "Please enter a valid LinkedIn URL."

        if (data.github && !isValidUrl(data.github))
            e.github = "Please enter a valid GitHub URL."

        if (!data.experience)
            e.experience = "Please select your experience level."

        if (!data.about.trim() || data.about.trim().length < 10)
            e.about = "Please tell us a bit about yourself (at least 10 characters)."

        if (!file)
            e.file = "Please upload your CV."

        return e
    }

    // ── Form submit ──────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === "submitting") return

        // Honeypot check
        const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value
        if (honeypot) {
            // Bot detected — silently succeed
            setStatus("success")
            return
        }

        const validationErrors = validate(formData, selectedFile)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            // Move focus to first errored field
            const firstKey = Object.keys(validationErrors)[0]
            const el = document.getElementById(fid(firstKey))
            el?.focus()
            return
        }

        setStatus("submitting")
        setErrors({})

        try {
            // Prepare multipart payload for backend integration
            const payload = new FormData()
            payload.append("name", formData.name.trim())
            payload.append("email", formData.email.trim())
            payload.append("portfolio", formData.portfolio.trim())
            payload.append("linkedin", formData.linkedin.trim())
            payload.append("github", formData.github.trim())
            payload.append("experience", formData.experience)
            payload.append("about", formData.about.trim())
            payload.append("jobTitle", selectedJob?.title ?? "")
            if (selectedFile) payload.append("cv", selectedFile, selectedFile.name)

            const res = await fetch("/api/careers", {
                method: "POST",
                body: payload,
                // No Content-Type header — fetch sets multipart/form-data boundary automatically
            })

            if (res.status === 422) {
                // Server returned per-field validation errors — surface them in the form
                const data = await res.json().catch(() => ({}))
                if (data.errors) {
                    setErrors(data.errors)
                    setStatus("idle")
                    return
                }
            }

            if (!res.ok) throw new Error("Server error")

            setStatus("success")
        } catch {
            setStatus("error")
            setErrors({ api: "Something went wrong. Please try again or email us directly." })
        }
    }, [status, formData, selectedFile, selectedJob, fid])

    // ── JSX ──────────────────────────────────────────────────────────────────

    return (
        <section
            aria-label="Careers at 7ZeroMedia"
            className="bg-white min-h-screen px-6 md:px-16 lg:px-24 py-32 text-[#111111]"
        >
            {/* ── JOB LIST VIEW ────────────────────────────────────────────── */}
            {!selectedJob && (
                <div className="max-w-5xl mx-auto">
                    <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-4 block">
                        Careers
                    </span>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        Join The Growth Engine
                    </h1>

                    <p className="text-[#111111]/45 text-lg max-w-xl mb-20 leading-relaxed">
                        We&apos;re building a team of operators, strategists, and creators.
                        Explore open roles below and become part of the system.
                    </p>

                    {/* Job cards */}
                    <div ref={listRef} className="flex flex-col gap-6" role="list" aria-label="Open positions">
                        {JOBS.map((job) => (
                            <div
                                key={job.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`View role: ${job.title}, ${job.type}, ${job.location}`}
                                onClick={() => openJob(job)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        openJob(job)
                                    }
                                }}
                                className="cursor-pointer bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-8 hover:border-[#F97316]/30 hover:shadow-[0_8px_40px_rgba(249,115,22,0.08)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                            >
                                <h2 className="text-2xl font-bold">{job.title}</h2>
                                <p className="text-sm text-[#111111]/45 mt-1">
                                    {job.type} • {job.location}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── JOB DETAIL + APPLICATION FORM ───────────────────────────── */}
            {selectedJob && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* ── LEFT — Job detail ─────────────────────────────── */}
                    <div>
                        <button
                            type="button"       /* CRITICAL: was defaulting to "submit" */
                            onClick={goBack}
                            className="flex items-center gap-2 text-sm text-[#F97316] mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded"
                        >
                            <ArrowLeft size={16} aria-hidden="true" />
                            Back to openings
                        </button>

                        <h1 className="text-4xl font-bold mb-3">{selectedJob.title}</h1>
                        <p className="text-sm text-[#111111]/45 mb-8">
                            {selectedJob.type} • {selectedJob.location}
                        </p>

                        <div className="space-y-8 text-[#111111]/60 leading-relaxed">
                            <p>{selectedJob.intro}</p>

                            <div>
                                <h2 className="font-semibold text-[#111111] mb-3">Tech Stack Required</h2>
                                <ul className="list-disc ml-6 space-y-1" role="list">
                                    {selectedJob.tech.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#111111] mb-3">Key Responsibilities</h2>
                                <ul className="list-disc ml-6 space-y-1" role="list">
                                    {selectedJob.responsibilities.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#111111] mb-3">What We Expect From You</h2>
                                <ul className="list-disc ml-6 space-y-1" role="list">
                                    {selectedJob.expectations.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT — Application form ──────────────────────── */}
                    <div className="bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-10 shadow-sm">

                        <h2 className="text-2xl font-bold mb-8">Apply for this position</h2>

                        {/* ── Success state ─────────────────────────────── */}
                        {status === "success" ? (
                            <div role="status" aria-live="polite" className="text-center py-12">
                                <div aria-hidden="true" className="w-14 h-14 rounded-full bg-[#F97316]/10 flex items-center justify-center mb-5 mx-auto">
                                    <span className="text-2xl">✦</span>
                                </div>
                                <h3
                                    ref={successHeadRef}
                                    tabIndex={-1}
                                    className="text-xl font-bold text-[#111111] mb-3 focus:outline-none"
                                >
                                    Application submitted.
                                </h3>
                                <p className="text-[#111111]/50 text-sm leading-relaxed max-w-xs mx-auto">
                                    We&apos;ve received your application and will review it shortly. We&apos;ll be in touch!
                                </p>
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="mt-8 text-sm text-[#F97316] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded"
                                >
                                    View other openings
                                </button>
                            </div>
                        ) : (
                            /* ── Form ──────────────────────────────────── */
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                aria-label={`Application form for ${selectedJob.title}`}
                                className="flex flex-col gap-5"
                            >
                                {/* Honeypot — visually offscreen */}
                                <div
                                    style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                                    aria-hidden="true"
                                >
                                    <label htmlFor={fid("website")}>Website</label>
                                    <input id={fid("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
                                </div>

                                {/* API error banner */}
                                {status === "error" && errors.api && (
                                    <div role="alert" aria-live="assertive" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {errors.api}
                                    </div>
                                )}

                                {/* ── Full Name ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("name")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        Full Name <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id={fid("name")}
                                        type="text"
                                        name="name"
                                        autoComplete="name"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!errors.name}
                                        aria-describedby={errors.name ? fid("name-err") : undefined}
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={(e) => setField("name", e.target.value)}
                                        className={`${inputBase} ${errors.name ? "border-red-400" : ""}`}
                                    />
                                    {errors.name && (
                                        <p id={fid("name-err")} role="alert" className="text-xs text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* ── Email ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("email")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        Email Address <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id={fid("email")}
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? fid("email-err") : undefined}
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setField("email", e.target.value)}
                                        className={`${inputBase} ${errors.email ? "border-red-400" : ""}`}
                                    />
                                    {errors.email && (
                                        <p id={fid("email-err")} role="alert" className="text-xs text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* ── Portfolio ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("portfolio")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        Portfolio Link
                                    </label>
                                    <input
                                        id={fid("portfolio")}
                                        type="url"
                                        name="portfolio"
                                        autoComplete="url"
                                        aria-invalid={!!errors.portfolio}
                                        aria-describedby={errors.portfolio ? fid("portfolio-err") : undefined}
                                        placeholder="https://yourportfolio.com"
                                        value={formData.portfolio}
                                        onChange={(e) => setField("portfolio", e.target.value)}
                                        className={`${inputBase} ${errors.portfolio ? "border-red-400" : ""}`}
                                    />
                                    {errors.portfolio && (
                                        <p id={fid("portfolio-err")} role="alert" className="text-xs text-red-500 mt-1">{errors.portfolio}</p>
                                    )}
                                </div>

                                {/* ── LinkedIn ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("linkedin")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        LinkedIn Profile URL
                                    </label>
                                    <input
                                        id={fid("linkedin")}
                                        type="url"
                                        name="linkedin"
                                        aria-invalid={!!errors.linkedin}
                                        aria-describedby={errors.linkedin ? fid("linkedin-err") : undefined}
                                        placeholder="https://linkedin.com/in/yourname"
                                        value={formData.linkedin}
                                        onChange={(e) => setField("linkedin", e.target.value)}
                                        className={`${inputBase} ${errors.linkedin ? "border-red-400" : ""}`}
                                    />
                                    {errors.linkedin && (
                                        <p id={fid("linkedin-err")} role="alert" className="text-xs text-red-500 mt-1">{errors.linkedin}</p>
                                    )}
                                </div>

                                {/* ── GitHub ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("github")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        GitHub Profile URL
                                    </label>
                                    <input
                                        id={fid("github")}
                                        type="url"
                                        name="github"
                                        aria-invalid={!!errors.github}
                                        aria-describedby={errors.github ? fid("github-err") : undefined}
                                        placeholder="https://github.com/yourhandle"
                                        value={formData.github}
                                        onChange={(e) => setField("github", e.target.value)}
                                        className={`${inputBase} ${errors.github ? "border-red-400" : ""}`}
                                    />
                                    {errors.github && (
                                        <p id={fid("github-err")} role="alert" className="text-xs text-red-500 mt-1">{errors.github}</p>
                                    )}
                                </div>

                                {/* ── Experience ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("experience")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        Experience Level <span aria-hidden="true">*</span>
                                    </label>
                                    <select
                                        id={fid("experience")}
                                        name="experience"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!errors.experience}
                                        aria-describedby={errors.experience ? fid("experience-err") : undefined}
                                        value={formData.experience}
                                        onChange={(e) => setField("experience", e.target.value)}
                                        className={`${inputBase} ${errors.experience ? "border-red-400" : ""}`}
                                    >
                                        <option value="">Select experience level</option>
                                        {EXPERIENCE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.experience && (
                                        <p id={fid("experience-err")} role="alert" className="text-xs text-red-500 mt-1">{errors.experience}</p>
                                    )}
                                </div>

                                {/* ── About ── */}
                                <div className="space-y-1">
                                    <label htmlFor={fid("about")} className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider">
                                        About You <span aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id={fid("about")}
                                        name="about"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!errors.about}
                                        aria-describedby={errors.about ? fid("about-err") : fid("about-count")}
                                        maxLength={1000}
                                        rows={5}
                                        value={formData.about}
                                        onChange={(e) => setField("about", e.target.value)}
                                        placeholder="Tell us a bit about yourself (Max 1000 characters)..."
                                        className={`${inputBase} resize-none ${errors.about ? "border-red-400" : ""}`}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {errors.about
                                            ? <p id={fid("about-err")} role="alert" className="text-xs text-red-500">{errors.about}</p>
                                            : <span />
                                        }
                                        <p id={fid("about-count")} className="text-xs text-[#111111]/40 ml-auto">
                                            {formData.about.length}/1000
                                        </p>
                                    </div>
                                </div>

                                {/* ── CV Upload ── */}
                                <div>
                                    <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-wider mb-3">
                                        Upload Your CV <span aria-hidden="true">*</span>
                                    </p>

                                    <label
                                        htmlFor={fid("cv")}
                                        aria-describedby={fileError ? fid("cv-err") : undefined}
                                        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${fileError
                                            ? "border-red-400 bg-red-50"
                                            : selectedFile
                                                ? "border-[#F97316]/60 bg-[#F97316]/5"
                                                : "border-[#111111]/15 hover:border-[#F97316]/40"
                                            }`}
                                    >
                                        <UploadCloud
                                            size={28}
                                            aria-hidden="true"
                                            className={`mb-3 ${fileError ? "text-red-400" : "text-[#F97316]"}`}
                                        />
                                        <span className="text-sm text-[#111111]/50">
                                            {selectedFile
                                                ? "File selected — click to change"
                                                : "Drag & drop your CV here or click to upload"
                                            }
                                        </span>
                                        <span className="text-xs text-[#111111]/40 mt-1">
                                            PDF, DOC, DOCX — max 5 MB
                                        </span>
                                        <input
                                            ref={fileInputRef}
                                            id={fid("cv")}
                                            name="cv"
                                            type="file"
                                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            aria-required="true"
                                            aria-invalid={!!fileError || !!errors.file}
                                            aria-describedby={fileError || errors.file ? fid("cv-err") : undefined}
                                            className="sr-only"  /* visually hidden but accessible — unlike display:none */
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    {/* File selected name */}
                                    {selectedFile && !fileError && (
                                        <p className="text-sm text-[#111111]/60 mt-3" aria-live="polite">
                                            Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(0)} KB)
                                        </p>
                                    )}

                                    {/* File error */}
                                    {(fileError || errors.file) && (
                                        <p id={fid("cv-err")} role="alert" className="text-xs text-red-500 mt-2">
                                            {fileError || errors.file}
                                        </p>
                                    )}
                                </div>

                                {/* ── Submit ── */}
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    aria-disabled={status === "submitting"}
                                    aria-label={status === "submitting" ? "Submitting your application…" : "Submit Application"}
                                    className="mt-2 bg-[#F97316] text-white py-4 rounded-xl font-semibold hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_10px_40px_rgba(249,115,22,0.3)] disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                                            Submitting…
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </button>

                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}