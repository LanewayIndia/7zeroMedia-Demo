import Navbar from "@/components/navbar/Navbar";
import Home from "@/components/home/Home";
import About from "@/components/about/About";
import Service from "@/components/services/Services";
import Footer from "@/components/footer/footer";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="services"><Service /></section>
      </main>
      <Footer />
    </div>
  );
}
