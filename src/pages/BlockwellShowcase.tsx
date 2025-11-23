import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Shield, Blocks, Brain, Network, Lock, CheckCircle, Server, Globe, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import thumbnailImage from "/lovable-uploads/blockwell-thumbnail.png";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const BlockwellShowcase = () => {
  useGTranslateRefresh(true);
  return (
    <>
      <Helmet>
        <title>Blockwell - AI-Powered Blockchain & Cybersecurity Solutions | AmplifiX Showcase</title>
        <meta name="description" content="Discover how Blockwell is revolutionizing blockchain technology with AI-powered cybersecurity solutions and decentralized systems for secure digital infrastructure." />
        <meta name="keywords" content="Blockwell, blockchain technology, AI cybersecurity, decentralized systems, blockchain security, crypto security, distributed ledger, smart contracts, blockchain AI" />
        <meta property="og:title" content="Blockwell - AI-Powered Blockchain & Cybersecurity" />
        <meta property="og:description" content="Leading blockchain technology company specializing in AI-powered cybersecurity solutions and decentralized systems." />
        <meta property="og:image" content={thumbnailImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/blockwell" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blockwell - Next-Gen Blockchain Solutions" />
        <meta name="twitter:description" content="AI-powered blockchain infrastructure and cybersecurity for the decentralized future." />
        <meta name="twitter:image" content={thumbnailImage} />
        <link rel="canonical" href="https://amplifix.ai/showcase/blockwell" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-4 py-2 border border-highlight-blue/20 text-sm font-medium">
                    Private Blockchain & AI Company
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-highlight-blue">Blockwell</span><br />
                  Secure Blockchain Infrastructure
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Pioneering blockchain technology company specializing in AI-powered cybersecurity solutions and decentralized systems for the next generation of digital infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://blockwell.ai" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://www.bing.com/copilotsearch?q=Blockwell%20Blockchain%20Crypto&FORM=CSSCOP" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      AmplifiX Search
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={thumbnailImage}
                  alt="Blockwell Blockchain Technology"
                  className="w-full rounded-lg shadow-2xl border border-border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Blockwell</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Brain className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">AI-Powered Security</h3>
                  <p className="text-muted-foreground">
                    Advanced artificial intelligence and machine learning algorithms protect blockchain networks from emerging threats and vulnerabilities in real-time.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Blocks className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Blockchain Infrastructure</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade blockchain solutions with distributed ledger technology, smart contracts, and decentralized applications for secure digital transformation.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Shield className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Cybersecurity Excellence</h3>
                  <p className="text-muted-foreground">
                    Multi-layered security protocols, encryption standards, and threat detection systems ensure the highest level of protection for digital assets.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Network className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Decentralized Systems</h3>
                  <p className="text-muted-foreground">
                    Building trustless, transparent, and resilient distributed networks that eliminate single points of failure and maximize system reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Technologies */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Core Technologies</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Advanced Encryption</h3>
                    <p className="text-muted-foreground">
                      Military-grade encryption and cryptographic protocols protect data integrity and ensure secure transactions across the blockchain network.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Machine Learning Detection</h3>
                    <p className="text-muted-foreground">
                      AI-driven threat detection and anomaly identification systems continuously monitor and protect against sophisticated cyber attacks.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Server className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Distributed Architecture</h3>
                    <p className="text-muted-foreground">
                      Scalable, fault-tolerant infrastructure designed to handle enterprise workloads while maintaining decentralization and security.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">High Performance</h3>
                    <p className="text-muted-foreground">
                      Optimized consensus mechanisms and layer-2 solutions deliver lightning-fast transaction speeds without compromising security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Enterprise Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Globe className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Financial Services</h3>
                  <p className="text-muted-foreground">
                    Secure payment processing, digital asset custody, and DeFi infrastructure
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Shield className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Supply Chain</h3>
                  <p className="text-muted-foreground">
                    End-to-end transparency and traceability with immutable audit trails
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <CheckCircle className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Identity Management</h3>
                  <p className="text-muted-foreground">
                    Decentralized identity solutions with privacy-preserving verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Blockchain Revolution</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Partner with Blockwell to build secure, scalable, and innovative blockchain solutions for your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://blockwell.ai" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="https://www.bing.com/copilotsearch?q=Blockwell%20Blockchain%20Crypto&FORM=CSSCOP" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                    Explore with AmplifiX
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Showcase */}
        <div className="py-12 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <LanguageAwareLink to="/showcase">
              <Button variant="outline" size="lg">
                ← Back to Showcase
              </Button>
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockwellShowcase;
