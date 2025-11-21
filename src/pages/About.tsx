import { Shield, Target, TrendingUp, Users, CheckCircle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJsonData } from "@/hooks/useJsonData";
import { AboutData } from "@/types/about";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const About = () => {
  const { data, isLoading, error } = useJsonData<AboutData>('about.json');
  useLanguage(); // Auto-translates page
  useGTranslateRefresh(!isLoading && !!data, [data]);

  if (isLoading) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="About AmplifiX - AI-Powered Corporate Communications" />
      <MainHeader />
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-highlight-blue">AmplifiX</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Empowering companies with AI-driven corporate communications and investor relations solutions
              that amplify your message and accelerate growth.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const missionIcons = [Target, Users, Award];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {data.about.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.about.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <LanguageAwareLink to="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.about.hero.cta_primary}
              </Button>
            </LanguageAwareLink>
            <a 
              href="https://calendly.com/amplifix/amplifix-discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.about.hero.cta_secondary}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="container mx-auto py-12 md:py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {data.about.mission.cards.map((card, index) => {
              const IconComponent = missionIcons[index];
              return (
                <div key={index} className="bg-card p-6 md:p-8 rounded-xl border border-border text-center">
                  <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-4">{card.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{data.about.features.title}</h2>
          
          <div className="space-y-6">
            {data.about.features.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-highlight-blue mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base md:text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
