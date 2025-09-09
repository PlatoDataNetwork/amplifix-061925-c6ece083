import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useJsonData } from "@/hooks/useJsonData";

const AmplifiX2Article = () => {
  const { data: blogData } = useJsonData<any>('blog.json');
  const navigate = useNavigate();
  
  const handleTagClick = (tag: string) => {
    navigate(`/intel?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      <Helmet>
        <title>AmplifiX 2.0: Next-Gen AI Intelligence and PR Syndication | AmplifiX</title>
        <meta name="description" content="Discover AmplifiX 2.0's advanced AI capabilities, enhanced analytics, and revolutionary intelligence features for corporate communications." />
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
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">Featured</span>
              <span className="text-muted-foreground text-sm">Technology</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Introducing AmplifiX 2.0: Next-Gen AI Intelligence and PR Syndication
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
              We're excited to announce the launch of AmplifiX 2.0, a next-generation platform designed to redefine corporate communications through advanced AI intelligence and precision-driven PR syndication.
            </p>
            
            <p className="mb-6">
              Built for the evolving demands of public and private companies alike, AmplifiX 2.0 delivers a transformative suite of tools that empower organizations to connect, comply, and communicate with unprecedented clarity and impact.
            </p>
            
            <p className="mb-6">
              At its core, AmplifiX 2.0 introduces enhanced AI capabilities that streamline compliance, optimize investor relations, and amplify stakeholder engagement. From automated SEC filing support for 10-K, 10-Q, and 8-K documents to real-time market intelligence and sentiment tracking, the platform ensures companies stay ahead of regulatory and reputational challenges. Its earnings communications tools simplify call preparation, press release generation, and investor materials creation, while crisis management features enable rapid, AI-powered response protocols to safeguard trust during sensitive times.
            </p>
            
            <p className="mb-6">
              Beyond compliance, AmplifiX 2.0 reimagines how organizations scale communications. With AI-powered PR syndication, companies can seamlessly distribute narratives across global channels, ensuring consistent, impactful messaging. Its analyst relations capabilities provide deep insights into coverage and relationship optimization, helping organizations build stronger ties with the investment community.
            </p>
            
            <p className="mb-6">
              AmplifiX 2.0 also reflects a commitment to enterprise-grade reliability. Backed by SOC 2-compliant security, scalable cloud-native infrastructure, and 24/7 expert support, the platform offers institutional confidence while remaining adaptable to companies of every size. Whether preparing for an IPO, managing fundraising communications, or strengthening stakeholder trust, AmplifiX 2.0 is built to drive results.
            </p>
            
            <p className="mb-6">
              With a mission to revolutionize corporate storytelling and a vision to democratize access to sophisticated communication tools, AmplifiX 2.0 sets a new standard for transparency, innovation, and excellence. This release isn't just an upgrade—it's the future of corporate communications.
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

export default AmplifiX2Article;