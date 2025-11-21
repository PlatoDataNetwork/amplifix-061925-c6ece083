import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Building, Users, Rocket, TrendingUp, LucideIcon } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { useJsonData } from "@/hooks/useJsonData";

interface SolutionsData {
  solutions: {
    hero: {
      title: string;
      title_highlight: string;
      description: string;
      cta_primary_text: string;
      cta_primary_link: string;
      cta_secondary_text: string;
      cta_secondary_link: string;
    };
    solutions_list: Array<{
      title: string;
      description: string;
      link_text: string;
      link: string;
      icon: string;
    }>;
  };
}

const iconMap: Record<string, LucideIcon> = {
  Building,
  Users,
  TrendingUp,
  Rocket,
};

const Solutions = () => {
  const { data: solutionsData } = useJsonData<SolutionsData>('/data/solutions.json');
  useLanguage();
  
  const solutionsList = solutionsData?.solutions.solutions_list || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Solutions - AmplifiX Corporate Communications Platform" />
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {solutionsData?.solutions.hero.title || 'Solutions for'} <span className="text-highlight-blue">{solutionsData?.solutions.hero.title_highlight || 'Every Stage'}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {solutionsData?.solutions.hero.description || 'Comprehensive corporate communications solutions'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <LanguageAwareLink to={solutionsData?.solutions.hero.cta_primary_link || '/contact'} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {solutionsData?.solutions.hero.cta_primary_text || 'Get Started'}
              </Button>
            </LanguageAwareLink>
            <a 
              href={solutionsData?.solutions.hero.cta_secondary_link || 'https://calendly.com/amplifix/amplifix-discovery'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {solutionsData?.solutions.hero.cta_secondary_text || 'Book a Demo'}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {solutionsList.map((solution, index) => {
            const IconComponent = iconMap[solution.icon];
            return (
              <LanguageAwareLink key={index} to={solution.link} className="group">
                <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full">
                  {IconComponent && <IconComponent className="h-12 w-12 text-highlight-blue mb-4" />}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-highlight-blue transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {solution.description}
                  </p>
                  <div className="flex items-center text-highlight-blue font-medium">
                    {solution.link_text}
                  </div>
                </div>
              </LanguageAwareLink>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
