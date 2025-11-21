import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation(['faq', 'common']);
  useLanguage();
  
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq:faq${i + 1}.question`),
    answer: t(`faq:faq${i + 1}.answer`),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {t('faq:hero.title')} <span className="text-highlight-blue">{t('faq:hero.title_highlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('faq:hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <LanguageAwareLink to={t('faq:hero.cta_primary_link')} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {t('faq:hero.cta_primary_text')}
              </Button>
            </LanguageAwareLink>
            <a 
              href={t('faq:hero.cta_secondary_link')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {t('faq:hero.cta_secondary_text')}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
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
