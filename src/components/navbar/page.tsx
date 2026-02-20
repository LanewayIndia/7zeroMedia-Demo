"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
export default function Navbar() {

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
            gsap.from(LinksRef.current!.children, {
                y: -20, 
                opacity: 0, 
                duration: 0.8, 
                stagger: 0.1, 
                ease: "power2.out",
                delay: 0.3
            })

            //button slides in from the right
            gsap.from(buttonRef.current, {
                x:60,
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
        <nav className="flex items-center px-10">
            <div ref={logoRef} className="flex items-center justify-start px-10">
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </div>
            <div ref={LinksRef} className="flex items-center mx-auto my-auto justify-center gap-10 ">
                <Link href="#">Home</Link>
                <Link href="#about">About</Link>
                <Link href="#services">Services</Link>
                <Link href="#our-work">Our Work</Link>
                <Link href="#blog">Blog</Link>
                <Link href="#careers">Careers</Link>
                <Link href="#contact">Contact</Link>
            </div>
            <div ref={buttonRef} className="flex gap-2 items-center justify-start">
                <Button><Link href="/auth/sign-up">Sign-up</Link></Button>
                <Button><Link href="/auth/sign-in">Sign-in</Link></Button>
            </div>
        </nav>
    )
}