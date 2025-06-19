
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Users, MessageSquare, Shield, TrendingUp, Zap, CheckCircle, Star, Building2, Briefcase, Globe, Target, Award, Clock, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "@/components/Footer";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Inc.",
      content: "AmplifiX transformed our investor communications. Their AI-powered insights helped us achieve a 40% increase in institutional investment within 6 months.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CFO, GreenEnergy Corp",
      content: "The crisis communication support during our Q3 earnings was exceptional. They helped us maintain investor confidence during challenging times.",
      rating: 5
    },
    {
      name: "Jennifer Walsh",
      role: "Head of IR, MetaLogics",
      content: "Their media relations strategy increased our positive coverage by 200%. The ROI on our PR investment has been remarkable.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "What is AmplifiX?",
      answer: "AmplifiX is an AI-powered investor relations and public relations platform designed for modern companies navigating today's complex financial markets. We combine cutting-edge artificial intelligence with deep industry expertise to help businesses amplify their brand, communicate effectively with stakeholders, and build stronger relationships with investors, media, and the public. Our platform provides comprehensive solutions for IR management, media relations, crisis communication, and strategic communications planning."
    },
    {
      question: "What services does AmplifiX offer?",
      answer: "AmplifiX offers a comprehensive suite of services including: Investor Relations Management (earnings call preparation, investor presentations, regulatory filings support), Media Relations & PR (press release distribution, media outreach, thought leadership positioning), Crisis Communication (real-time monitoring, rapid response strategies, reputation management), Strategic Communications (brand messaging, stakeholder engagement, market positioning), AI-Powered Analytics (sentiment analysis, competitor tracking, performance metrics), and Compliance Support (SEC filing assistance, disclosure management, regulatory guidance)."
    },
    {
      question: "How does AmplifiX support public companies in the capital markets?",
      answer: "AmplifiX provides specialized support for public companies through comprehensive capital markets communication strategies. We help with quarterly earnings preparation, investor day presentations, roadshow planning, and regulatory compliance. Our AI-powered platform monitors market sentiment, tracks analyst coverage, and provides real-time insights on stock performance and investor perception. We also facilitate direct communication channels with institutional investors, research analysts, and financial media to ensure your company's story reaches the right audiences at the right time."
    },
    {
      question: "Why should my company work with AmplifiX?",
      answer: "Companies choose AmplifiX because we deliver measurable results through our unique combination of AI technology and human expertise. Our clients typically see 40% improvement in investor engagement, 200% increase in positive media coverage, and significantly faster response times during crisis situations. We provide 24/7 monitoring, data-driven insights, and personalized strategies tailored to your industry and company size. Our team includes former Wall Street analysts, seasoned PR professionals, and technology experts who understand both the financial markets and modern communication channels."
    },
    {
      question: "What makes AmplifiX different from other IR/PR firms?",
      answer: "AmplifiX stands out through our AI-first approach that provides real-time insights and predictive analytics that traditional firms cannot match. While other firms rely on reactive strategies, we use machine learning to anticipate market trends, identify potential issues before they escalate, and optimize communication timing for maximum impact. Our integrated platform combines IR and PR functions that are typically handled separately, creating more cohesive and effective messaging. We also offer transparent pricing, faster turnaround times, and detailed performance analytics that prove ROI."
    },
    {
      question: "How does AmplifiX help manage investor relations?",
      answer: "Our investor relations management includes comprehensive support for all IR activities: earnings call preparation with Q&A coaching, investor presentation design and messaging, one-on-one meeting facilitation with institutional investors, annual report and proxy statement support, investor targeting and database management, compliance with SEC regulations and disclosure requirements, performance benchmarking against industry peers, and crisis communication protocols. Our AI platform continuously monitors investor sentiment and provides recommendations for engagement strategies based on market conditions and company performance."
    },
    {
      question: "How does AmplifiX help with media relations and public relations?",
      answer: "AmplifiX transforms media relations through strategic storytelling and relationship building. We develop compelling narratives that resonate with financial and trade media, secure high-impact placements in tier-1 publications, manage executive thought leadership programs, coordinate product launches and corporate announcements, handle media training for C-suite executives, monitor media coverage and sentiment across all channels, and build lasting relationships with key journalists and influencers. Our AI platform identifies the most relevant media opportunities and optimal timing for maximum coverage and engagement."
    },
    {
      question: "What are the benefits of AmplifiX's crisis communication services?",
      answer: "Our crisis communication services provide rapid response capabilities when your company faces challenging situations. Benefits include: 24/7 monitoring for potential issues across news, social media, and financial channels; immediate alert systems that notify you of emerging threats; pre-developed response templates and messaging frameworks; direct coordination with legal and compliance teams; real-time sentiment tracking during crisis events; post-crisis analysis and reputation recovery strategies; media training for spokespersons during high-pressure situations; and stakeholder communication management to maintain investor and customer confidence. Our AI-powered early warning system often identifies potential crises 24-48 hours before they become public, giving you valuable time to prepare appropriate responses."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <nav className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
                alt="AmplifiX Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              AmplifiX
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/documentation" className="text-muted-foreground hover:text-highlight-blue transition-colors">
              Documentation
            </Link>
            <Link to="/api" className="text-muted-foreground hover:text-highlight-blue transition-colors">
              API
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-highlight-blue transition-colors">
              Blog
            </Link>
            <Link to="/support" className="text-muted-foreground hover:text-highlight-blue transition-colors">
              Support
            </Link>
            <Button asChild variant="ghost">
              <Link to="/dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto py-4 px-4 space-y-3">
              <Link 
                to="/documentation" 
                className="block py-2 text-muted-foreground hover:text-highlight-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link 
                to="/api" 
                className="block py-2 text-muted-foreground hover:text-highlight-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                API
              </Link>
              <Link 
                to="/blog" 
                className="block py-2 text-muted-foreground hover:text-highlight-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/support" 
                className="block py-2 text-muted-foreground hover:text-highlight-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Button asChild variant="ghost" className="w-full justify-start p-2">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile-Optimized Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            AI-Powered Investor Relations & PR
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Amplify Your Story with <span className="text-highlight-blue">AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
            Revolutionize your investor relations and public relations with our AI-driven platform.
            Get real-time insights, predictive analytics, and personalized strategies to amplify your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/50">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="py-4">
            <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-highlight-blue mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl font-bold">40%</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Increase in Investor Engagement</p>
          </div>
          <div className="py-4">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-highlight-blue mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl font-bold">200%</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Growth in Positive Media Coverage</p>
          </div>
          <div className="py-4">
            <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-highlight-blue mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl font-bold">24/7</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Real-Time Monitoring & Support</p>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Services Section */}
      <section className="py-12 sm:py-20 px-4" id="solutions">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
              Our Solutions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              AI-Powered Services for Modern Companies
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              We offer a comprehensive suite of services designed to amplify your brand,
              communicate effectively with stakeholders, and build stronger relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Investor Relations Management</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Maximize investor engagement and build lasting relationships.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground text-sm sm:text-base space-y-1">
                  <li>Earnings Call Preparation</li>
                  <li>Investor Presentations</li>
                  <li>Regulatory Filings Support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Media Relations & PR</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Increase positive media coverage and enhance your public image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground text-sm sm:text-base space-y-1">
                  <li>Press Release Distribution</li>
                  <li>Media Outreach</li>
                  <li>Thought Leadership Positioning</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Crisis Communication</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Protect your reputation and maintain investor confidence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground text-sm sm:text-base space-y-1">
                  <li>Real-Time Monitoring</li>
                  <li>Rapid Response Strategies</li>
                  <li>Reputation Management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Features Section */}
      <section className="py-12 sm:py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
              Key Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Unlock the Power of AI for Your Communications
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Our platform is packed with features designed to give you a competitive edge in today's
              fast-paced financial markets.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="p-6">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-highlight-blue mb-4" />
                <CardTitle className="text-lg sm:text-xl mb-2">AI-Powered Analytics</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Sentiment analysis, competitor tracking, and performance metrics.
                </CardDescription>
              </div>
              <CardContent className="pt-0">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Learn More
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
            <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="p-6">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-highlight-blue mb-4" />
                <CardTitle className="text-lg sm:text-xl mb-2">Compliance Support</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  SEC filing assistance, disclosure management, and regulatory guidance.
                </CardDescription>
              </div>
              <CardContent className="pt-0">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Explore Compliance
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
            <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="p-6">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-highlight-blue mb-4" />
                <CardTitle className="text-lg sm:text-xl mb-2">Predictive Insights</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Anticipate market trends and optimize communication timing.
                </CardDescription>
              </div>
              <CardContent className="pt-0">
                <Button variant="link" className="p-0 h-auto text-sm">
                  See Predictions
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Testimonials Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              What Our Clients Are Saying
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              See how AmplifiX has helped companies like yours achieve remarkable results.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic text-sm sm:text-base">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized FAQ Section */}
      <section className="py-12 sm:py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Everything You Need to Know About AmplifiX
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Get answers to the most common questions about our AI-powered investor relations and public relations services.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border rounded-lg px-4 sm:px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg font-semibold pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 sm:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/support">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized CTA Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            Ready to Get Started?
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Transform Your Investor Relations and PR Today
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
            Join the leading companies that are leveraging AI to amplify their brand and build stronger
            relationships with investors, media, and the public.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
