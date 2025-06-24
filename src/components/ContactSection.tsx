
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="container mx-auto py-16 px-4">
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
  );
};

export default ContactSection;
