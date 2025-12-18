import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, FileText, Users, BarChart3, Shield, Brain, Target, Lightbulb, MessageSquare } from "lucide-react";
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

interface PublicCompaniesData {
  public_companies: {
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

const PublicCompanies = () => {
  const { data, isLoading, error } = useJsonData<PublicCompaniesData>('public-companies.json');
  const { t } = useTranslation(['home', 'common']);
  useLanguage();

  const aboutFeatures = [
    {
      title: "SEC-Compliant Communications",
      description: "AI-powered content generation that adheres to SEC disclosure requirements and best practices.",
      icon: Shield,
    },
    {
      title: "Institutional Investor Focus",
      description: "Targeted messaging and outreach strategies designed for institutional investors and analysts.",
      icon: TrendingUp,
    },
    {
      title: "Real-Time Market Intelligence",
      description: "Monitor market sentiment, analyst coverage, and investor behavior with AI-driven insights.",
      icon: Target,
    },
  ];

  const featureItems = [
    {
      title: "Earnings Communications",
      description: "Streamlined earnings call preparation, press release generation, and investor materials creation.",
      icon: BarChart3,
    },
    {
      title: "AI-Powered IR Content",
      description: "Generate compliant investor communications, Q&A documents, and shareholder letters automatically.",
      icon: MessageSquare,
    },
    {
      title: "Analyst Relations",
      description: "AI-powered sentiment tracking, analyst coverage management, and relationship optimization.",
      icon: Users,
    },
    {
      title: "Strategic Market Insights",
      description: "Data-driven recommendations for timing, messaging, and investor engagement strategies.",
      icon: Lightbulb,
    },
  ];

  const faqItems = [
    {
      question: "How does AmplifiX ensure SEC compliance?",
      answer: "Our AI is trained on SEC disclosure requirements and public company best practices. All generated content goes through compliance checks and can be customized to meet your specific regulatory requirements.",
    },
    {
      question: "Can AmplifiX integrate with our existing IR tools?",
      answer: "Yes, AmplifiX integrates seamlessly with popular IR platforms, CRM systems, and financial data providers to create a unified communications workflow.",
    },
    {
      question: "How quickly can we get started?",
      answer: "Most public companies are fully operational within 2-4 weeks, including customization, training, and integration with existing systems.",
    },
    {
      question: "What security certifications does AmplifiX have?",
      answer: "We maintain SOC 2 Type II compliance, enterprise-grade encryption, and adhere to strict data privacy standards suitable for public company requirements.",
    },
    {
      question: "How does pricing work for public companies?",
      answer: "We offer tailored enterprise pricing based on company size, communication volume, and required features. Contact us for a customized quote.",
    },
  ];

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
          <p className="text-destructive">{t('common:ui.error')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText, TrendingUp, Users, BarChart3, Shield, CheckCircle
    };
    return icons[iconName] || FileText;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 md:pt-32 container mx-auto py-8 md:py-20 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-4 md:mb-8">
            <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-3 md:px-6 py-2 border border-highlight-blue/20 text-xs md:text-base">
              AI-Powered Investor Relations for Public Companies
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 px-2">
            {data.public_companies.hero.title}{' '}
            <span className="bg-gradient-to-r from-highlight-blue to-highlight-blue bg-clip-text text-transparent">
              {data.public_companies.hero.title_highlight}
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-12 max-w-3xl mx-auto px-2">
            {data.public_companies.hero.description}
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
                {data.public_companies.hero.cta_button}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="container mx-auto py-8 md:py-16 px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-2">
            Why Public Companies Choose AmplifiX
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Enterprise-grade investor relations powered by artificial intelligence
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
            {data.public_companies.key_features.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools designed for publicly traded company communications
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
        <h2 className="text-3xl font-bold text-center mb-12">Complete IR & Communications Suite</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.public_companies.key_features.features.map((feature, index) => {
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
            { value: "500+", label: "Public Companies Served" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "50%", label: "Time Savings on IR" },
            { value: "24/7", label: "Expert Support" },
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
          <h2 className="text-3xl font-bold text-center mb-12">{data.public_companies.benefits.title}</h2>
          
          <div className="space-y-6">
            {data.public_companies.benefits.items.map((benefit, index) => (
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
            Common questions about AmplifiX for public companies
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
            Ready to Transform Your IR?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Schedule a personalized demo to see how AmplifiX can elevate your investor relations
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

export default PublicCompanies;
