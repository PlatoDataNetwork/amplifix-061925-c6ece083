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

  // Handle hash navigation for Process, Mission, and Methodology sections
  useEffect(() => {
    if (location.hash === '#process' || location.hash === '#mission' || location.hash === '#methodology') {
      setTimeout(() => {
        const element = document.getElementById(location.hash.replace('#', ''));
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

  if (error || !data || !data.about) {
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

  // Safely extract data with defaults for incomplete translations
  const about = data.about;
  const hero = about.hero || { title: 'About AmplifiX', description: '', cta_primary: 'Get Started', cta_secondary: 'Book a Demo' };
  const process = about.process || { title: '', subtitle: '', description: '', steps: [], capabilities: [] };
  const whatWeDo = about.what_we_do || { title: '', features: [] };

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
            {hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LanguageAwareLink to="/contact">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
              >
                {hero.cta_primary}
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
                {hero.cta_secondary}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section id="mission" className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8">
            To revolutionize corporate communications through AI-driven intelligence, empowering companies of all sizes to communicate with precision, authenticity, and global reach.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="w-12 h-12 bg-highlight-blue/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe className="h-6 w-6 text-highlight-blue" />
              </div>
              <h3 className="font-bold mb-2">Global Impact</h3>
              <p className="text-sm text-muted-foreground">Connecting companies with audiences across 35 languages and 2,000+ publications worldwide.</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="w-12 h-12 bg-highlight-blue/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-highlight-blue" />
              </div>
              <h3 className="font-bold mb-2">AI Innovation</h3>
              <p className="text-sm text-muted-foreground">Leveraging cutting-edge artificial intelligence to transform how stories are told and received.</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="w-12 h-12 bg-highlight-blue/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-highlight-blue" />
              </div>
              <h3 className="font-bold mb-2">Trust & Integrity</h3>
              <p className="text-sm text-muted-foreground">Building transparent, compliant communications that protect and enhance brand reputation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="container mx-auto py-16 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6">Our Methodology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A systematic, data-driven approach to corporate communications that combines AI intelligence with human expertise for maximum impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
                <h3 className="text-xl font-bold">Discovery & Analysis</h3>
              </div>
              <p className="text-muted-foreground">We begin by analyzing your company's current positioning, target audience, and competitive landscape using our proprietary AI tools to identify opportunities and gaps in your communication strategy.</p>
            </div>
            
            <div className="p-8 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
                <h3 className="text-xl font-bold">Strategy Development</h3>
              </div>
              <p className="text-muted-foreground">Based on insights gathered, we craft a tailored communication strategy that aligns with your business goals, incorporating sentiment analysis, market trends, and audience behavior patterns.</p>
            </div>
            
            <div className="p-8 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
                <h3 className="text-xl font-bold">Content Creation & Optimization</h3>
              </div>
              <p className="text-muted-foreground">Our AI-assisted content creation ensures messaging resonates across all channels while maintaining compliance and brand consistency. Each piece is optimized for maximum engagement and reach.</p>
            </div>
            
            <div className="p-8 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg">4</div>
                <h3 className="text-xl font-bold">Distribution & Amplification</h3>
              </div>
              <p className="text-muted-foreground">We leverage our network of 2,000+ publications and 35 languages to distribute your content strategically, ensuring it reaches the right audiences at optimal times for maximum visibility.</p>
            </div>
          </div>
          
          <div className="p-8 rounded-xl border border-highlight-blue/30 bg-highlight-blue/5 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg">5</div>
              <h3 className="text-xl font-bold">Measurement & Iteration</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">Continuous monitoring and real-time analytics provide actionable insights to refine and improve your strategy. Our feedback loop ensures your communications evolve with market dynamics and deliver measurable ROI.</p>
          </div>
        </div>
      </section>

      {/* Process Section - only show if we have process data */}
      {process.title && (
        <section id="process" className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">{process.title}</h2>
              <p className="text-xl text-highlight-blue font-medium mb-4">{process.subtitle}</p>
              <p className="text-muted-foreground max-w-3xl mx-auto mb-12">{process.description}</p>

              {/* Process Steps */}
              {process.steps.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
                  {process.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-highlight-blue rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-sm">{step.title}</h4>
                      </div>
                      {index < process.steps.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-highlight-blue hidden md:block" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Capabilities Grid */}
            {process.capabilities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {process.capabilities.map((capability, index) => {
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
            )}
          </div>
        </section>
      )}

      {/* Features Section - only show if we have features data */}
      {whatWeDo.features.length > 0 && (
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-5xl font-bold text-center mb-10">Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whatWeDo.features.map((feature, index) => {
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
      )}

      {/* CTA Section */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl p-8 md:p-12 text-center">
          <h2 className="text-5xl font-bold mb-4 text-foreground">
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
