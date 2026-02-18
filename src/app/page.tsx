import Navbar from "@/components/navbar/page";
import Home from "@/components/home/page";
import Contact from "@/components/contact/page";
import OurWork from "@/components/our-work/page";
import Service from "@/components/service/page";
import Careers from "@/components/careers/page";
import Blogs from "@/components/blogs/page";
import About from "@/components/about/page";
import Footer from "@/components/footer/footer";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <Home />
        <About />
        <Service />
        <OurWork />
        <Blogs />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
