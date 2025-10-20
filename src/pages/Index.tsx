import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowCalculatorWorks from "@/components/HowCalculatorWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import ServicesWeOffer from "@/components/ServicesWeOffer";
import ReadyToShip from "@/components/ReadyToShip";
import Testimonials from "@/components/Testimonials";
import GetInTouch from "@/components/GetInTouch";
import HaveQuestions from "@/components/HaveQuestions";
import ShippingCoverageMap from "@/components/ShippingCoverageMap";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[104px]">
        <HeroSection />
        <HowCalculatorWorks />
        <WhyChooseUs />
        <ServicesWeOffer />
        <ReadyToShip />
        <Testimonials />
        <GetInTouch />
        <HaveQuestions />
        <ShippingCoverageMap />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
