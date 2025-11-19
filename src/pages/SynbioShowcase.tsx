import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { 
  ExternalLink, 
  TrendingUp, 
  Target, 
  Brain, 
  Heart,
  Lightbulb,
  Zap,
  BarChart3,
  DollarSign,
  Leaf,
  Microscope,
  ScanFace,
  Smartphone,
  FileText,
  Users
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";

interface SynbioData {
  synbio: {
    seo: {
      title: string;
      description: string;
      keywords: string;
      canonical: string;
    };
    hero: {
      badge: string;
      badge_subtitle?: string;
      title: string;
      subtitle: string;
      description: string;
      buttons: {
        primary: { text: string; url: string; external: boolean };
        secondary: { text: string; url: string; external: boolean };
        tertiary: { text: string; url: string; external: boolean };
      };
      stats: Array<{ label: string; value: string; icon: string }>;
    };
    company_overview: {
      title: string;
      description: string;
      pillars: Array<{ title: string; description: string }>;
    };
    divisions: {
      title: string;
      description: string;
      programs: Array<{
        name: string;
        subtitle: string;
        description: string;
        key_features: string[];
        tags: string[];
      }>;
    };
    competitive_advantages: {
      title: string;
      description: string;
      advantages: Array<{ title: string; description: string; icon: string }>;
    };
    mental_health_ai: {
      title: string;
      subtitle: string;
      description: string;
      treatment_cycle: {
        title: string;
        steps: Array<{ number: number; title: string; icon: string }>;
      };
      benefits: Array<{ title: string; description: string; icon: string }>;
    };
    investment_highlights: {
      title: string;
      description: string;
      highlights: Array<{ title: string; description: string; icon: string }>;
    };
    cta: {
      title: string;
      description: string;
      buttons: {
        primary: { text: string; link: string };
        secondary: { text: string; link: string };
      };
    };
    footer: {
      description: string;
      disclaimer: string;
      official_link: { text: string; url: string };
    };
  };
}

const iconMap: Record<string, any> = {
  brain: Brain,
  target: Target,
  'trending-up': TrendingUp,
  microscope: Microscope,
  'scan-face': ScanFace,
  smartphone: Smartphone,
  'file-text': FileText,
  users: Users,
  lightbulb: Lightbulb,
  leaf: Leaf,
  heart: Heart,
  zap: Zap,
  'bar-chart': BarChart3,
  'dollar-sign': DollarSign,
};

const SynbioShowcase = () => {
  const { data, isLoading, error } = useJsonData<SynbioData>('synbio-showcase.json');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto py-20 px-4 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto py-20 px-4 text-center">
          <p className="text-destructive">Error loading showcase data</p>
        </div>
      </div>
    );
  }

  const content = data.synbio;

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords} />
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={content.seo.canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <link rel="canonical" href={content.seo.canonical} />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-primary/10 text-primary rounded-full px-4 py-2 border border-primary/20 text-sm font-medium">
                    {content.hero.badge}
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-primary">{content.hero.subtitle}</span><br />
                  {content.hero.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {content.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={content.hero.buttons.primary.url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      {content.hero.buttons.primary.text}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href={content.hero.buttons.secondary.url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      {content.hero.buttons.secondary.text}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href={content.hero.buttons.tertiary.url}>
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      {content.hero.buttons.tertiary.text}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {content.hero.stats.map((stat, index) => {
                  const Icon = iconMap[stat.icon];
                  return (
                    <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        {Icon && <Icon className="h-8 w-8 text-primary mb-3" />}
                        <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview Section */}
        <div className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-6 text-foreground">
                {content.company_overview.title}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
                {content.company_overview.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.company_overview.pillars.map((pillar, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-semibold mb-4 text-foreground">{pillar.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divisions Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-6 text-foreground">
                {content.divisions.title}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
                {content.divisions.description}
              </p>
              
              <div className="space-y-12">
                {content.divisions.programs.map((program, index) => (
                  <Card key={index} className="bg-card border-border overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {program.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold mb-2 text-foreground">{program.name}</h3>
                      <h4 className="text-xl text-primary mb-4">{program.subtitle}</h4>
                      <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                        {program.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {program.key_features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                            <p className="text-muted-foreground">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Advantages Section */}
        <div className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-6 text-foreground">
                {content.competitive_advantages.title}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
                {content.competitive_advantages.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.competitive_advantages.advantages.map((advantage, index) => {
                  const Icon = iconMap[advantage.icon];
                  return (
                    <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        {Icon && <Icon className="h-10 w-10 text-primary mb-4" />}
                        <h3 className="text-xl font-semibold mb-3 text-foreground">{advantage.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health AI Section */}
        <div className="py-20 bg-gradient-to-br from-background via-highlight-blue/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-6 text-foreground">
                {content.mental_health_ai.title}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto leading-relaxed">
                {content.mental_health_ai.description}
              </p>

              {/* Treatment Cycle */}
              <div className="mb-16">
                <h3 className="text-3xl font-semibold text-center mb-10 text-foreground">
                  {content.mental_health_ai.treatment_cycle.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {content.mental_health_ai.treatment_cycle.steps.map((step, index) => {
                    const Icon = iconMap[step.icon];
                    return (
                      <div key={index} className="relative">
                        <Card className="bg-card border-border hover:border-highlight-blue/50 transition-all h-full">
                          <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-highlight-blue/10 flex items-center justify-center mx-auto mb-6">
                              <span className="text-3xl font-bold text-highlight-blue">{step.number}</span>
                            </div>
                            {Icon && <Icon className="h-12 w-12 text-highlight-blue mx-auto mb-4" />}
                            <p className="text-muted-foreground text-lg leading-relaxed">{step.title}</p>
                          </CardContent>
                        </Card>
                        {index < content.mental_health_ai.treatment_cycle.steps.length - 1 && (
                          <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                            <div className="w-8 h-0.5 bg-highlight-blue/30"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-3xl font-semibold text-center mb-10 text-foreground">
                  Key Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {content.mental_health_ai.benefits.map((benefit, index) => {
                    const Icon = iconMap[benefit.icon];
                    return (
                      <Card key={index} className="bg-card border-border hover:border-highlight-blue/50 transition-all">
                        <CardContent className="p-8">
                          {Icon && <Icon className="h-10 w-10 text-highlight-blue mb-4" />}
                          <h4 className="text-2xl font-semibold mb-3 text-foreground">{benefit.title}</h4>
                          <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Highlights Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-6 text-foreground">
                {content.investment_highlights.title}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
                {content.investment_highlights.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.investment_highlights.highlights.map((highlight, index) => {
                  const Icon = iconMap[highlight.icon];
                  return (
                    <Card key={index} className="bg-card border-border">
                      <CardContent className="p-8">
                        {Icon && <Icon className="h-12 w-12 text-primary mb-4" />}
                        <h3 className="text-2xl font-semibold mb-3 text-foreground">{highlight.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">{highlight.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-foreground">{content.cta.title}</h2>
              <p className="text-xl text-muted-foreground mb-8">
                {content.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={content.cta.buttons.primary.link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {content.cta.buttons.primary.text}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <LanguageAwareLink to={content.cta.buttons.secondary.link}>
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent">
                    {content.cta.buttons.secondary.text}
                  </Button>
                </LanguageAwareLink>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {content.footer.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {content.footer.disclaimer}{' '}
                <a 
                  href={content.footer.official_link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {content.footer.official_link.text}
                </a>
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SynbioShowcase;
