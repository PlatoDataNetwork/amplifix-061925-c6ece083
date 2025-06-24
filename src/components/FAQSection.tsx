
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  return (
    <section id="faq" className="container mx-auto py-16 px-4">
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
  );
};

export default FAQSection;
