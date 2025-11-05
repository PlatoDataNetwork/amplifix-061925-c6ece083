import { Button } from "@/components/ui/button";
import { useJsonData } from "@/hooks/useJsonData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface NewsletterData {
  newsletter: {
    title: string;
    description: string;
    email_placeholder: string;
    button_text: string;
    privacy_text: string;
  };
}

// Security: Email validation schema
const newsletterSchema = z.object({
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
});

const NewsletterSignup = () => {
  const { data } = useJsonData<NewsletterData>('newsletter.json');
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Security: Validate email input
      const validatedData = newsletterSchema.parse({ email });
      
      setIsSubmitting(true);
      
      // TODO: Implement newsletter subscription logic
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Email",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-12 md:mb-16">
      <div className="bg-card p-6 md:p-8 rounded-xl border border-border text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {data?.newsletter.title || 'Stay Updated'}
        </h2>
        <p className="text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
          {data?.newsletter.description || 'Subscribe to our Intel newsletter and never miss important updates about AI intelligence, new features, and industry insights.'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data?.newsletter.email_placeholder || 'Enter your email'}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-sm md:text-base text-foreground placeholder:text-muted-foreground"
            required
          />
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] px-6 md:px-8 text-sm md:text-base disabled:opacity-50"
          >
            {isSubmitting ? "Subscribing..." : (data?.newsletter.button_text || 'Subscribe')}
          </Button>
        </form>
        <p className="text-muted-foreground text-xs md:text-sm mt-4">
          {data?.newsletter.privacy_text || 'No spam, unsubscribe anytime. Read our privacy policy.'}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
