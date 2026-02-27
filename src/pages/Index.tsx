import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import AuthorityStrip from "@/components/home/AuthorityStrip";
import Services from "@/components/home/Services";
import Countries from "@/components/home/Countries";
import Journey from "@/components/home/Journey";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AuthorityStrip />
        <Services />
        <Countries />
        <Journey />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
