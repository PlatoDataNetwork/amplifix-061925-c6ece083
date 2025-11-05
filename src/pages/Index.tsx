import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
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
            <Link to="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {t('common:buttons.amplifyBrand')}
              </Button>
            </Link>
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
                  <Link to="/solutions">
                    <Button variant="link" className="text-highlight-blue mt-4 p-0">
                      {t('home:hero.learn_more')}
                    </Button>
                  </Link>
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
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border text-center">
                <Skeleton className="h-10 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))
          ) : homeData ? (
            homeData.home.stats.map((stat, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                <div className="text-4xl font-bold text-highlight-blue">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <div className="text-4xl font-bold text-highlight-blue">500+</div>
                <div className="text-muted-foreground">Companies Served</div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <div className="text-4xl font-bold text-highlight-blue">98%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <div className="text-4xl font-bold text-highlight-blue">$50B+</div>
                <div className="text-muted-foreground">Market Cap Managed</div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <div className="text-4xl font-bold text-highlight-blue">24/7</div>
                <div className="text-muted-foreground">AI Monitoring</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {isLoading ? (
              <Skeleton className="h-10 w-96 mx-auto" />
            ) : (
              homeData?.home.faq.title || 'Frequently Asked Questions'
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isLoading ? (
              <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            ) : (
              homeData?.home.faq.description || 'Get answers to common questions about AmplifiX and how we can help transform your corporate communications.'
            )}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : homeData ? (
            <Accordion type="single" collapsible className="w-full">
              {homeData.home.faq.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What is AmplifiX and how does it work?</AccordionTrigger>
                <AccordionContent>
                  AmplifiX is an AI-powered platform that revolutionizes corporate communications for public and private companies. We use advanced machine learning algorithms to analyze market sentiment, generate compelling content, and optimize communication strategies across investor relations, public relations, and corporate messaging channels.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">What services does AmplifiX offer?</AccordionTrigger>
                <AccordionContent>
                  AmplifiX offers a comprehensive suite of services including AI-powered content generation for press releases and investor updates, real-time market sentiment analysis, stakeholder relationship management, automated media monitoring, crisis communication support, regulatory compliance assistance, and strategic communication planning tailored to your company's unique needs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How does AmplifiX support public companies in capital markets?</AccordionTrigger>
                <AccordionContent>
                  For public companies, AmplifiX provides specialized support including earnings communication automation, SEC filing assistance, analyst relations management, investor call preparation, market sentiment tracking, compliance monitoring, and strategic guidance for maintaining transparent and effective communication with shareholders and regulatory bodies.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">What makes AmplifiX different from traditional IR/PR firms?</AccordionTrigger>
                <AccordionContent>
                  Unlike traditional firms, AmplifiX combines human expertise with cutting-edge AI technology to provide 24/7 monitoring, real-time insights, predictive analytics, and automated content generation. Our platform scales with your needs, offers transparent pricing, and delivers measurable results through data-driven strategies that traditional firms simply cannot match.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">How does AmplifiX help with investor relations management?</AccordionTrigger>
                <AccordionContent>
                  AmplifiX streamlines investor relations through intelligent CRM systems, automated investor communications, sentiment analysis of investor feedback, earnings call preparation and follow-up, investor meeting scheduling and tracking, performance metrics reporting, and strategic recommendations for improving investor engagement and satisfaction.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">Can AmplifiX help with crisis communication and reputation management?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. AmplifiX provides real-time crisis monitoring, rapid response communication templates, stakeholder notification systems, media sentiment tracking during crises, strategic messaging guidance, and post-crisis analysis and reporting. Our AI algorithms can detect potential issues early, allowing for proactive rather than reactive communication strategies.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">What pricing plans does AmplifiX offer?</AccordionTrigger>
                <AccordionContent>
                  AmplifiX offers three main pricing tiers: Startup ($499/month) for emerging companies with basic AI content generation and analytics; Growth ($1,499/month) for scaling businesses with advanced features and stakeholder CRM; and Enterprise (custom pricing) for large organizations requiring custom AI models, white-label options, and dedicated support. All plans include a free trial period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">How quickly can my company get started with AmplifiX?</AccordionTrigger>
                <AccordionContent>
                  Most companies can be onboarded within 1-2 weeks. Our process includes an initial consultation, platform setup and customization, data integration, team training, and strategy development. We provide dedicated onboarding specialists and comprehensive support materials to ensure a smooth transition to AI-powered communications management.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {isLoading ? (
              <Skeleton className="h-10 w-64 mx-auto" />
            ) : (
              homeData?.home.contact.title || 'Get In Touch'
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isLoading ? (
              <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            ) : (
              homeData?.home.contact.description || "Ready to amplify your corporate communications? Let's discuss how AmplifiX can transform your IR and PR strategy."
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-6">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                homeData?.home.contact.form.title || 'Send us a message'
              )}
            </h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    homeData?.home.contact.form.fields.company_name.label || 'Company Name'
                  )}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder={homeData?.home.contact.form.fields.company_name.placeholder || 'Your company'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    homeData?.home.contact.form.fields.email.label || 'Contact Email'
                  )}
                </label>
                <input 
                  type="email" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder={homeData?.home.contact.form.fields.email.placeholder || 'your@company.com'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    homeData?.home.contact.form.fields.company_type.label || 'Company Type'
                  )}
                </label>
                <select className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none">
                  {homeData?.home.contact.form.fields.company_type.options ? (
                    homeData.home.contact.form.fields.company_type.options.map((option, index) => (
                      <option key={index}>{option}</option>
                    ))
                  ) : (
                    <>
                      <option>Public Company</option>
                      <option>Private Company</option>
                      <option>Pre-IPO Company</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16" />
                  ) : (
                    homeData?.home.contact.form.fields.message.label || 'Message'
                  )}
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder={homeData?.home.contact.form.fields.message.placeholder || 'Tell us about your needs...'}
                ></textarea>
              </div>
              <Button className="w-full bg-highlight-blue text-white">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  homeData?.home.contact.form.submit_button || 'Send Message'
                )}
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))
            ) : homeData ? (
              homeData.home.contact.contact_info.map((info, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border">
                  <h4 className="text-lg font-bold mb-2">{info.title}</h4>
                  <p className="text-muted-foreground mb-2">{info.description}</p>
                  {info.contact && <a href={`mailto:${info.contact}`} className="text-highlight-blue hover:underline">{info.contact}</a>}
                  {info.additional && <p className="text-muted-foreground">{info.additional}</p>}
                </div>
              ))
            ) : (
              <>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h4 className="text-lg font-bold mb-2">Sales Inquiries</h4>
                  <p className="text-muted-foreground mb-2">Discuss your IR/PR needs with our experts</p>
                  <a href="mailto:support@amplifix.net" className="text-highlight-blue hover:underline">support@amplifix.net</a>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h4 className="text-lg font-bold mb-2">Customer Success</h4>
                  <p className="text-muted-foreground mb-2">Get help with your existing account</p>
                  <a href="mailto:support@amplifix.net" className="text-highlight-blue hover:underline">support@amplifix.net</a>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h4 className="text-lg font-bold mb-2">Partnership Opportunities</h4>
                  <p className="text-muted-foreground mb-2">Explore strategic partnerships</p>
                  <a href="mailto:support@amplifix.net" className="text-highlight-blue hover:underline">support@amplifix.net</a>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h4 className="text-lg font-bold mb-2">Office Hours</h4>
                  <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 6:00 PM (EST)</p>
                  <p className="text-muted-foreground">Emergency support available 24/7</p>
                </div>
              </>
            )}
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
