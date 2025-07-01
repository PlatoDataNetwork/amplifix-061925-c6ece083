
import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  return (
    <section className="mb-12 md:mb-16">
      <div className="bg-[#121218] p-6 md:p-8 rounded-xl border border-gray-800 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
          Subscribe to our Intel newsletter and never miss important updates about AI intelligence, 
          new features, and industry insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#8A3FFC] focus:outline-none text-sm md:text-base"
          />
          <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] px-6 md:px-8 text-sm md:text-base">
            Subscribe
          </Button>
        </div>
        <p className="text-gray-400 text-xs md:text-sm mt-4">
          No spam, unsubscribe anytime. Read our privacy policy.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
