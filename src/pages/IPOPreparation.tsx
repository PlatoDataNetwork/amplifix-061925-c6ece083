import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Shield, Users, Clock, TrendingUp } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";

interface IPOPreparationData {
  ipo_preparation: {
    hero: {
      title: string;
      title_highlight: string;
      description: string;
      cta_button_text: string;
      cta_button_link: string;
    };
    ipo_process: {
      title: string;
      features: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
    };
    checklist: {
      title: string;
      sections: Array<{
        section_title: string;
        items: string[];
      }>;
    };
  };
}

const IPOPreparation = () => {
  const { data, isLoading, error } = useJsonData<IPOPreparationData>('ipo-preparation.json');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
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
          <p className="text-destructive">Failed to load content</p>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-highlight-blue">{data.ipo_preparation.hero.title_highlight}</span> {data.ipo_preparation.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.ipo_preparation.hero.description}
          </p>
          <a 
            href={data.ipo_preparation.hero.cta_button_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              {data.ipo_preparation.hero.cta_button_text}
            </Button>
          </a>
        </div>
      </div>

      {/* IPO Process */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{data.ipo_preparation.ipo_process.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.ipo_preparation.ipo_process.features.map((feature, index) => {
            const getIconComponent = (iconName: string) => {
              const icons: Record<string, any> = {
                FileText, Shield, Users, Clock, TrendingUp, CheckCircle
              };
              return icons[iconName] || FileText;
            };
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

      {/* IPO Checklist */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{data.ipo_preparation.checklist.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.ipo_preparation.checklist.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <h3 className="text-xl font-bold mb-4">{section.section_title}</h3>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-4">
                      <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
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

export default IPOPreparation;
