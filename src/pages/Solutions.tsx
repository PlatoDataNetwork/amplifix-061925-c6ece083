import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { 
  Building2, 
  Users, 
  Lightbulb, 
  BarChart3, 
  Megaphone, 
  Share2,
  ArrowRight,
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
];

const solutionCards: SolutionCard[] = [
  {
    title: "Advisory",
    description: "Strategic advisory services to help you navigate complex corporate communications challenges and maximize stakeholder value.",
    link: "/solutions/advisory",
    icon: Lightbulb,
  },
  {
    title: "Analytics",
    description: "Comprehensive analytics suite providing real-time insights, sentiment analysis, and performance metrics for data-driven decisions.",
    link: "/solutions/analytics",
    icon: BarChart3,
  },
  {
    title: "IR / PR",
    description: "Integrated investor relations and public relations platform to streamline communications and enhance stakeholder engagement.",
    link: "/solutions/ir-pr",
    icon: Megaphone,
  },
  {
    title: "Syndication",
    description: "Premium content distribution network to amplify your message across targeted channels and maximize reach.",
    link: "/solutions/syndication",
    icon: Share2,
  },
];

const SolutionCardComponent = ({ card }: { card: SolutionCard }) => {
  const Icon = card.icon;
  return (
    <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full flex flex-col">
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

const Solutions = () => {
  useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Solutions - AmplifiX Corporate Communications Platform" />
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 pb-2 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
            Solutions for Every Stage
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive corporate communications solutions designed to amplify your strategy at every stage of growth.
          </p>
        </div>
      </div>

      {/* Platform Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {platformCards.map((card, index) => (
            <SolutionCardComponent key={index} card={card} />
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {solutionCards.map((card, index) => (
            <SolutionCardComponent key={index} card={card} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
