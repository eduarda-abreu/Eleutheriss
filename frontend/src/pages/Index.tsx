import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ImportanceSection from "@/components/ImportanceSection";
import StatsSection from "@/components/StatsSection";
import EducationSection from "@/components/EducationSection";
import CTASection from "@/components/CTASection";
import ValidationFormSection from "@/components/ValidationFormSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ImportanceSection />
      <StatsSection />
      <EducationSection />
      <CTASection />
      <ValidationFormSection />
      <Footer />
    </div>
  );
};

export default Index;
