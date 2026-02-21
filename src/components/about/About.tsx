"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

export default function About() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      }
    )
  }, [])

  return (
    <section id="about" ref={ref} className="min-h-screen flex items-center justify-center">
      <h2 className="text-5xl font-bold">About 7ZeroMedia</h2>
    </section>
  )
}