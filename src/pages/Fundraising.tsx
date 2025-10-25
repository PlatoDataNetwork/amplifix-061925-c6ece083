import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Target, DollarSign, Users, BarChart3, Lightbulb } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";

interface FundraisingData {
  fundraising: {
    hero: {
      title: string;
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
    process: {
      title: string;
      steps: Array<{
        step: number;
        title: string;
        description: string;
      }>;
    };
  };
}

const Fundraising = () => {
  const { data, isLoading, error } = useJsonData<FundraisingData>('fundraising.json');

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
            {data.fundraising.hero.title.split('Fundraising')[0]}
            <span className="text-highlight-blue">Fundraising</span>
            {data.fundraising.hero.title.split('Fundraising')[1]}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.fundraising.hero.description}
          </p>
          <a 
            href="https://calendly.com/amplifix/amplifix-discovery"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              {data.fundraising.hero.cta_button}
            </Button>
          </a>
        </div>
      </div>

      {/* Key Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{data.fundraising.key_features.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.fundraising.key_features.features.map((feature, index) => {
            const getIconComponent = (iconName: string) => {
              const icons: Record<string, any> = {
                Target, DollarSign, Users, BarChart3, Lightbulb, CheckCircle
              };
              return icons[iconName] || Target;
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

      {/* Fundraising Process */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{data.fundraising.process.title}</h2>
          
          <div className="space-y-8">
            {data.fundraising.process.steps.map((step) => (
              <div key={step.step} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-highlight-blue text-white flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
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

export default Fundraising;
