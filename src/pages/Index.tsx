import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Shield, Zap, LockKeyhole, Star, CheckCircle, Users, Globe, Award, Brain, TrendingUp, BarChart3, MessageSquare, Lightbulb, Target } from "lucide-react";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";
import MainHeader from "@/components/MainHeader";
import SEOHead from "@/components/SEOHead";
import { useState } from "react";
import { useJsonData } from "@/hooks/useJsonData";
import { HomeData } from "@/types/home";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const { t } = useTranslation(['home', 'common']);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { data: homeData, isLoading, error } = useJsonData<HomeData>('home.json');
  useLanguage();

  // Build i18n-driven content arrays so sections translate correctly
  const aboutFeatures = [
    {
      title: t('home:about.aiPowered.title'),
      description: t('home:about.aiPowered.description'),
    },
    {
      title: t('home:about.marketLeadership.title'),
      description: t('home:about.marketLeadership.description'),
    },
    {
      title: t('home:about.strategicFocus.title'),
      description: t('home:about.strategicFocus.description'),
    },
  ];

  const featureItems = [
    {
      title: t('home:features.smartAnalytics.title'),
      description: t('home:features.smartAnalytics.description'),
    },
    {
      title: t('home:features.aiContent.title'),
      description: t('home:features.aiContent.description'),
    },
    {
      title: t('home:features.stakeholder.title'),
      description: t('home:features.stakeholder.description'),
    },
    {
      title: t('home:features.strategicInsights.title'),
      description: t('home:features.strategicInsights.description'),
    },
  ];

  const publicCompanyItems = [
    {
      title: t('home:solutions.publicCompanies.earnings.title'),
      description: t('home:solutions.publicCompanies.earnings.description'),
    },
    {
      title: t('home:solutions.publicCompanies.regulatory.title'),
      description: t('home:solutions.publicCompanies.regulatory.description'),
    },
    {
      title: t('home:solutions.publicCompanies.analyst.title'),
      description: t('home:solutions.publicCompanies.analyst.description'),
    },
  ];

  const privateCompanyItems = [
    {
      title: t('home:solutions.privateCompanies.fundraising.title'),
      description: t('home:solutions.privateCompanies.fundraising.description'),
    },
    {
      title: t('home:solutions.privateCompanies.brandBuilding.title'),
      description: t('home:solutions.privateCompanies.brandBuilding.description'),
    },
    {
      title: t('home:solutions.privateCompanies.ipoPrep.title'),
      description: t('home:solutions.privateCompanies.ipoPrep.description'),
    },
  ];

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEOHead />
      <MainHeader />

      {/* Hero Section - Optimized for mobile */}
      <div className="pt-24 md:pt-32 container mx-auto py-8 md:py-20 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-4 md:mb-8">
            <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-3 md:px-6 py-2 border border-highlight-blue/20 text-xs md:text-base">
              {isLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                t('home:hero.badge')
              )}
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 px-2">
            {isLoading ? (
              <Skeleton className="h-16 w-96 mx-auto" />
            ) : (
              t('home:hero.title')
            )}
          </h2>
          <div className="text-base md:text-xl text-muted-foreground mb-6 md:mb-12 max-w-3xl mx-auto px-2">
            {isLoading ? (
              <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            ) : (
              t('home:hero.description')
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <LanguageAwareLink to="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {t('common:buttons.amplifyBrand')}
              </Button>
            </LanguageAwareLink>
            <a 
              href="https://calendly.com/amplifix/amplifix-discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {t('common:buttons.bookDemo')}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="container mx-auto py-8 md:py-16 px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-2">
            {t('home:about.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            {t('home:about.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border text-center">
                <Skeleton className="h-12 w-12 mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          ) : (
            aboutFeatures.map((feature, index) => {
              const IconComponent = index === 0 ? Brain : index === 1 ? TrendingUp : Target;
              return (
                <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                  <IconComponent className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {t('home:features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('home:features.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border">
                <Skeleton className="w-12 h-12 mb-4" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : (
            featureItems.map((feature, index) => {
              const IconComponent = index === 0 ? BarChart3 : index === 1 ? MessageSquare : index === 2 ? Users : Lightbulb;
              return (
                <div key={index} className="bg-card p-6 rounded-xl border border-border">
                  <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <LanguageAwareLink to="/solutions">
                    <Button variant="link" className="text-highlight-blue mt-4 p-0">
                      {t('home:hero.learn_more')}
                    </Button>
                  </LanguageAwareLink>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {t('home:solutions.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('home:solutions.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">
              {t('home:solutions.publicCompanies.title')}
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3 mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : homeData ? (
                homeData.home.solutions.public_companies.items.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Earnings Communications</h4>
                      <p className="text-muted-foreground">Automated earnings call transcripts and investor materials</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Regulatory Compliance</h4>
                      <p className="text-muted-foreground">SEC filing assistance and compliance monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Analyst Relations</h4>
                      <p className="text-muted-foreground">AI-powered analyst sentiment tracking and engagement</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">
              {t('home:solutions.privateCompanies.title')}
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3 mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : homeData ? (
                homeData.home.solutions.private_companies.items.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Fundraising Support</h4>
                      <p className="text-muted-foreground">Pitch deck optimization and investor outreach automation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Brand Building</h4>
                      <p className="text-muted-foreground">Strategic PR campaigns and thought leadership content</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">IPO Preparation</h4>
                      <p className="text-muted-foreground">Comprehensive readiness assessment and roadmap</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container mx-auto py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
              <div className="text-4xl font-bold text-highlight-blue">{t(`home:stats.${index}.value`)}</div>
              <div className="text-muted-foreground">{t(`home:stats.${index}.label`)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {t('home:faq.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('home:faq.description')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left">{t(`home:faq.items.${index}.question`)}</AccordionTrigger>
                <AccordionContent>{t(`home:faq.items.${index}.answer`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {t('home:contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('home:contact.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-6">
              {t('home:contact.form.title')}
            </h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('home:contact.form.fields.company_name.label')}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder={t('home:contact.form.fields.company_name.placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('home:contact.form.fields.email.label')}
                </label>
                <input 
                  type="email" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder={t('home:contact.form.fields.email.placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('home:contact.form.fields.company_type.label')}
                </label>
                <select className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none">
                  {[0, 1, 2].map((index) => (
                    <option key={index}>{t(`home:contact.form.fields.company_type.options.${index}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('home:contact.form.fields.message.label')}
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder={t('home:contact.form.fields.message.placeholder')}
                ></textarea>
              </div>
              <Button className="w-full bg-highlight-blue text-white">
                {t('home:contact.form.submit_button')}
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border">
                <h4 className="text-lg font-bold mb-2">{t(`home:contact.contact_info.${index}.title`)}</h4>
                <p className="text-muted-foreground mb-2">{t(`home:contact.contact_info.${index}.description`)}</p>
                {index < 3 && <a href={`mailto:${t(`home:contact.contact_info.${index}.contact`)}`} className="text-highlight-blue hover:underline">{t(`home:contact.contact_info.${index}.contact`)}</a>}
                {index === 3 && <p className="text-muted-foreground">{t(`home:contact.contact_info.${index}.additional`)}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={handleCloseSignUpModal} 
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
