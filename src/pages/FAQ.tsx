import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/hooks/useLanguage";
import { useJsonData } from "@/hooks/useJsonData";
import { useState } from "react";
import { ChevronDown, Layout, Layers, Globe, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  icon: string;
  faqs: FAQItem[];
}

interface FAQData {
  faq: {
    hero: {
      title: string;
      title_highlight: string;
      description: string;
      cta_primary_text: string;
      cta_primary_link: string;
      cta_secondary_text: string;
      cta_secondary_link: string;
    };
    categories: FAQCategory[];
  };
}

const iconMap: Record<string, React.ReactNode> = {
  layout: <Layout className="w-5 h-5" />,
  layers: <Layers className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
};

const FAQ = () => {
  const { data: faqData } = useJsonData<FAQData>('faq.json');
  useLanguage();
  
  const [openCategories, setOpenCategories] = useState<string[]>(["Platform"]);
  
  const categories = faqData?.faq.categories || [];

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {faqData?.faq.hero.title || 'Frequently Asked'} <span className="text-highlight-blue">{faqData?.faq.hero.title_highlight || 'Questions'}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {faqData?.faq.hero.description || 'Find answers to common questions about AmplifiX'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <LanguageAwareLink to={faqData?.faq.hero.cta_primary_link || '/contact'} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {faqData?.faq.hero.cta_primary_text || 'Contact Us'}
              </Button>
            </LanguageAwareLink>
            <a 
              href={faqData?.faq.hero.cta_secondary_link || 'https://calendly.com/amplifix/amplifix-discovery'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {faqData?.faq.hero.cta_secondary_text || 'Book a Demo'}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Categories Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {categories.map((category) => {
            const isOpen = openCategories.includes(category.name);
            
            return (
              <Collapsible 
                key={category.name} 
                open={isOpen} 
                onOpenChange={() => toggleCategory(category.name)}
              >
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-highlight-blue/10 flex items-center justify-center text-highlight-blue">
                        {iconMap[category.icon] || <Layout className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                        <p className="text-sm text-muted-foreground">{category.faqs.length} questions</p>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-6 pb-6">
                      <Accordion type="single" collapsible className="w-full space-y-3">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem 
                            key={`${category.name}-faq-${index}`} 
                            value={`item-${index}`} 
                            className="bg-background/50 px-4 rounded-lg border border-border/50"
                          >
                            <AccordionTrigger className="text-left text-base py-4 hover:no-underline">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
