"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    )
  }, [pathname])

  return <div ref={wrapperRef}>{children}</div>
}