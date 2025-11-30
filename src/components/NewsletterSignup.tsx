import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useJsonData } from "@/hooks/useJsonData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useLocation } from "react-router-dom";

interface NewsletterData {
  newsletter: {
    title: string;
    description: string;
    email_placeholder: string;
    button_text: string;
    privacy_text: string;
  };
}

const emailSchema = z.string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

const NewsletterSignup = () => {
  const { data } = useJsonData<NewsletterData>('newsletter.json');
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Extract vertical slug from current path
  const getVerticalSlug = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const intelIndex = pathParts.indexOf("intel");
    if (intelIndex !== -1 && pathParts[intelIndex + 1]) {
      return pathParts[intelIndex + 1];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Invalid Email",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: validation.data,
          source: "website",
          vertical_slug: getVerticalSlug(),
          metadata: {
            subscribed_from: location.pathname,
            user_agent: navigator.userAgent,
          },
        });

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === "23505") {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail(""); // Clear the input
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
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
            disabled={isSubmitting}
            required
          />
          <Button 
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] px-6 md:px-8 text-sm md:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              data?.newsletter.button_text || 'Subscribe'
            )}
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
