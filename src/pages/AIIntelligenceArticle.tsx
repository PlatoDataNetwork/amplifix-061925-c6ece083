import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useJsonData } from "@/hooks/useJsonData";

const AIIntelligenceArticle = () => {
  const { data: blogData } = useJsonData<any>('blog.json');
  const navigate = useNavigate();
  
  const handleTagClick = (tag: string) => {
    navigate(`/intel?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      <Helmet>
        <title>The Future of AI-Powered Corporate Intelligence | AmplifiX</title>
        <meta name="description" content="Exploring how artificial intelligence is revolutionizing investor relations and corporate communications." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <MainHeader />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <Link to="/intel">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Intel
              </Button>
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">Technology</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Future of AI-Powered Corporate Intelligence
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
              Artificial intelligence (AI) is rapidly reshaping the landscape of corporate communications and investor relations. What was once a process defined by manual reporting, reactive crisis management, and static stakeholder engagement is evolving into a dynamic, data-driven ecosystem powered by next-generation AI intelligence.
            </p>
            
            <p className="mb-6">
              At the forefront of this transformation is the ability of AI to analyze massive volumes of data in real time, providing corporate leaders with actionable insights that drive smarter decisions. For investor relations teams, this means going beyond quarterly reporting. AI can detect market sentiment shifts, track competitor activity, and even anticipate investor behavior, equipping companies with the intelligence needed to communicate proactively rather than reactively.
            </p>
            
            <p className="mb-6">
              Corporate communications is also experiencing a paradigm shift. AI-powered platforms can now automate press release drafting, earnings call preparation, and compliance monitoring, reducing the burden on teams while ensuring accuracy and regulatory alignment. These tools not only improve efficiency but also help companies deliver consistent, transparent messaging that builds trust with investors, regulators, and the public.
            </p>
            
            <p className="mb-6">
              Crisis management is another area where AI is proving invaluable. With the ability to monitor sentiment across media and digital channels in real time, organizations can detect potential issues before they escalate. AI-driven response protocols allow companies to act quickly, safeguarding reputation and maintaining stakeholder confidence during critical moments.
            </p>
            
            <p className="mb-6">
              The future also lies in personalized engagement at scale. AI is enabling companies to tailor communications to different stakeholders—analysts, investors, regulators, or employees—ensuring that each group receives the information most relevant to them. This not only strengthens relationships but also enhances the impact of corporate storytelling.
            </p>
            
            <p className="mb-6">
              Security and compliance remain central to this future. AI-driven platforms are increasingly built with institutional-grade safeguards, ensuring sensitive data is protected while meeting complex regulatory requirements.
            </p>
            
            <p className="mb-6">
              Ultimately, the future of AI-powered corporate intelligence is about more than technology—it's about transformation. By merging advanced analytics with communication strategy, companies can navigate markets with confidence, anticipate challenges, and build deeper connections with their stakeholders. In this new era, corporate intelligence powered by AI isn't just a competitive advantage—it's fast becoming a necessity.
            </p>
          </article>
          
          {/* Popular Tags Section */}
          {blogData?.popular_tags && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">{blogData.popular_tags.title}</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.popular_tags.tags.map((tag: string, index: number) => (
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
            <Link to="/intel">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Articles
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AIIntelligenceArticle;