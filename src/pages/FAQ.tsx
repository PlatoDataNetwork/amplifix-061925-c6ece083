
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Frequently Asked <span className="text-highlight-blue">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions about AmplifiX and our AI-powered corporate communications solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                Amplifi Your Brand →
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
                Book A Demo
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-card p-6 rounded-xl border border-border">
              <AccordionTrigger className="text-left">
                What is AmplifiX and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                AmplifiX is an AI-powered corporate communications platform that helps companies create compelling content,
                manage investor relations, and amplify their message across multiple channels. Our platform uses advanced
                AI technology to generate high-quality press releases, investor updates, and other corporate communications
                materials tailored to your company's unique voice and objectives.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card p-6 rounded-xl border border-border">
              <AccordionTrigger className="text-left">
                Who can benefit from using AmplifiX?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                AmplifiX is designed for companies at all stages - from private companies preparing for fundraising
                to public companies managing ongoing investor relations. Our solutions are particularly valuable for
                companies preparing for IPOs, seeking to raise capital, or looking to improve their corporate
                communications strategy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card p-6 rounded-xl border border-border">
              <AccordionTrigger className="text-left">
                How does AmplifiX ensure content quality and compliance?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our AI technology is trained on best practices in corporate communications and is regularly updated
                to reflect current regulatory requirements and industry standards. All content is generated with
                compliance in mind, and we recommend review by your legal and communications teams before publication.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card p-6 rounded-xl border border-border">
              <AccordionTrigger className="text-left">
                What types of content can AmplifiX help create?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                AmplifiX can help create a wide range of corporate communications materials including press releases,
                investor presentations, quarterly earnings materials, IPO documentation support, fundraising materials,
                corporate fact sheets, and ongoing investor relations content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card p-6 rounded-xl border border-border">
              <AccordionTrigger className="text-left">
                How do I get started with AmplifiX?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Getting started is easy. Contact our team to schedule a consultation where we'll assess your
                communications needs and demonstrate how AmplifiX can help amplify your company's message.
                We'll work with you to develop a customized solution that fits your specific requirements and objectives.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-card p-6 rounded-xl border border-border">
              <AccordionTrigger className="text-left">
                What makes AmplifiX different from other communication platforms?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                AmplifiX combines advanced AI technology with deep expertise in corporate communications and investor
                relations. Our platform is specifically designed for corporate use cases and generates content that
                meets the high standards required for public company communications. We focus on quality, compliance,
                and strategic messaging rather than generic content creation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
