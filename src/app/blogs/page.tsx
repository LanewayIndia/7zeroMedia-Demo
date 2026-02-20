// src/app/about/page.tsx
import Navbar from "@/components/navbar/Navbar"
import Blogs from "@/components/blogs/Blogs"
import Footer from "@/components/footer/footer"
export default function CareersPage() {
    return (
        <div>
            <Navbar />
            <main><Blogs /></main>
            <Footer />
        </div>
    )
}