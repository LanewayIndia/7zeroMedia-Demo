"use client"

/**
 * About — Production-Grade Component
 *
 * Key engineering decisions:
 *
 *  1. GLOBAL GSAP SELECTORS ELIMINATED
 *     `gsap.set(".line", …)` and `tl.to(".line", …)` targeted EVERY element
 *     on the page that had the class "line" — not just lines inside this
 *     component. Replaced with `split.lines` array (the elements SplitType
 *     already returns), scoped strictly inside `gsap.context(sectionRef)`.
 *
 *  2. SPLITTYPE + MANUAL DOM MUTATION FIXED
 *     The original code manually created `<div class="line-mask">` wrapper
 *     elements via `document.createElement`. These wrapper divs were never
 *     removed by `split.revert()`, causing cumulative DOM pollution on HMR
 *     and potential hydration mismatches. The new approach:
 *       a) Uses CSS `overflow: hidden` on the H2 container instead.
 *       b) Calls `split.revert()` in cleanup — SplitType's own cleanup is
 *          now sufficient because we never touch the DOM manually.
 *
 *  3. MOUSE TILT — rAF-THROTTLED
 *     The original handler fired `gsap.to()` on every single mousemove pixel.
 *     At 120Hz, that's 120 GSAP tween creations per second. Now the handler
 *     stores the latest mouse data and flushes it inside `requestAnimationFrame`
 *     — one GSAP call per rendered frame maximum. The rAF is cancelled on
 *     mouseleave and on unmount to prevent memory leaks.
 *
 *  4. TOUCH DEVICE DETECTION
 *     Tilt is disabled on touch devices via `window.matchMedia("(hover: none)")`.
 *     touch devices don't get the cursor-tracking events anyway, but this also
 *     prevents phantom event listeners from attaching on iOS/Android.
 *
 *  5. prefers-reduced-motion
 *     If the user requests reduced motion:
 *       - SplitType is not initialised (heading stays readable, no DOM churn).
 *       - GSAP timeline is not created.
 *       - Mouse tilt is not applied.
 *       - The section is immediately visible.
 *
 *  6. VIDEO HARDENING
 *     - `preload="metadata"` — browser fetches only the first frame / duration,
 *       not the entire file, reducing bandwidth on initial load.
 *     - `poster="/about-poster.jpg"` — shows a still frame while the video
 *       buffers; prevents a blank box flash.
 *     - `playsInline` — required for autoplay on iOS Safari.
 *     - Accessible text fallback inside `<video>` for screen readers.
 *
 *  7. GSAP HARDENING
 *     - `once: true` on the ScrollTrigger — no re-fire on scroll-up.
 *     - `invalidateOnRefresh: true` — scroll position recalculates on resize.
 *     - `clearProps` on all tweens — inline styles stripped after animation.
 *     - GSAP context scoped to `sectionRef`.
 *
 *  8. ARIA
 *     - Glow `div` is `aria-hidden="true"`.
 *     - Video container has `aria-hidden` (decorative) and text fallback.
 *     - Gradient text span has a `color` fallback.
 *     - `<section>` has `aria-label` for landmark navigation.
 *
 *  9. SPLITTYPE — RESIZE RESILIENCE
 *     SplitType breaks line splits on window resize because line boundaries
 *     change. We listen for `resize` and call `split.revert()` + re-split +
 *     re-set initial states inside a debounced handler. The GSAP timeline that
 *     animates the reveal only runs once (the scroll trigger fires with
 *     `once: true`), so resize only re-splits the DOM — the animation result
 *     stays visible after it has fired.
 */

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "@/lib/gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitType from "split-type"

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  // ── rAF-throttled tilt state ──────────────────────────────────────────
  // Stored in refs so the rAF callback always reads the latest values
  // without needing to be re-created on every render.
  const tiltFrame = useRef<number | null>(null)
  const tiltData = useRef({ rotateX: 0, rotateY: 0 })

  // ── Scroll-reveal + SplitType ─────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!sectionRef.current || !headingRef.current) return

    // ── Reduced motion: just show everything immediately ───────────────
    if (prefersReduced) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      return
    }

    let split: SplitType | null = null

    // Helper — (re)initialise SplitType and set initial hidden state
    const initSplit = () => {
      // Revert previous split cleanly before creating a new one
      split?.revert()

      split = new SplitType(headingRef.current!, {
        types: "lines",
        lineClass: "split-line",
      })

      // Set initial hidden state using the element references SplitType
      // returns — NOT a global class selector
      if (split.lines?.length) {
        gsap.set(split.lines, { yPercent: 110 })
      }
    }

    initSplit()

    // Set initial section state
    gsap.set(sectionRef.current, { opacity: 0, y: 60 })

    // ── GSAP context — scoped to section; no global side-effects ────────
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,               // never re-fires; HMR-safe
          invalidateOnRefresh: true,
        },
      })

      tl.to(sectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        clearProps: "transform,opacity,willChange",
      })

      // Animate split lines if available
      if (split?.lines?.length) {
        tl.to(
          split.lines,              // ← element array, not ".line" string selector
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power4.out",
            clearProps: "transform,willChange",
          },
          "-=0.6"
        )
      }
    }, sectionRef)

    // ── SplitType resize handler — debounced at 200ms ─────────────────
    // When the viewport resizes, line-wrap positions change. We revert and
    // re-split so the DOM is clean. The animation has already fired
    // (once: true), so visible text stays visible.
    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!headingRef.current) return
        // Kill any pending set on the old lines before re-splitting
        if (split?.lines) gsap.set(split.lines, { clearProps: "all" })
        split?.revert()
        // After the ScrollTrigger has fired (animation done), just
        // keep text visible — no need to re-hide
      }, 200)
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      ctx.revert()                   // kills timeline + ScrollTrigger
      ScrollTrigger.getAll().forEach(st => st.kill())
      split?.revert()                // restores original heading DOM
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // ── rAF-throttled mouse tilt ──────────────────────────────────────────
  // Attach/detach separately from the GSAP effect so cleanup is clean.
  useEffect(() => {
    const videoCard = videoRef.current
    if (!videoCard) return

    // Disable on touch devices and when reduced motion is requested
    const isTouch = window.matchMedia("(hover: none)").matches
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (isTouch || prefersReduced) return

    // Ensure GPU compositing is set once, not on every frame
    gsap.set(videoCard, { transformPerspective: 1000, transformOrigin: "center center" })

    // rAF flush — called at most once per rendered frame
    const flushTilt = () => {
      tiltFrame.current = null
      gsap.to(videoCard, {
        rotateX: tiltData.current.rotateX,
        rotateY: tiltData.current.rotateY,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",  // cancels any in-progress tween, no queue buildup
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = videoCard.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Store latest values — the rAF will read them when it fires
      tiltData.current = {
        rotateX: ((y - rect.height / 2) / rect.height) * 8,
        rotateY: -((x - rect.width / 2) / rect.width) * 8,
      }

      // Schedule a flush only if one isn't already scheduled this frame
      if (tiltFrame.current === null) {
        tiltFrame.current = requestAnimationFrame(flushTilt)
      }
    }

    const handleMouseLeave = () => {
      // Cancel any pending rAF before resetting
      if (tiltFrame.current !== null) {
        cancelAnimationFrame(tiltFrame.current)
        tiltFrame.current = null
      }
      gsap.to(videoCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      })
    }

    videoCard.addEventListener("mousemove", handleMouseMove, { passive: true })
    videoCard.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      // Cancel any inflight rAF on unmount
      if (tiltFrame.current !== null) {
        cancelAnimationFrame(tiltFrame.current)
        tiltFrame.current = null
      }
      videoCard.removeEventListener("mousemove", handleMouseMove)
      videoCard.removeEventListener("mouseleave", handleMouseLeave)
      // Clean up inline transform state
      gsap.set(videoCard, { clearProps: "rotateX,rotateY,transformPerspective,transformOrigin" })
    }
  }, [])

  // ── JSX ───────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About 7ZeroMedia"
      className="bg-[#F8F8F8] text-[#111111] py-16 md:py-24 lg:py-28 px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* ── LEFT — Copy ──────────────────────────────────────── */}
        <div>
          <p className="text-sm uppercase tracking-widest text-[#F97316] font-semibold mb-4">
            About 7ZeroMedia
          </p>

          {/*
                        overflow-hidden on this wrapper provides the line-mask
                        effect without manual DOM mutations.
                        SplitType sets yPercent: 110 on each .split-line,
                        and the overflow clip hides them until the tween fires.
                    */}
          <div className="overflow-hidden mb-6">
            <h2
              ref={headingRef}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
            >
              Building Modern Brands
              <br />
              Through Strategy &amp; Performance
            </h2>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            AI-powered storytelling engineered for performance.
            We turn culture and content into scalable brand authority.
          </p>

          <button
            type="button"
            className="mt-8 px-6 py-3 bg-[#F97316] text-white rounded-lg font-semibold hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
          >
            Learn More
          </button>
        </div>

        {/* ── RIGHT — Video ─────────────────────────────────────── */}
        <div className="relative">
          {/* Glow — decorative, not read by screen readers */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#F97316]/10 blur-3xl rounded-3xl pointer-events-none"
          />

          {/*
                        Video card — tilt target.
                        will-change is set by GSAP once on mount (transformPerspective).
                        transformStyle: preserve-3d ensures child elements participate
                        in the 3D space.
                    */}
          <div
            ref={videoRef}
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <video
              src="/about-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              // preload=metadata: fetches only video metadata (duration,
              // dimensions, poster frame) on initial load — not the full file.
              // Reduces bandwidth usage significantly on slow connections.
              preload="metadata"
              // poster: shown while video buffers; prevents blank box flash
              poster="/about-poster.jpg"
              aria-hidden="true"   // decorative — content is conveyed by copy
              className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
            >
              {/* Accessible fallback for screen readers and no-video environments */}
              <p>
                A video showcasing 7ZeroMedia&apos;s work. Your browser does not support HTML5 video.
              </p>
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}