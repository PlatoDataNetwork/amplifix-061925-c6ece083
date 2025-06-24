
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlatformPreview from "@/components/PlatformPreview";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import SolutionsSection from "@/components/SolutionsSection";
import StatsSection from "@/components/StatsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <HeroSection />
      <PlatformPreview />
      <AboutSection />
      <FeaturesSection />
      <SolutionsSection />
      <StatsSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
