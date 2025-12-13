import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, FileText, BarChart3, Shield, Target, Search } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

interface ResearchData {
  research: {
    hero: {
      title: string;
      title_highlight: string;
      description: string;
      cta_button: string;
    };
    key_features: {
      title: string;
      features: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
    };
    benefits: {
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
  };
}

const Research = () => {
  const { data, isLoading, error } = useJsonData<ResearchData>('research.json');
  const { t } = useTranslation('common');
  useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
            <Skeleton className="h-10 w-40 mx-auto" />
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
        <div className="pt-24 container mx-auto py-20 px-4 text-center">
          <p className="text-destructive">{t('ui.error')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText, TrendingUp, BarChart3, Shield, CheckCircle, Target, Search
    };
    return icons[iconName] || FileText;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 pb-2 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
            {data.research.hero.title} {data.research.hero.title_highlight}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.research.hero.description}
          </p>
          <a 
            href="https://calendly.com/amplifix/amplifix-discovery"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              {data.research.hero.cta_button}
            </Button>
          </a>
        </div>
      </div>

      {/* Key Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{data.research.key_features.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.research.key_features.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            
            return (
              <div key={index} className="bg-card p-6 rounded-xl border border-border">
                <IconComponent className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{data.research.benefits.title}</h2>
          
          <div className="space-y-6">
            {data.research.benefits.items.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
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

export default Research;
