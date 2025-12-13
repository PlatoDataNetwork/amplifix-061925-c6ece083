import { useJsonData } from "@/hooks/useJsonData";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tv, Target, Brain, Video, Monitor, BarChart3, Play, Zap, TrendingUp, Users } from "lucide-react";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";

interface VideoDistributionData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: Array<{
    title: string;
    description: string;
  }>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Tv,
  Target,
  Brain,
  Video,
  Monitor,
  BarChart3,
};

const benefitIcons = [Play, Zap, TrendingUp, Users];

const VideoDistribution = () => {
  const { data, isLoading, error } = useJsonData<VideoDistributionData>('video-distribution.json');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Failed to load content</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Video Distribution | AmplifiX"
        description="Amplify your brand with streaming TV and digital video distribution. AI-powered targeting, cross-platform reach, and measurable business outcomes."
      />
      <MainHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-highlight-blue/20 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-highlight-blue to-highlight-blue/70 bg-clip-text text-transparent pb-2">
              {data.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-4">
              {data.hero.subtitle}
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {data.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90">
                <LanguageAwareLink to="/contact">Get Started</LanguageAwareLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://calendly.com/amplifix/30min" target="_blank" rel="noopener noreferrer">
                  Book a Demo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Comprehensive Video Distribution Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to distribute video content at scale and drive measurable results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Tv;
              return (
                <Card key={index} className="bg-card border-border hover:border-highlight-blue/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-highlight-blue/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-highlight-blue" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Achieve Your Business Goals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drive real business outcomes with targeted video distribution strategies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.benefits.map((benefit, index) => {
              const IconComponent = benefitIcons[index % benefitIcons.length];
              return (
                <Card key={index} className="bg-card border-border text-center hover:border-highlight-blue/50 transition-colors">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-highlight-blue/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-highlight-blue" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-highlight-blue/10 to-highlight-blue/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Amplify Your Video Strategy?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with our team to discover how AmplifiX video distribution can drive measurable results for your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90">
              <LanguageAwareLink to="/contact">Contact Us</LanguageAwareLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <LanguageAwareLink to="/showcase">View Case Studies</LanguageAwareLink>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VideoDistribution;
