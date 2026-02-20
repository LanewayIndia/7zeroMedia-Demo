"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const navRef = useRef<HTMLElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const LinksRef = useRef<HTMLDivElement>(null)        // outer nav links wrapper
    const linkItemsRef = useRef<HTMLDivElement>(null)    // inner div — direct parent of each <Link>
    const buttonRef = useRef<HTMLDivElement>(null)
    const hamburgerRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const context = gsap.context(() => {
            // Entire nav bar drops in from above on page load
            gsap.from(navRef.current, {
                y: -60,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out"
            })

            //logo slides in from the left 
            gsap.from(logoRef.current, {
                x: -60,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            })

            //Nav Links — each link staggers in individually from below
            if (window.innerWidth >= 768) {
                gsap.from(linkItemsRef.current!.children, {
                    y: -24,
                    opacity: 0,
                    duration: 0.7,
                    stagger: {
                        each: 0.1,        // 100 ms gap between each link
                        ease: "power1.in" // accelerate the stagger timing
                    },
                    ease: "back.out(1.4)",
                    delay: 0.35
                })
            }

            //button slides in from the right
            gsap.from(buttonRef.current, {
                x: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.35
            })

            // Mobile hamburger fades + scales in
            gsap.from(hamburgerRef.current, {
                opacity: 0,
                scale: 0.75,
                duration: 0.6,
                delay: 0.4,
                ease: "back.out(1.7)"
            })

            //Navbar change style on scroll
            const navElement = document.querySelector("nav")
            gsap.to(navElement, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "100ps top",
                    scrub: true
                },
                paddingTop: "8px",
                paddingBottom: "8px",
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                boxShadow: "0 4px 24px -1px rgba(17, 17, 17, 0.08), 0 0 0 1px rgba(249,115,22,0.08)"
            })
        })

        return () => context.revert() //cleanup on unmount
    }, [])

    return (
        <div>
            <nav ref={navRef} className="flex items-center px-4 md:px-10 bg-white/80 backdrop-blur-md">
                <div ref={logoRef} className="flex items-center justify-start md:px-10">
                    <Image src="/logo.png" alt="Logo" width={100} height={100} className="rounded-full" />
                </div>

                {/* Hamburger Menu for Mobile only */}
                <Button ref={hamburgerRef} className="md:hidden ml-auto p-2 text-[#111111]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? (
                        // x icon when menu is open 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        //Hamburger icon when menu is closed
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )
                    }

                </Button>

                <div ref={LinksRef} className="hidden md:flex items-center mx-auto my-auto justify-center gap-10">
                    <div ref={linkItemsRef} className="flex gap-10">
                        <Link href="/" className="font-normal text-[#111111] hover:text-[#F97316] transition-colors duration-200">Home</Link>
                        <Link href="/about" className="font-normal text-[#111111] hover:text-[#F97316] transition-colors duration-200">About</Link>
                        <Link href="/services" className="font-normal text-[#111111] hover:text-[#F97316] transition-colors duration-200">Services</Link>
                        {/* <Link href="#our-work">Our Work</Link> */}
                        {/* <Link href="#blog">Blog</Link> */}
                        <Link href="/careers" className="font-normal text-[#111111] hover:text-[#F97316] transition-colors duration-200">Careers</Link>
                        <Link href="/contact" className="font-normal text-[#111111] hover:text-[#F97316] transition-colors duration-200">Contact</Link>
                    </div>
                </div>
                <div ref={buttonRef} className="hidden md:flex gap-2 items-center justify-start">
                    <Button className="bg-[#F97316] text-white hover:bg-[#ea6c0a] border-none"><Link href="/auth/sign-up" className="font-normal text-white">Sign-up</Link></Button>
                    <Button className="bg-[#111111] text-white hover:bg-[#2a2a2a] border-none"><Link href="/auth/sign-in" className="font-normal text-white">Sign-in</Link></Button>
                </div>
            </nav>
            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-start gap-4 px-6 py-4 bg-[#F8F8F8] border-t border-[#111111]/10 text-[#111111]">
                    <Link href="#" onClick={() => setMenuOpen(false)} className="text-[#111111] hover:text-[#F97316] transition-colors">Home</Link>
                    <Link href="#about" onClick={() => setMenuOpen(false)} className="text-[#111111] hover:text-[#F97316] transition-colors">About</Link>
                    <Link href="#services" onClick={() => setMenuOpen(false)} className="text-[#111111] hover:text-[#F97316] transition-colors">Services</Link>
                    {/* <Link href="#our-work" onClick={() => setMenuOpen(false)}>Our Work</Link> */}
                    {/* <Link href="#blog" onClick={() => setMenuOpen(false)}>Blog</Link> */}
                    <Link href="#careers" onClick={() => setMenuOpen(false)} className="text-[#111111] hover:text-[#F97316] transition-colors">Careers</Link>
                    <Link href="#contact" onClick={() => setMenuOpen(false)} className="text-[#111111] hover:text-[#F97316] transition-colors">Contact</Link>

                    <div className="flex gap-2 pt-2">
                        <Button className="bg-[#F97316] text-white hover:bg-[#ea6c0a] border-none"><Link href="/auth/sign-up" className="text-white">Sign-up</Link></Button>
                        <Button className="bg-[#111111] text-white hover:bg-[#2a2a2a] border-none"><Link href="/auth/sign-in" className="text-white">Sign-in</Link></Button>
                    </div>
                </div>
            )}
        </div>
    )
}