import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Rocket, 
  Shield 
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
  useLanguage();

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Globe, Sparkles, TrendingUp, BarChart3, Rocket, Shield, CheckCircle
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
      <div className="pt-24 container mx-auto py-20 px-4">
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

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {data.about.stats.map((stat, index) => (
              <div key={index} className="py-8 md:py-12 text-center">
                <div className="text-3xl md:text-4xl font-bold text-highlight-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">{data.about.who_we_are.title}</h2>
          <div className="space-y-6">
            {data.about.who_we_are.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed text-center">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <h2 className="text-3xl font-bold text-center mb-12">{data.about.what_we_do.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.about.what_we_do.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            
            return (
              <div key={index} className="bg-card p-6 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300">
                <IconComponent className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why AmplifiX */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{data.about.why_amplifix.title}</h2>
          
          <div className="space-y-6">
            {data.about.why_amplifix.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-highlight-blue mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto bg-highlight-blue rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Amplifi Your Strategy?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join the companies transforming their communications with AmplifiX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LanguageAwareLink to="/contact">
              <Button 
                size="lg"
                className="bg-white text-highlight-blue hover:bg-white/90 px-8 py-4 text-lg rounded-lg font-semibold"
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
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-lg"
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
