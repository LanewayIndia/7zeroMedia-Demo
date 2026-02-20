// src/app/about/page.tsx
import Navbar from "@/components/navbar/Navbar"
import Careers from "@/components/careers/Careers"
import Footer from "@/components/footer/footer"
export default function CareersPage() {
    return (
        <div>
            <Navbar />
            <main><Careers /></main>
            <Footer />
        </div>
    )
}