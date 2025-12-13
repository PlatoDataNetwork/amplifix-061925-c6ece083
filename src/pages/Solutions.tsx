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
  LucideIcon
} from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/hooks/useLanguage";

interface SolutionCard {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
}

const platformCards: SolutionCard[] = [
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

const solutionCards: SolutionCard[] = [
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

const SolutionCardComponent = ({ card }: { card: SolutionCard }) => {
  const Icon = card.icon;
  return (
    <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full flex flex-col hover:scale-105">
      <Icon className="h-12 w-12 text-highlight-blue mb-4" />
      <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
      <p className="text-muted-foreground mb-6 flex-grow">{card.description}</p>
      <LanguageAwareLink to={card.link}>
        <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full group">
          Explore
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </LanguageAwareLink>
    </div>
  );
};

const allCards = [...platformCards, ...solutionCards];

const Solutions = () => {
  useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Solutions - AmplifiX Corporate Communications Platform" />
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-12 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 pb-2 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
            Solutions for Every Stage
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive solutions designed to amplify your communication strategy at every stage of growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LanguageAwareLink to="/contact">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
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
                className="border-border hover:bg-accent transition-colors px-8 py-4 text-lg rounded-lg min-h-[48px]"
              >
                Book a Demo
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* All Solutions Grid */}
      <section className="container mx-auto py-8 px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {allCards.map((card, index) => (
            <SolutionCardComponent key={index} card={card} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
