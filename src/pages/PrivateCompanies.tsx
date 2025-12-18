import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, Target, DollarSign, Globe, Lightbulb, Brain, TrendingUp, Users, MessageSquare, BarChart3 } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PrivateCompaniesData {
  private_companies: {
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

const PrivateCompanies = () => {
  const { data, isLoading, error } = useJsonData<PrivateCompaniesData>('private-companies.json');
  const { t } = useTranslation(['home', 'common']);
  useLanguage();

  const aboutFeatures = [
    {
      title: "Fundraising Excellence",
      description: "AI-powered pitch materials, investor outreach automation, and data room preparation.",
      icon: DollarSign,
    },
    {
      title: "Brand Building at Scale",
      description: "Strategic PR campaigns and thought leadership content to establish market presence.",
      icon: Globe,
    },
    {
      title: "IPO Readiness",
      description: "Comprehensive preparation for public market transition with compliance-ready systems.",
      icon: TrendingUp,
    },
  ];

  const featureItems = [
    {
      title: "Investor Pitch Optimization",
      description: "AI-driven analysis and refinement of pitch decks, financial models, and investor presentations.",
      icon: BarChart3,
    },
    {
      title: "Automated Stakeholder Updates",
      description: "Generate and distribute professional investor updates, board materials, and stakeholder communications.",
      icon: MessageSquare,
    },
    {
      title: "Media & PR Outreach",
      description: "Strategic media targeting, press release generation, and journalist relationship management.",
      icon: Users,
    },
    {
      title: "Growth Strategy Insights",
      description: "Data-driven recommendations for market timing, competitive positioning, and expansion strategies.",
      icon: Lightbulb,
    },
  ];

  const faqItems = [
    {
      question: "Is AmplifiX suitable for early-stage startups?",
      answer: "Absolutely! AmplifiX is designed to scale with your company. Our flexible pricing and feature sets work for seed-stage startups through Series D and beyond.",
    },
    {
      question: "How can AmplifiX help with our fundraising?",
      answer: "We provide AI-powered pitch deck optimization, investor research and targeting, automated outreach campaigns, and data room preparation to streamline your fundraising process.",
    },
    {
      question: "Can we use AmplifiX to prepare for an IPO?",
      answer: "Yes, our platform includes IPO readiness features including compliance training, IR infrastructure setup, and transition planning from private to public communications.",
    },
    {
      question: "How does AmplifiX compare to hiring a PR agency?",
      answer: "AmplifiX provides enterprise-grade communications capabilities at a fraction of traditional agency costs, with faster turnaround and 24/7 availability. Many clients use us alongside agencies for maximum impact.",
    },
    {
      question: "What integrations are available?",
      answer: "We integrate with popular CRM systems, investor databases, email platforms, and content management systems to fit seamlessly into your existing workflow.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
          <Skeleton className="h-10 w-32 mx-auto" />
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
          <p className="text-destructive">{t('common:ui.error')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      DollarSign, Globe, Target, Rocket, Lightbulb, CheckCircle
    };
    return icons[iconName] || DollarSign;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 md:pt-32 container mx-auto py-8 md:py-20 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-4 md:mb-8">
            <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-3 md:px-6 py-2 border border-highlight-blue/20 text-xs md:text-base">
              AI-Powered Communications for Growth Companies
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 px-2">
            {data.private_companies.hero.title}{' '}
            <span className="bg-gradient-to-r from-highlight-blue to-highlight-blue bg-clip-text text-transparent">
              {data.private_companies.hero.title_highlight}
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-12 max-w-3xl mx-auto px-2">
            {data.private_companies.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a 
              href="https://calendly.com/amplifix/amplifix-discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.private_companies.hero.cta_button}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="container mx-auto py-8 md:py-16 px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-2">
            Why Private Companies Choose AmplifiX
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Scale your communications with AI-powered tools designed for growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {aboutFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                <IconComponent className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {data.private_companies.key_features.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools to accelerate your company's growth and visibility
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {featureItems.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-card p-6 rounded-xl border border-border">
                <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-highlight-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features from JSON */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Complete Growth Communications Suite</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.private_companies.key_features.features.map((feature, index) => {
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

      {/* Stats Section */}
      <div className="container mx-auto py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1000+", label: "Private Companies Served" },
            { value: "$5B+", label: "Funding Raised by Clients" },
            { value: "60%", label: "Faster Fundraising" },
            { value: "10x", label: "ROI on Communications" },
          ].map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
              <div className="text-4xl font-bold text-highlight-blue">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{data.private_companies.benefits.title}</h2>
          
          <div className="space-y-6">
            {data.private_companies.benefits.items.map((benefit, index) => (
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

      {/* FAQ Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Common questions about AmplifiX for private companies
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Schedule a personalized demo to see how AmplifiX can transform your communications
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <a 
            href="https://calendly.com/amplifix/amplifix-discovery"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-8 py-4 text-lg rounded-lg"
            >
              Schedule Your Demo
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivateCompanies;
