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


      {/* CTA Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-transparent border-2 border-highlight-blue rounded-2xl p-8 md:p-12 text-center">
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
