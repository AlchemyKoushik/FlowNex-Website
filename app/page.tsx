import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Transformation from "@/components/Transformation";
import Method from "@/components/Method";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full text-flownex-white overflow-x-clip bg-transparent">
      <Header />
      <Hero />
      <Solutions />
      <Transformation />
      <Method />
      <Showcase />
      <Footer />
    </main>
  );
}
