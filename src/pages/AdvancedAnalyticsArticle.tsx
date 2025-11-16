import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useJsonData } from "@/hooks/useJsonData";

const AdvancedAnalyticsArticle = () => {
  const { data: blogData } = useJsonData<any>('blog.json');
  const navigate = useNavigate();
  
  const handleTagClick = (tag: string) => {
    navigate(`/intel?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      <Helmet>
        <title>Advanced Analytics for Better Decision Making | AmplifiX</title>
        <meta name="description" content="A comprehensive guide to how AmplifiX empowers companies with data-driven insights." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <MainHeader />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <LanguageAwareLink to="/intel">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Intel
              </Button>
            </LanguageAwareLink>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">Analytics</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Advanced Analytics for Better Decision Making
            </h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">AmplifiX</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sept 1, 2025</span>
              </div>
            </div>
          </div>
          
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl text-muted-foreground mb-8">
              In today's fast-paced business environment, corporate communications have become more complex and high-stakes than ever before. Companies are expected to engage transparently with investors, regulators, employees, and the public—while navigating an overwhelming flow of information.
            </p>
            
            <p className="mb-6">
              This is where advanced analytics powered by artificial intelligence (AI) is transforming the way organizations make decisions and tell their story.
            </p>
            
            <p className="mb-6">
              AI-driven analytics enable companies to move beyond surface-level reporting by uncovering patterns, correlations, and insights hidden in massive data sets. From market sentiment and competitor activity to regulatory developments and investor behavior, AI systems can synthesize vast amounts of information in real time, giving leaders the clarity they need to act decisively.
            </p>
            
            <p className="mb-6">
              For corporate communications teams, advanced analytics provides an unmatched ability to measure the impact of messaging across multiple channels. AI can evaluate how press releases, earnings calls, or public statements resonate with stakeholders and highlight where adjustments are needed. This not only ensures consistency but also builds credibility by aligning communications with market expectations.
            </p>
            
            <p className="mb-6">
              Another critical advantage is predictive intelligence. By tracking historical trends and real-time signals, AI can anticipate market reactions, identify reputational risks, and even forecast stakeholder concerns before they emerge. This empowers companies to be proactive—responding to challenges with agility instead of being caught off guard.
            </p>
            
            <p className="mb-6">
              Moreover, advanced analytics supports compliance and governance. Automated monitoring ensures that disclosures meet regulatory standards, reducing errors and protecting against potential liabilities. At the same time, robust security frameworks safeguard sensitive data, maintaining trust across stakeholders.
            </p>
            
            <p className="mb-6">
              Ultimately, advanced analytics is redefining decision-making in corporate communications. By transforming raw data into actionable intelligence, AI equips organizations to communicate with precision, strengthen stakeholder relationships, and create long-term strategic value. In the era of data-driven business, the companies that harness advanced analytics will lead with both confidence and credibility.
            </p>
          </article>
          
          {/* Popular Tags Section */}
          {blogData?.blog?.popular_tags && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">{blogData.blog.popular_tags.title}</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.blog.popular_tags.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t border-border">
            <LanguageAwareLink to="/intel">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Articles
              </Button>
            </LanguageAwareLink>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AdvancedAnalyticsArticle;