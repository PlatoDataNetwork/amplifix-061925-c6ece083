import { 
  Target, 
  Users, 
  Award, 
  Zap, 
  Globe, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  FileCheck,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/hooks/useLanguage";
import { useJsonData } from "@/hooks/useJsonData";

interface AboutData {
  about: {
    hero: { 
      title: string; 
      subtitle: string;
      description: string; 
      cta_primary: string; 
      cta_secondary: string 
    };
    story: {
      title: string;
      paragraphs: string[];
    };
    philosophy: {
      title: string;
      tagline: string;
      description: string;
      principles: Array<{ title: string; description: string }>;
    };
    capabilities: {
      title: string;
      subtitle: string;
      items: Array<{ title: string; description: string }>;
    };
    stats: Array<{ value: string; label: string }>;
    vision: {
      title: string;
      description: string;
      closing: string;
    };
    cta: {
      title: string;
      description: string;
      primary_button: string;
      secondary_button: string;
    };
  };
}

const capabilityIcons = [Sparkles, Globe, Users, BarChart3, TrendingUp, Shield];

const About = () => {
  const { data: aboutData } = useJsonData<AboutData>('/data/about.json');
  useLanguage();

  const stats = aboutData?.about.stats || [];
  const capabilities = aboutData?.about.capabilities.items || [];
  const principles = aboutData?.about.philosophy.principles || [];
  const storyParagraphs = aboutData?.about.story.paragraphs || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title="About AmplifiX | AI-Powered Corporate Communications"
        description="Discover how AmplifiX is transforming corporate communications with AI-driven insights, global syndication, and intelligent stakeholder engagement."
      />
      <MainHeader />
      
      {/* Hero Section - Bold Statement */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-highlight-blue/5 via-transparent to-highlight-blue/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-highlight-blue/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-highlight-blue/10 text-highlight-blue text-sm font-medium rounded-full mb-6">
              {aboutData?.about.hero.subtitle || 'The Future of Corporate Intelligence'}
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-highlight-blue bg-clip-text text-transparent">
                {aboutData?.about.hero.title || "We're Redefining How Companies Communicate"}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {aboutData?.about.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LanguageAwareLink to="/contact">
                <Button 
                  size="lg" 
                  className="bg-highlight-blue text-white hover:bg-highlight-blue/90 px-8 py-6 text-lg rounded-xl group"
                >
                  {aboutData?.about.hero.cta_primary || 'Start Your Journey'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                  className="border-border hover:bg-accent px-8 py-6 text-lg rounded-xl"
                >
                  {aboutData?.about.hero.cta_secondary || 'Book a Demo'}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat, index) => (
              <div key={index} className="py-8 md:py-12 text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-highlight-blue mb-2">
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

      {/* Our Story */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {aboutData?.about.story.title || 'Our Story'}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index} className={index === 1 ? "text-xl md:text-2xl font-medium text-foreground text-center py-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-highlight-blue font-semibold tracking-wider uppercase text-sm">
                {aboutData?.about.philosophy.tagline || 'Intelligence Amplified'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                {aboutData?.about.philosophy.title || 'Our Philosophy'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {aboutData?.about.philosophy.description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {principles.map((principle, index) => (
                <Card 
                  key={index} 
                  className="p-8 bg-card border-border hover:border-highlight-blue/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-highlight-blue/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-highlight-blue/20 transition-colors">
                    <span className="text-2xl font-bold text-highlight-blue">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {aboutData?.about.capabilities.title || 'What We Do'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {aboutData?.about.capabilities.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {capabilities.map((capability, index) => {
              const IconComponent = capabilityIcons[index % capabilityIcons.length];
              return (
                <div 
                  key={index}
                  className="group p-6 rounded-2xl border border-border bg-card hover:bg-card/80 hover:border-highlight-blue/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-highlight-blue/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-highlight-blue group-hover:text-white transition-all">
                    <IconComponent className="h-6 w-6 text-highlight-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{capability.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-highlight-blue/10 via-background to-highlight-blue/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {aboutData?.about.vision.title || 'The Vision'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              {aboutData?.about.vision.description}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-highlight-blue">
              {aboutData?.about.vision.closing}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-r from-highlight-blue to-highlight-blue/80 border-0 text-white text-center rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {aboutData?.about.cta.title || 'Ready to Amplifi Your Strategy?'}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              {aboutData?.about.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LanguageAwareLink to="/contact">
                <Button 
                  size="lg"
                  className="bg-white text-highlight-blue hover:bg-white/90 px-8 py-6 text-lg rounded-xl font-semibold"
                >
                  {aboutData?.about.cta.primary_button || 'Get Started'}
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
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                >
                  {aboutData?.about.cta.secondary_button || 'Schedule a Demo'}
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
