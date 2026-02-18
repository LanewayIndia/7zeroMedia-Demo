"use client"

import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="flex items-center px-10">
            <div className="flex items-center justify-start px-10">
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </div>
            <div className="flex items-center mx-auto my-auto justify-center gap-10 ">
                <Link href="#">Home</Link>
                <Link href="#about">About</Link>
                <Link href="#services">Services</Link>
                <Link href="#our-work">Our Work</Link>
                <Link href="#blog">Blog</Link>
                <Link href="#careers">Careers</Link>
                <Link href="#contact">Contact</Link>
            </div>
        </nav>
    )
}