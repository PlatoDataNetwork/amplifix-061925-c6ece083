import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Gamepad2, Cpu, Blocks, Globe, Zap, Sparkles, Smartphone, Trophy, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const MobileGlobalEsportsShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>Mobile Global Esports - AI & Blockchain Gaming | AmplifiX</title>
        <meta name="description" content="Mobile Global eSPORTS is a next-generation digital technology and entertainment company leveraging AI, blockchain, AR, and real-time platforms. Powered by PUHZL AI engine." />
        <meta name="keywords" content="Mobile Global Esports, MGAM, gaming, esports, PUHZL, AI gaming, blockchain gaming, mobile games" />
        <meta property="og:title" content="Mobile Global Esports - Next-Gen Gaming Technology" />
        <meta property="og:description" content="AI-powered gaming platform with PUHZL engine for digital games and immersive experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/mobile-global-esports" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mobile Global Esports - MGAM" />
        <meta name="twitter:description" content="Next-generation gaming with AI, blockchain, and AR technologies." />
        <link rel="canonical" href="https://amplifix.ai/showcase/mobile-global-esports" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <Gamepad2 className="h-6 w-6 text-highlight-blue" />
                <span className="text-highlight-blue font-semibold">OTC:MGAM</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Gaming & Entertainment Technology</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Mobile Global eSPORTS
                  <span className="text-highlight-blue block">Next-Gen Digital Entertainment</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                A next-generation digital technology and entertainment company leveraging AI, blockchain, AR, and 
                real-time platforms. Powered by their proprietary PUHZL AI engine for digital games and experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://mobileglobal.us/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=MGAM+Gaming+Esports" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">AI</div>
                  <p className="text-muted-foreground text-sm">PUHZL Engine</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">AR</div>
                  <p className="text-muted-foreground text-sm">Augmented Reality</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">Web3</div>
                  <p className="text-muted-foreground text-sm">Blockchain Gaming</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">ESports</div>
                  <p className="text-muted-foreground text-sm">Competitive Gaming</p>
                </div>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Sparkles className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">PUHZL AI Engine</h3>
                  <p className="text-muted-foreground text-sm mt-2">Proprietary AI powering dynamic gaming experiences</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Blocks className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Blockchain Integration</h3>
                  <p className="text-muted-foreground text-sm mt-2">Digital assets and decentralized gaming infrastructure</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Globe className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Real-Time Platforms</h3>
                  <p className="text-muted-foreground text-sm mt-2">Live multiplayer and streaming capabilities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Cutting-Edge Technology Stack</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Integrated technologies creating immersive gaming experiences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <Cpu className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Artificial Intelligence</h3>
                  <p className="text-muted-foreground">
                    The PUHZL AI engine drives adaptive gameplay, intelligent NPCs, and personalized 
                    gaming experiences that evolve with player behavior and preferences.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Blocks className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Blockchain Technology</h3>
                  <p className="text-muted-foreground">
                    Secure digital asset ownership, play-to-earn mechanics, and decentralized gaming 
                    economies powered by blockchain infrastructure.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Smartphone className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Augmented Reality</h3>
                  <p className="text-muted-foreground">
                    AR-enabled experiences that blend digital gaming elements with the real world, 
                    creating immersive entertainment beyond traditional screens.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Globe className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Real-Time Platforms</h3>
                  <p className="text-muted-foreground">
                    Low-latency multiplayer infrastructure supporting competitive esports, live streaming, 
                    and global gaming communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gaming Ecosystem Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Gaming Ecosystem</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  End-to-end solutions for players, developers, and esports organizations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Digital Games</h3>
                  <p className="text-muted-foreground">
                    Original titles and game development powered by PUHZL technology
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Esports</h3>
                  <p className="text-muted-foreground">
                    Competitive gaming platforms and tournament infrastructure
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Entertainment</h3>
                  <p className="text-muted-foreground">
                    Immersive digital experiences beyond traditional gaming
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community</h3>
                  <p className="text-muted-foreground">
                    Global gaming communities connected through shared experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-[hsl(220,20%,20%)] to-[hsl(220,15%,35%)]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                The Future of Gaming is Here
              </h2>
              <p className="text-xl mb-8 text-muted-foreground">
                Mobile Global eSPORTS is redefining digital entertainment with AI-powered games, 
                blockchain integration, and immersive augmented reality experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[hsl(220,20%,15%)] hover:bg-[hsl(220,20%,20%)] text-white border border-white/20">
                  <a href="https://mobileglobal.us/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Explore Platform
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-foreground hover:bg-white/10">
                  <LanguageAwareLink to="/contact" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Partner With Us
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Showcase */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <LanguageAwareLink to="/showcase" className="text-highlight-blue hover:underline inline-flex items-center gap-2">
              ← Back to All Showcases
            </LanguageAwareLink>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default MobileGlobalEsportsShowcase;
