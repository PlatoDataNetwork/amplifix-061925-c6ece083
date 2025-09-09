import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section - Updated with consistent mobile-responsive padding */}
      <div className="pt-24 container mx-auto py-12 md:py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Get in <span className="text-highlight-blue">Touch</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
            Ready to amplify your corporate communications? Let's discuss how AmplifiX can help
            your company achieve its communication and growth objectives.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john@company.com" />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <Input id="company" placeholder="Your Company Name" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your corporate communications needs..."
                    rows={6}
                  />
                </div>
                
                <Button className="w-full bg-highlight-blue text-white hover:bg-highlight-blue/90">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  We're here to help you amplify your corporate communications and achieve your business objectives.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-highlight-blue mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">hello@amplifix.ai</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-highlight-blue mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Office</h3>
                      <p className="text-muted-foreground">
                        9170 Glades Road<br />
                        Boca Raton, FL 33434
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="font-bold mb-3">Schedule a Consultation</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to see AmplifiX in action? Schedule a personalized demo to learn how we can
                  help amplify your corporate communications.
                </p>
                <Button variant="outline" className="w-full">
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
