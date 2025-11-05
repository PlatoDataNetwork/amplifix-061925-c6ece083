import { Button } from "@/components/ui/button";
import { useJsonData } from "@/hooks/useJsonData";

interface NewsletterData {
  newsletter: {
    title: string;
    description: string;
    email_placeholder: string;
    button_text: string;
    privacy_text: string;
  };
}

const NewsletterSignup = () => {
  const { data } = useJsonData<NewsletterData>('newsletter.json');

  return (
    <section className="mb-12 md:mb-16">
      <div className="bg-card p-6 md:p-8 rounded-xl border border-border text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {data?.newsletter.title || 'Stay Updated'}
        </h2>
        <p className="text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
          {data?.newsletter.description || 'Subscribe to our Intel newsletter and never miss important updates about AI intelligence, new features, and industry insights.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder={data?.newsletter.email_placeholder || 'Enter your email'}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-sm md:text-base text-foreground placeholder:text-muted-foreground"
          />
          <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] px-6 md:px-8 text-sm md:text-base">
            {data?.newsletter.button_text || 'Subscribe'}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mt-4">
          {data?.newsletter.privacy_text || 'No spam, unsubscribe anytime. Read our privacy policy.'}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
