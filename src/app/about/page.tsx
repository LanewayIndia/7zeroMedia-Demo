// src/app/about/page.tsx
import Navbar from "@/components/navbar/Navbar"
import About from "@/components/about/About"
import Footer from "@/components/footer/footer"
export default function AboutPage() {
    return (
        <div>
            <Navbar />
            <main><About /></main>
            <Footer />
        </div>
    )
}