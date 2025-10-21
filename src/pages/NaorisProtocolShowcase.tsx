import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Shield, Cpu, Network, Lock, Globe, Zap } from "lucide-react";

const NaorisProtocolShowcase = () => {
  return (
    <>
      <Helmet>
        <title>Naoris Protocol - Decentralized Cybersecurity Platform | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="Discover how Naoris Protocol leverages blockchain technology to create a distributed, validator-based security mesh network revolutionizing cybersecurity." 
        />
        <meta 
          name="keywords" 
          content="Naoris Protocol, blockchain security, decentralized cybersecurity, validator network, DeFi security, distributed security mesh" 
        />
        <meta property="og:title" content="Naoris Protocol - Decentralized Cybersecurity | AmplifiX" />
        <meta 
          property="og:description" 
          content="Explore Naoris Protocol's innovative blockchain-based cybersecurity platform for distributed protection." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Naoris Protocol - Decentralized Cybersecurity Platform" />
        <meta 
          name="twitter:description" 
          content="Revolutionary blockchain technology for distributed cybersecurity protection." 
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
                  <div>
                    <img 
                      src="/lovable-uploads/naoris-logo.png" 
                      alt="Naoris Protocol" 
                      className="h-24 w-auto mb-6"
                    />
                    <p className="text-xl text-muted-foreground">
                      Decentralized Post-Quantum Infrastructure
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="gap-2">
                      <a href="https://coinmarketcap.com/currencies/naoris-protocol/" target="_blank" rel="noopener noreferrer">
                        <TrendingUp className="w-4 h-4" />
                        Live Token Price
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="https://www.naorisprotocol.com/naoris-token" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Token
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="https://www.naorisprotocol.com/" target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
                  <img 
                    src="/lovable-uploads/naoris-hero-new.png" 
                    alt="Decentralized Post-Quantum Infrastructure"
                    className="relative rounded-2xl shadow-2xl w-full scale-110 md:scale-125"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* $NAORIS Token Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  $NAORIS Proof of Trust Economy
                </h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                  The native utility token powering the Naoris Protocol network and ecosystem through decentralized Proof of Security consensus
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Utility</h3>
                    <p className="text-muted-foreground text-sm">
                      Validates security across ecosystems, transferring value between devices in real-time
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Trusted Validations</h3>
                    <p className="text-muted-foreground text-sm">
                      Devices earn tokens for secure validations as network value grows with participation
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <Network className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Secure Mesh</h3>
                    <p className="text-muted-foreground text-sm">
                      Transforms devices into cyber-secure validator nodes with millisecond validation speed
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Incentivized</h3>
                    <p className="text-muted-foreground text-sm">
                      Rewards users for contributing to secure, risk and reward-based infrastructure
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Under the dPoSec consensus mechanism, $NAORIS provides an always-on record of device validations that ensures trust and security across disparate networks, with results immutably secured on-chain.
                </p>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href="https://knowledgebase.naorisprotocol.com/naoris-protocol/introduction/what-is-the-usdnaoris-token-used-for" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Learn More About $NAORIS
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Revolutionizing Cybersecurity
                </h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                  A decentralized cybersecurity platform leveraging blockchain technology to create a distributed, validator-based security mesh network
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Distributed Security</h3>
                    <p className="text-muted-foreground">
                      Validator-based security mesh network providing comprehensive protection across distributed systems.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Network className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Blockchain Technology</h3>
                    <p className="text-muted-foreground">
                      Leveraging blockchain to create transparent, immutable security infrastructure for modern enterprises.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">DeFi Security</h3>
                    <p className="text-muted-foreground">
                      Specialized security solutions designed for the decentralized finance ecosystem and digital assets.
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
                    Validator-Based Protection
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Distributed security mesh network powered by decentralized validators
                  </p>
                  <p className="text-muted-foreground">
                    Naoris Protocol creates a resilient cybersecurity infrastructure through a network of validators that continuously monitor, verify, and protect digital assets across blockchain ecosystems.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Shield className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Decentralized Validation</h4>
                        <p className="text-sm text-muted-foreground">
                          Distributed validator network ensuring comprehensive security coverage
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Network className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Security Mesh Network</h4>
                        <p className="text-sm text-muted-foreground">
                          Interconnected protection layer spanning multiple blockchain networks
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
                            <Shield className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Secure</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Network className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Distributed</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Protected</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Naoris Protocol */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Choose Naoris Protocol
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leading the future of decentralized cybersecurity with innovative blockchain technology
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Network className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Decentralized</h3>
                  <p className="text-sm text-muted-foreground">
                    Distributed validator network eliminating single points of failure
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Blockchain-powered security ensuring immutable protection
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Innovative</h3>
                  <p className="text-sm text-muted-foreground">
                    Cutting-edge technology addressing modern security challenges
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Global Network</h3>
                  <p className="text-sm text-muted-foreground">
                    Worldwide validator mesh providing universal protection
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
                  Discover Decentralized Cybersecurity
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Learn how Naoris Protocol is transforming cybersecurity through blockchain technology and distributed validator networks.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="gap-2">
                    <a href="/contact">
                      Partner with AmplifiX
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <a href="https://www.naorisprotocol.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Explore Naoris Protocol
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

export default NaorisProtocolShowcase;
