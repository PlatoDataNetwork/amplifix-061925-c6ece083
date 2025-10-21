import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Wallet, Cpu, Layers, Zap, Globe } from "lucide-react";

const AbatisShowcase = () => {
  return (
    <>
      <Helmet>
        <title>Abatis - Blockchain Digital Asset Platform | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="Discover how Abatis leverages blockchain technology for innovative digital asset management and cryptocurrency solutions." 
        />
        <meta 
          name="keywords" 
          content="Abatis, blockchain platform, digital assets, cryptocurrency, crypto management, decentralized finance" 
        />
        <meta property="og:title" content="Abatis - Blockchain Digital Asset Platform | AmplifiX" />
        <meta 
          property="og:description" 
          content="Explore Abatis' innovative blockchain-based platform for digital asset management and cryptocurrency solutions." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Abatis - Blockchain Digital Asset Platform" />
        <meta 
          name="twitter:description" 
          content="Revolutionary blockchain technology for digital asset management and cryptocurrency solutions." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <MainHeader />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 px-4 overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-transparent border-2 border-highlight-blue">
                    <span className="text-highlight-blue text-4xl font-bold">A</span>
                  </div>
                  <div>
                    <p className="text-primary font-semibold mb-2">Cryptocurrency</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 md:pb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Abatis
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Innovative blockchain solutions for digital asset management
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="gap-2">
                      <a href="https://abatisabtu.com" target="_blank" rel="noopener noreferrer">
                        <TrendingUp className="w-4 h-4" />
                        Live Token Price
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="https://abatisabtu.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
                  <div className="relative rounded-2xl shadow-2xl w-full p-12 bg-card border border-primary/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Wallet className="w-24 h-24 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Next-Generation Digital Assets
                </h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                  A blockchain-based platform focused on digital asset management and innovative cryptocurrency solutions
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Asset Management</h3>
                    <p className="text-muted-foreground">
                      Comprehensive digital asset management solutions built on secure blockchain infrastructure.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Blockchain Technology</h3>
                    <p className="text-muted-foreground">
                      Leveraging cutting-edge blockchain technology to provide secure and transparent digital solutions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Cryptocurrency Solutions</h3>
                    <p className="text-muted-foreground">
                      Innovative cryptocurrency solutions designed for the evolving digital economy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Blockchain-Powered Platform
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Advanced technology for secure digital asset management
                  </p>
                  <p className="text-muted-foreground">
                    Abatis provides a comprehensive blockchain-based platform that enables efficient management of digital assets and cryptocurrency operations with enhanced security and transparency.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Wallet className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Digital Asset Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Secure storage and management of digital assets on blockchain infrastructure
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Layers className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Scalable Solutions</h4>
                        <p className="text-sm text-muted-foreground">
                          Built to scale with growing demands of the digital asset ecosystem
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
                  <Card className="relative border-primary/20">
                    <CardContent className="p-12">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Wallet className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Manage</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Layers className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Scale</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Innovate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Abatis */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Choose Abatis
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leading blockchain innovation in digital asset management and cryptocurrency solutions
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Secure Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Blockchain-powered security for digital asset protection
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Scalable</h3>
                  <p className="text-sm text-muted-foreground">
                    Infrastructure designed to grow with digital economy demands
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Innovative</h3>
                  <p className="text-sm text-muted-foreground">
                    Cutting-edge technology for next-generation crypto solutions
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Global Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Worldwide platform for digital asset management
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="space-y-6 p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Discover Blockchain Innovation
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Learn how Abatis is transforming digital asset management through innovative blockchain technology and cryptocurrency solutions.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="gap-2">
                    <a href="/contact">
                      Partner with AmplifiX
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <a href="https://abatisabtu.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Explore Abatis
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AbatisShowcase;
