"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import SplitType from "split-type"

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        if (!headingRef.current || !heroRef.current) return

        const split = new SplitType(headingRef.current, {
            types: "lines",
            lineClass: "line",
        })

        split.lines?.forEach((line) => {
            const wrapper = document.createElement("div")
            wrapper.classList.add("line-mask")
            line.parentNode?.insertBefore(wrapper, line)
            wrapper.appendChild(line)
        })

        gsap.set(".line", { yPercent: 100 })
        gsap.set(subRef.current, { opacity: 0, y: 40 })

        const tl = gsap.timeline()

        tl.to(".line", {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power4.out",
        }).to(
            subRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            },
            "-=0.6"
        )

        // Cinematic scale
        gsap.fromTo(
            heroRef.current,
            { scale: 1.05 },
            { scale: 1, duration: 2, ease: "power3.out" }
        )

        // 🔥 Subtle grid parallax animation
        gsap.to(".grid-bg", {
            backgroundPosition: "0px 200px",
            duration: 20,
            repeat: -1,
            ease: "none",
        })

        return () => {
            split.revert()
        }
    }, [])

    return (
        <section
            ref={heroRef}
            className="relative h-screen flex items-center justify-center bg-black px-6 text-center overflow-hidden"
        >
            {/* 🔥 PARALLAX GRID BACKGROUND */}
            <div className="grid-bg absolute inset-0 -z-10"></div>

            {/* HERO CONTENT */}
            <div className="max-w-6xl">
                <h1
                    ref={headingRef}
                    className="text-6xl md:text-8xl lg:text-[120px] font-extrabold leading-[1.05] tracking-tight"
                >
                    We Engineer Attention.
                    <br />
                    We Build Authority.
                </h1>

                <p
                    ref={subRef}
                    className="mt-10 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
                >
                    Branding, content, performance marketing and AI-driven growth —
                    built for modern brands that want dominance.
                </p>
            </div>
        </section>

    )
}