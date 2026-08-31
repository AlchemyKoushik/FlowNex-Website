import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Transformation from "@/components/Transformation";
import Method from "@/components/Method";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-flownex-black text-flownex-white overflow-x-clip">
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
