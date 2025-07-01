import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Shield, Zap, LockKeyhole, Star, CheckCircle, Users, Globe, Award, Brain, TrendingUp, BarChart3, MessageSquare, Lightbulb, Target } from "lucide-react";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";
import MainHeader from "@/components/MainHeader";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

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
      <MainHeader />

      {/* Hero Section - Increased top padding to account for fixed header */}
      <div className="pt-32 container mx-auto py-12 md:py-20 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6 md:mb-8">
            <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-4 md:px-6 py-2 border border-highlight-blue/20 text-sm md:text-base">
              AI-Powered IR & Corporate Communications
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
            Amplifi Your <br />
            <span className="text-highlight-blue">
              Communications
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto px-4">
            AmplifiX leverages cutting-edge AI to transform how public and private companies 
            manage investor relations and corporate communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStartedClick}
              className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg"
            >
              Amplifi Your Brand →
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToContact}
              className="border-border hover:bg-accent transition-colors px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">About AmplifiX</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're revolutionizing corporate communications through AI-driven insights, 
            automated content generation, and intelligent stakeholder engagement platforms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border text-center">
            <Brain className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">AI-Powered Intelligence</h3>
            <p className="text-muted-foreground">
              Advanced machine learning algorithms analyze market sentiment and optimize communications.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border text-center">
            <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Market Leadership</h3>
            <p className="text-muted-foreground">
              Trusted by Fortune 500 companies and emerging growth businesses worldwide.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border text-center">
            <Target className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Strategic Focus</h3>
            <p className="text-muted-foreground">
              Tailored solutions for both public and private companies at every stage of growth.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Powerful AI Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your corporate communications with our comprehensive suite of AI-powered tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-highlight-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Real-time insights into market sentiment, media coverage, and investor engagement 
              with AI-powered predictive analytics.
            </p>
            <Link to="/features">
              <Button variant="link" className="text-highlight-blue mt-4 p-0">
                Learn more →
              </Button>
            </Link>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-highlight-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Content Generation</h3>
            <p className="text-muted-foreground">
              Generate compelling press releases, investor updates, and corporate communications 
              tailored to your brand voice and audience.
            </p>
            <Link to="/features">
              <Button variant="link" className="text-highlight-blue mt-4 p-0">
                Learn more →
              </Button>
            </Link>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-highlight-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Stakeholder Management</h3>
            <p className="text-muted-foreground">
              Intelligent CRM for investors, analysts, media contacts, and other key stakeholders 
              with automated engagement tracking.
            </p>
            <Link to="/features">
              <Button variant="link" className="text-highlight-blue mt-4 p-0">
                Learn more →
              </Button>
            </Link>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-highlight-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Strategic Insights</h3>
            <p className="text-muted-foreground">
              AI-driven recommendations for timing, messaging, and channel optimization 
              to maximize impact and reach.
            </p>
            <Link to="/features">
              <Button variant="link" className="text-highlight-blue mt-4 p-0">
                Learn more →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Solutions for Every Stage</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're preparing for an IPO or managing ongoing investor relations, 
            AmplifiX adapts to your company's unique needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Public Companies</h3>
            <div className="space-y-4">
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
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Private Companies</h3>
            <div className="space-y-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container mx-auto py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to common questions about AmplifiX and how we can help transform your corporate communications.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to amplify your corporate communications? Let's discuss how AmplifiX can transform your IR and PR strategy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder="Your company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input 
                  type="email" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder="your@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Type</label>
                <select className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none">
                  <option>Public Company</option>
                  <option>Private Company</option>
                  <option>Pre-IPO Company</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:border-highlight-blue focus:outline-none"
                  placeholder="Tell us about your needs..."
                ></textarea>
              </div>
              <Button className="w-full bg-highlight-blue text-white">
                Send Message
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="text-lg font-bold mb-2">Sales Inquiries</h4>
              <p className="text-muted-foreground mb-2">Discuss your IR/PR needs with our experts</p>
              <p className="text-highlight-blue">sales@amplifix.ai</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="text-lg font-bold mb-2">Customer Success</h4>
              <p className="text-muted-foreground mb-2">Get help with your existing account</p>
              <p className="text-highlight-blue">success@amplifix.ai</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="text-lg font-bold mb-2">Partnership Opportunities</h4>
              <p className="text-muted-foreground mb-2">Explore strategic partnerships</p>
              <p className="text-highlight-blue">partners@amplifix.ai</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="text-lg font-bold mb-2">Office Hours</h4>
              <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 6:00 PM (EST)</p>
              <p className="text-muted-foreground">Emergency support available 24/7</p>
            </div>
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
