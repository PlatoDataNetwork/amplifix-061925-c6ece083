import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Users, Rocket, TrendingUp, LucideIcon } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";

interface SolutionItem {
  title: string;
  description: string;
  link_text: string;
  link: string;
  icon: string;
}

interface SolutionsData {
  hero: {
    title: string;
    title_highlight: string;
    description: string;
    cta_primary: {
      text: string;
      link: string;
    };
    cta_secondary: {
      text: string;
      link: string;
    };
  };
  solutions: SolutionItem[];
}

const iconMap: Record<string, LucideIcon> = {
  Building,
  Users,
  TrendingUp,
  Rocket,
};

const Solutions = () => {
  const { data, isLoading, error } = useJsonData<SolutionsData>('solutions.json');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4 text-center">
          <p className="text-muted-foreground">Loading...</p>
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
          <p className="text-destructive">Failed to load content. Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {data.hero.title} <span className="text-highlight-blue">{data.hero.title_highlight}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to={data.hero.cta_primary.link} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.hero.cta_primary.text}
              </Button>
            </Link>
            <a 
              href={data.hero.cta_secondary.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.hero.cta_secondary.text}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {data.solutions.map((solution, index) => {
            const IconComponent = iconMap[solution.icon];
            return (
              <Link key={index} to={solution.link} className="group">
                <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full">
                  {IconComponent && <IconComponent className="h-12 w-12 text-highlight-blue mb-4" />}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-highlight-blue transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {solution.description}
                  </p>
                  <div className="flex items-center text-highlight-blue font-medium">
                    {solution.link_text}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
