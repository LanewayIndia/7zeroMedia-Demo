import Navbar from "@/components/navbar/Navbar";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/footer";

export const metadata = {
    title: "Contact | 7ZeroMedia",
    description: "Get in touch with 7ZeroMedia — AI-Powered Media & Marketing.",
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
