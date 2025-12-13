import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Rocket, 
  Shield,
  ShieldAlert,
  AlertTriangle,
  Bot,
  Activity,
  MessageCircle,
  UserCheck,
  ArrowRight
} from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";

interface AboutData {
  about: {
    hero: {
      title: string;
      description: string;
      cta_primary: string;
      cta_secondary: string;
    };
    who_we_are: {
      title: string;
      paragraphs: string[];
    };
    what_we_do: {
      title: string;
      features: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
    };
    process: {
      title: string;
      subtitle: string;
      description: string;
      capabilities: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
      steps: Array<{
        title: string;
        description: string;
      }>;
    };
    why_amplifix: {
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
}

const About = () => {
  const { data, isLoading, error } = useJsonData<AboutData>('about.json');
  const location = useLocation();
  useLanguage();

  // Handle hash navigation for Process section
  useEffect(() => {
    if (location.hash === '#process') {
      setTimeout(() => {
        const element = document.getElementById('process');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Globe, Sparkles, TrendingUp, BarChart3, Rocket, Shield,
      ShieldAlert, AlertTriangle, Bot, Activity, MessageCircle, UserCheck
    };
    return icons[iconName] || Globe;
  };

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
          <p className="text-destructive">Error loading content</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title="About AmplifiX | AI-Powered Corporate Communications"
        description="AmplifiX is a global press release and content syndication network. AI-powered intelligence for investor relations and corporate communications."
      />
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-12 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 pb-2 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
            {data.about.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.about.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LanguageAwareLink to="/contact">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
              >
                {data.about.hero.cta_primary}
              </Button>
            </LanguageAwareLink>
            <a 
              href="https://calendly.com/amplifix/amplifix-discovery"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
              >
                {data.about.hero.cta_secondary}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <section id="process" className="container mx-auto py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{data.about.process.title}</h2>
            <p className="text-xl text-highlight-blue font-medium mb-4">{data.about.process.subtitle}</p>
            <p className="text-muted-foreground max-w-3xl mx-auto">{data.about.process.description}</p>
          </div>

          {/* AI Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.about.process.capabilities.map((capability, index) => {
              const IconComponent = getIconComponent(capability.icon);
              return (
                <div 
                  key={index} 
                  className="p-5 rounded-xl border border-border bg-card hover:border-highlight-blue/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-highlight-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-highlight-blue/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-highlight-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{capability.title}</h3>
                      <p className="text-sm text-muted-foreground">{capability.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Process Steps */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {data.about.process.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                </div>
                {index < data.about.process.steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-highlight-blue hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.about.what_we_do.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            return (
              <div 
                key={index} 
                className="p-6 rounded-xl border border-border bg-card/50 hover:border-highlight-blue/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-highlight-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-highlight-blue/20 transition-colors">
                  <IconComponent className="h-6 w-6 text-highlight-blue" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Amplifi Your Strategy?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the companies transforming their communications with AmplifiX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LanguageAwareLink to="/contact">
              <Button 
                size="lg"
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 px-8 py-4 text-lg rounded-lg font-semibold"
              >
                Get Started
              </Button>
            </LanguageAwareLink>
            <a 
              href="https://calendly.com/amplifix/amplifix-discovery"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                variant="outline"
                className="border-highlight-blue text-highlight-blue hover:bg-highlight-blue/10 px-8 py-4 text-lg rounded-lg"
              >
                Book a Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
