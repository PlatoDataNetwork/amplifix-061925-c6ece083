
import { CheckCircle } from "lucide-react";

const SolutionsSection = () => {
  return (
    <section id="solutions" className="container mx-auto py-16 px-4">
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
  );
};

export default SolutionsSection;
