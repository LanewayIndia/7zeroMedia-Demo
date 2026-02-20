"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useRef, useEffect, } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    // { name: "Our Work", href: "/our-work" },
    // { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
]

const services = [
    { name: "Marketing", href: "/services/marketing" },
    { name: "Branding", href: "/services/branding" },
    { name: "Content Creation", href: "/services/content-creation" },
    { name: "Filming", href: "/services/filming" },
]

const socialLinks = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/7zero.media?igsh=MTh0cDNjNmE0eTU1Yg==",
        // icon: Instagram,
    },
    {
        name: "Linkedin",
        href: "https://www.linkedin.com/company/7zeromedia/",
        // icon: Linkedin,
    },
    {
        name: "Website",
        href: "https://www.7zero.media",
        // icon: Globe,
    },
]

export default function Footer() {

    const footerRef = useRef<HTMLElement>(null)

    const brandRef = useRef<HTMLDivElement>(null)
    const quickLinksRef = useRef<HTMLDivElement>(null)
    const servicesRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLDivElement>(null)
    const bottomBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const context = gsap.context(() => {
            //All columns fade + slide up on scroll
            const column = [brandRef.current, quickLinksRef.current, servicesRef.current, contactRef.current]

            gsap.from(column, {
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.15,
                ease: "power3.out",
            })

            //Bottom bar slides up last
            gsap.from(bottomBarRef.current, {
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 75%"
                },
                y: 20,
                opacity: 0,
                duration: 0.7,
                delay: 0.6,
                ease: "power2.out"
            })
        }, footerRef)

        return () => context.revert() //cleanup on unmount
    }, [])

    return (
        <footer ref={footerRef} className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm px-6 md:px-12 lg:px-20 py-16">
            {/* Top glow accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-yellow-400/40 to-transparent" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                {/* Brand column */}
                <div ref={brandRef} className="sm:col-span-2 lg:col-span-1">
                    <Link href="/" className="inline-block mb-5">
                        <span className="flex items-center gap-3 font-bold text-2xl text-white">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={100}
                                height={100}
                                className="w-auto h-10 rounded-full"
                                priority
                            />
                            7ZeroMedia
                        </span>
                    </Link>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                        AI-Powered Media & Marketing. We help brands grow with cinematic content, data-driven strategy, and creative excellence.
                    </p>
                    <Link href="/contact" className="group inline-flex items-center gap-1.5 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                        <span>
                            Let's Connect
                            <ArrowUpRight
                                size={14}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </span>
                    </Link>

                    {/* Social Icons — nested inside brand column */}
                    <div className="flex gap-3 mt-6">
                        {socialLinks.map((socialMedia) => (
                            <a key={socialMedia.name} href={socialMedia.href} target="_blank" rel="noopener noreferrer"
                                className="text-xs border border-white/20 text-white/60 hover:text-white hover:border-white/60 px-3 py-1.5 rounded-full transition-all duration-300">
                                {socialMedia.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links column */}
                <div ref={quickLinksRef}>
                    <h3 className="text-xs tracking-widest uppercase text-white/40 mb-5">Quick Links</h3>
                    <ul className="space-y-3">
                        {quickLinks.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-300 hover:pl-1">
                                    {link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Services column */}
                <div ref={servicesRef}>
                    <h3 className="text-xs tracking-widest uppercase text-white/40 mb-5">Services</h3>
                    <ul className="space-y-3">
                        {services.map((service) => (
                            <li key={service.name}>
                                <Link href={service.href}
                                    className="text-white/60 hover:text-white text-sm transition-colors duration-300 hover:pl-1">
                                    {service.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div ref={contactRef}>
                    <h3 className="text-xs tracking-widest uppercase text-white/40 mb-5">Contact Info</h3>
                    <ul className="space-y-4 text-sm text-white/60">
                        <li className="flex items-start gap-2">
                            <span>📍</span>
                            <span>Head Office <br />
                                1087 B, Sankranthi, Perumbaikkad <br />

                                Kottayam - 686016, Kerala</span>
                            <br />
                            <span>📍</span>
                            <span>Operational Office <br />
                                Koramangala 8th Blockd <br />

                                Bangalore - 560095, Karnataka</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>📧</span>
                            <a href="mailto:hello@7zero.media" className="hover:text-white transition-colors">
                                info@laneway.in
                            </a>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>📞</span>
                            <a href="tel:+1234567890" className="hover:text-white transition-colors">
                               +91 9961348942
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Bottom Bar */}
                <div ref={bottomBarRef} className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
                    <p>© {new Date().getFullYear()} 7ZeroMedia. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
                    </div>

                </div>
            </div>
        </footer>
    )
}