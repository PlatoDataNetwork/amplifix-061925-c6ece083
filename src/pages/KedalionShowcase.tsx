import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Shield, Coins, Lock, TrendingUp, Globe, Play, X } from "lucide-react";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useState } from "react";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const KedalionShowcase = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  useGTranslateRefresh(true);

  return (
    <>
      <Helmet>
        <title>Kedalion - Tokenized In-Ground Gold & Silver | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="Kedalion gives you tokenized access to verified in-ground gold and silver — before mining begins. 43-101 regulated resources with direct asset ownership." 
        />
        <meta 
          name="keywords" 
          content="Kedalion, tokenized gold, tokenized silver, in-ground resources, blockchain, precious metals, 43-101 regulated, asset tokenization" 
        />
        <meta property="og:title" content="Kedalion - Tokenized In-Ground Gold & Silver | AmplifiX" />
        <meta 
          property="og:description" 
          content="Own tokenized access to verified in-ground gold and silver before mining begins. Fully on-chain and auditable." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/lovable-uploads/kedalion-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kedalion - Tokenized In-Ground Gold & Silver" />
        <meta 
          name="twitter:description" 
          content="Own tokenized access to verified in-ground gold and silver before mining begins." 
        />
        <link rel="preload" as="image" href="/lovable-uploads/kedalion-icon.png" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-amber-500/5">
        <MainHeader />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-12 md:py-20 px-4 overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-block">
                    <img 
                      src="/lovable-uploads/kedalion-icon.png" 
                      alt="Kedalion Logo" 
                      className="h-24 md:h-32 w-auto"
                    />
                  </div>
                  <div>
                    <p className="text-amber-500 font-semibold mb-2 text-sm md:text-base">Tokenized Precious Metals</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 pb-2 md:pb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Own In-Ground Gold Before It's Mined
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground">
                      Kedalion gives you tokenized access to<br />
                      verified in-ground gold and silver — before<br />
                      mining begins.
                    </p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-2xl blur-xl" />
                    <div className="relative rounded-2xl shadow-2xl w-full bg-black/90 p-8 border border-amber-500/20">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-amber-500" />
                          </div>
                          <span className="text-white font-medium">43-101 Regulated Resources</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                          </div>
                          <span className="text-white font-medium">Alpha Stage Access</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-500" />
                          </div>
                          <span className="text-white font-medium">Direct Asset Ownership</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-amber-500" />
                          </div>
                          <span className="text-white font-medium">Fully On-Chain & Auditable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row gap-3 pt-4">
                    <Button asChild size="default" className="gap-2 bg-amber-500 text-black hover:bg-amber-600">
                      <a href="https://dev.kedalion.io/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                    <Button size="default" className="gap-2 bg-amber-500 text-black hover:bg-amber-600" onClick={() => setIsVideoPlaying(true)}>
                      <Play className="w-4 h-4" />
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  The Future of Precious Metal Ownership
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Access regulated in-ground resources through blockchain technology
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <Card className="bg-transparent border-amber-500/30 hover:border-amber-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                      <Coins className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Tokenized Resources</h3>
                    <p className="text-muted-foreground">
                      Own verified in-ground gold and silver through secure blockchain tokenization before mining operations begin.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-amber-500/30 hover:border-amber-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">43-101 Compliance</h3>
                    <p className="text-muted-foreground">
                      All resources are verified and regulated under the stringent 43-101 mineral reporting standard.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-amber-500/30 hover:border-amber-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Direct Ownership</h3>
                    <p className="text-muted-foreground">
                      True asset ownership with transparent, auditable records fully stored on-chain.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose Kedalion */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Why Choose Kedalion
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Revolutionary access to precious metal resources through blockchain innovation
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-amber-500/30">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                    <Coins className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-semibold">Pre-Mining Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Unique opportunity to own resources before extraction begins
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-amber-500/30">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-semibold">Regulated Standards</h3>
                  <p className="text-sm text-muted-foreground">
                    Full compliance with international 43-101 mineral reporting requirements
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-amber-500/30">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-semibold">Blockchain Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Fully on-chain records providing transparent and auditable ownership
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-amber-500/30">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-semibold">Alpha Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Early-stage opportunities in the tokenized precious metals space
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-amber-500/10 to-transparent">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Own In-Ground Gold?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Join the waitlist for early access to tokenized precious metals
              </p>
              <Button asChild size="lg" className="gap-2 bg-amber-500 text-black hover:bg-amber-600">
                <a href="https://dev.kedalion.io/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5" />
                  Get Early Access
                </a>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="relative w-full max-w-5xl aspect-video">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
              onClick={() => setIsVideoPlaying(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            <video
              className="w-full h-full rounded-lg"
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            >
              <source src="/lovable-uploads/kedalion-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default KedalionShowcase;
