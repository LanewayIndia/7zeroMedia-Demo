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

    const logoRef = useRef<HTMLDivElement>(null)
    const LinksRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const context = gsap.context(() => {
            //logo slides in from the left 
            gsap.from(logoRef.current, {
                x: -60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })

            //Nav Links stagger in from the top
            if (window.innerWidth >= 768) { 
            gsap.from(LinksRef.current!.children, {
                y: -20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3
            })
        }

            //button slides in from the right
            gsap.from(buttonRef.current, {
            x: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
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
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
        })
    })

    return () => context.revert() //cleanup on unmount
}, [])

return (
    <div>
        <nav className="flex items-center px-4 md:px-10">
            <div ref={logoRef} className="flex items-center justify-start md:px-10">
                <Image src="/logo.png" alt="Logo" width={100} height={100} className="rounded-full" />
            </div>

            {/* Hamburger Menu for Mobile only */}
            <Button className="md:hidden ml-auto p-2 text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
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
                <Link href="#">Home</Link>
                <Link href="#about">About</Link>
                <Link href="#services">Services</Link>
                {/* <Link href="#our-work">Our Work</Link> */}
                {/* <Link href="#blog">Blog</Link> */}
                <Link href="#careers">Careers</Link>
                <Link href="#contact">Contact</Link>
            </div>
            <div ref={buttonRef} className="hidden md:flex gap-2 items-center justify-start">
                <Button><Link href="/auth/sign-up">Sign-up</Link></Button>
                <Button><Link href="/auth/sign-in">Sign-in</Link></Button>
            </div>
        </nav>
        {/* Mobile Menu */}
        {menuOpen && (
            <div className="md:hidden flex flex-col items-start gap-4 px-6 py-4 bg-black/80 backdrop-blur-md text-white">
                <Link href="#" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link href="#about" onClick={() => setMenuOpen(false)}>About</Link>
                <Link href="#services" onClick={() => setMenuOpen(false)}>Services</Link>
                {/* <Link href="#our-work" onClick={() => setMenuOpen(false)}>Our Work</Link> */}
                {/* <Link href="#blog" onClick={() => setMenuOpen(false)}>Blog</Link> */}
                <Link href="#careers" onClick={() => setMenuOpen(false)}>Careers</Link>
                <Link href="#contact" onClick={() => setMenuOpen(false)}>Contact</Link>

                <div className="flex gap-2 pt-2">
                    <Button><Link href="/auth/sign-up">Sign-up</Link></Button>
                    <Button><Link href="/auth/sign-in">Sign-in</Link></Button>
                </div>
            </div>
        )}
    </div>
)
}