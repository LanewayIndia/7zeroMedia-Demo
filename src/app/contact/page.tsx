// src/app/contact/page.tsx
import type { Metadata } from "next"
import Navbar from "@/components/navbar/Navbar"
import Contact from "@/components/contact/Contact"
import Footer from "@/components/footer/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.7zero.media"

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with 7ZeroMedia — our team is based in Bangalore and Kottayam, Kerala. Reach us at info@7zero.media or call +91 9961348942. Start your growth system today.",
    alternates: {
        canonical: `${BASE_URL}/contact`,
    },
    openGraph: {
        title: "Contact 7ZeroMedia — Let's Build Your Growth System",
        description:
            "Ready to grow? Contact the 7ZeroMedia team in Bangalore and Kerala, India. Email info@7zero.media or use the contact form.",
        url: `${BASE_URL}/contact`,
        type: "website",
    },
}

export default function ContactPage() {
    return (
        <div>
            <Navbar />
            <main>
                <Contact />
            </main>
            <Footer />
        </div>
    )
}
