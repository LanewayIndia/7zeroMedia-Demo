// src/app/about/page.tsx
import Navbar from "@/components/navbar/Navbar"
import Service from "@/components/services/Services"
import Footer from "@/components/footer/footer"
export default function ServicePage() {
    return (
        <div>
            <Navbar />
            <main><Service /></main>
            <Footer />
        </div>
    )
}