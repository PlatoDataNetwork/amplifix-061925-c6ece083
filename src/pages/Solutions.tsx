import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { 
  Building2, 
  Users, 
  Lightbulb, 
  BarChart3, 
  Megaphone, 
  Share2,
  Code,
  TrendingUp,
  ArrowRight,
  Tv,
  Rocket,
  LucideIcon
} from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/hooks/useLanguage";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";

interface SolutionItem {
  title: string;
  description: string;
  link: string;
  link_text: string;
  icon: string;
}

interface SolutionsData {
  solutions: {
    hero_title: string;
    hero_title_highlight: string;
    hero_description: string;
    hero_cta_primary_text: string;
    hero_cta_primary_link: string;
    hero_cta_secondary_text: string;
    hero_cta_secondary_link: string;
    solutions_list?: SolutionItem[];
  };
}

const iconMap: Record<string, LucideIcon> = {
  Building: Building2,
  Building2: Building2,
  Users: Users,
  TrendingUp: TrendingUp,
  Rocket: Rocket,
  Lightbulb: Lightbulb,
  BarChart3: BarChart3,
  Code: Code,
  Megaphone: Megaphone,
  Share2: Share2,
  Tv: Tv,
};

// Default cards for when no JSON data is available or as fallback
const defaultPlatformCards = [
  {
    title: "Public Companies",
    description: "AI-powered investor relations and corporate communications solutions designed for publicly traded companies with compliance-first approach.",
    link: "/solutions/public-companies",
    icon: Building2,
  },
  {
    title: "Private Companies",
    description: "Strategic communications and stakeholder engagement solutions tailored for private companies preparing for growth or exit.",
    link: "/solutions/private-companies",
    icon: Users,
  },
  {
    title: "Market Intelligence",
    description: "Real-time market insights, news aggregation, and intelligence across key verticals to inform strategic decisions.",
    link: "/intel",
    icon: TrendingUp,
  },
];

const defaultSolutionCards = [
  {
    title: "Advisory",
    description: "Strategic advisory services to help you navigate complex corporate communications challenges and maximize stakeholder value.",
    link: "/solutions/advisory",
    icon: Lightbulb,
  },
  {
    title: "Data Analytics",
    description: "Comprehensive analytics suite providing real-time insights, sentiment analysis, and performance metrics for data-driven decisions.",
    link: "/solutions/analytics",
    icon: BarChart3,
  },
  {
    title: "Development",
    description: "Tailored software solutions and platform integrations to power your corporate communications infrastructure.",
    link: "/solutions/development",
    icon: Code,
  },
  {
    title: "Investor Relations",
    description: "Integrated investor relations and public relations platform to streamline communications and enhance stakeholder engagement.",
    link: "/solutions/ir-pr",
    icon: Megaphone,
  },
  {
    title: "Syndication / IR / PR",
    description: "Premium content distribution network to amplify your message across targeted channels and maximize reach.",
    link: "/solutions/syndication",
    icon: Share2,
  },
  {
    title: "Video Distribution",
    description: "Streaming TV and digital video distribution with AI-powered targeting to reach audiences across every screen.",
    link: "/solutions/video-distribution",
    icon: Tv,
  },
];

interface SolutionCardProps {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
  buttonText?: string;
}

const SolutionCardComponent = ({ title, description, link, icon: Icon, buttonText = "Explore" }: SolutionCardProps) => {
  return (
    <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full flex flex-col hover:scale-105">
      <Icon className="h-12 w-12 text-highlight-blue mb-4" />
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
      <LanguageAwareLink to={link}>
        <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full group">
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </LanguageAwareLink>
    </div>
  );
};

const Solutions = () => {
  useLanguage();
  const { data, isLoading } = useJsonData<SolutionsData>('solutions.json');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-12 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get data from JSON or use defaults
  const solutions = data?.solutions;
  const heroTitle = solutions?.hero_title || "Solutions for";
  const heroHighlight = solutions?.hero_title_highlight || "Every Stage";
  const heroDescription = solutions?.hero_description || "Comprehensive solutions designed to amplify your communication strategy at every stage of growth.";
  const ctaPrimaryText = solutions?.hero_cta_primary_text || "Get Started";
  const ctaSecondaryText = solutions?.hero_cta_secondary_text || "Book a Demo";
  const ctaSecondaryLink = solutions?.hero_cta_secondary_link || "https://calendly.com/amplifix/amplifix-discovery";

  // Build cards from JSON data if available, otherwise use defaults
  let allCards: SolutionCardProps[] = [];
  
  if (solutions?.solutions_list && solutions.solutions_list.length > 0) {
    allCards = solutions.solutions_list.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      icon: iconMap[item.icon] || Building2,
      buttonText: item.link_text?.replace(' →', '') || "Explore",
    }));
  }
  
  // If no JSON cards, use defaults
  if (allCards.length === 0) {
    allCards = [
      ...defaultPlatformCards.map(c => ({ ...c, buttonText: "Explore" })),
      ...defaultSolutionCards.map(c => ({ ...c, buttonText: "Explore" })),
    ];
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Solutions - AmplifiX Corporate Communications Platform" />
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-12 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 pb-2 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
            {heroTitle} {heroHighlight}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LanguageAwareLink to="/contact">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
              >
                {ctaPrimaryText}
              </Button>
            </LanguageAwareLink>
            <a 
              href={ctaSecondaryLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
              >
                {ctaSecondaryText}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* All Solutions Grid */}
      <section className="container mx-auto py-8 px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {allCards.map((card, index) => (
            <SolutionCardComponent 
              key={index} 
              title={card.title}
              description={card.description}
              link={card.link}
              icon={card.icon}
              buttonText={card.buttonText}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;