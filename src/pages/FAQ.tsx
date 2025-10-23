import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useJsonData } from "@/hooks/useJsonData";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  faq: {
    hero_title: string;
    hero_title_highlight: string;
    hero_description: string;
    hero_cta_primary_text: string;
    hero_cta_primary_link: string;
    hero_cta_secondary_text: string;
    hero_cta_secondary_link: string;
    faqs: FAQItem[];
  };
}

const FAQ = () => {
  const { data, isLoading, error } = useJsonData<FAQData>('faq.json');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-48" />
            </div>
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
          <p className="text-destructive">Failed to load FAQ content</p>
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
            {data.faq.hero_title} <span className="text-highlight-blue">{data.faq.hero_title_highlight}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {data.faq.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to={data.faq.hero_cta_primary_link} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.faq.hero_cta_primary_text}
              </Button>
            </Link>
            <a 
              href={data.faq.hero_cta_secondary_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.faq.hero_cta_secondary_text}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {data.faq.faqs.map((faq, index) => (
              <AccordionItem 
                key={`faq-${index}`} 
                value={`item-${index}`} 
                className="bg-card p-6 rounded-xl border border-border"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
