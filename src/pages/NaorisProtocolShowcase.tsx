import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Shield, Network, Globe, Zap, FileText, ArrowLeftRight, Code, Award, CheckCircle, Lock, Cpu, Users, Building, Target, Sparkles } from "lucide-react";

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

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div>
                  <img 
                    src="/lovable-uploads/naoris-logo-updated.png" 
                    alt="Naoris Protocol" 
                    className="w-auto mb-6"
                    style={{ height: 'auto', maxWidth: '120%' }}
                  />
                  <p className="text-xl text-muted-foreground mb-8">
                    Decentralized Post-Quantum Infrastructure
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="gap-2 bg-[#00FFB2] text-black hover:bg-[#00E5A0] border-[#00FFB2]">
                    <a href="https://coinmarketcap.com/currencies/naoris-protocol/" target="_blank" rel="noopener noreferrer">
                      <TrendingUp className="w-4 h-4" />
                      Live Token Price
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 hover:bg-[#00FFB2] hover:text-black hover:border-[#00FFB2] transition-colors">
                    <a href="https://www.naorisprotocol.com/whitepapers" target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4" />
                      White Papers
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 hover:bg-[#00FFB2] hover:text-black hover:border-[#00FFB2] transition-colors">
                    <a href="https://www.naorisprotocol.com/exchanges" target="_blank" rel="noopener noreferrer">
                      <ArrowLeftRight className="w-4 h-4" />
                      Exchanges
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 hover:bg-[#00FFB2] hover:text-black hover:border-[#00FFB2] transition-colors">
                    <a href="https://knowledgebase.naorisprotocol.com/naoris-protocol/" target="_blank" rel="noopener noreferrer">
                      <Code className="w-4 h-4" />
                      Developer
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 hover:bg-[#00FFB2] hover:text-black hover:border-[#00FFB2] transition-colors">
                    <a href="https://www.naorisprotocol.com/about#awards" target="_blank" rel="noopener noreferrer">
                      <Award className="w-4 h-4" />
                      Awards
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 hover:bg-[#00FFB2] hover:text-black hover:border-[#00FFB2] transition-colors">
                    <a href="https://www.naorisprotocol.com/" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="gap-2 hover:bg-[#00FFB2] hover:text-black hover:border-[#00FFB2] transition-colors">
                    <a href="https://www.naorisprotocol.com/join-the-network#use-cases" target="_blank" rel="noopener noreferrer">
                      <Sparkles className="w-4 h-4" />
                      Use Cases
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <div className="bg-gradient-to-br from-[#00FFB2]/20 to-primary/20 rounded-2xl p-4 border border-border max-w-md">
                  <a 
                    href="https://naorisprotocol.network/testnet#how-it-works" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img 
                      src="/lovable-uploads/naoris-testnet-hero.png" 
                      alt="Post-Quantum DePIN Testnet - Secure The Future"
                      className="relative w-full rounded-lg"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Revolutionizing Cybersecurity</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                A decentralized cybersecurity platform leveraging blockchain technology to create a distributed, validator-based security mesh network
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Building className="h-12 w-12 text-[#00FFB2] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Foundation</h3>
                <p className="text-muted-foreground">
                  Built on blockchain technology to provide transparent, immutable security infrastructure for modern enterprises and decentralized networks.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  To create a distributed, validator-based security mesh network that protects digital assets across blockchain ecosystems.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Globe className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Vision</h3>
                <p className="text-muted-foreground">
                  To transform cybersecurity through decentralized post-quantum infrastructure that scales globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* $NAORIS Token Section */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">$NAORIS Proof of Trust Economy</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                The native utility token powering the Naoris Protocol network through decentralized Proof of Security consensus, enabling real-time security validations across disparate ecosystems.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#00FFB2]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-8 w-8 text-[#00FFB2]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Network Utility</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Validates security across ecosystems, transferring value between devices in real-time. The token serves as the backbone of the decentralized validation network.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#00FFB2]/10 text-[#00FFB2] px-3 py-1 rounded-full text-sm">Real-Time Validation</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Cross-Ecosystem</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Trusted Validations</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Devices earn tokens for secure validations as network value grows with participation. The dPoSec consensus mechanism ensures trust through millisecond validation speed.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm">dPoSec Consensus</span>
                      <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm">Device Rewards</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Network className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Secure Mesh Network</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Transforms devices into cyber-secure validator nodes with millisecond validation speed. Creates an always-on record of device validations immutably secured on-chain.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-sm">Validator Nodes</span>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">On-Chain Security</span>
                      <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-sm">Distributed Protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
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

        {/* Key Features */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Competitive Advantages</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Naoris Protocol's unique approach combines blockchain security with distributed validation to create resilient cybersecurity infrastructure.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-[#00FFB2] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Decentralized Validation</h3>
                    <p className="text-muted-foreground">
                      Distributed validator network ensuring comprehensive security coverage across multiple blockchain ecosystems and networks.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Post-Quantum Security</h3>
                    <p className="text-muted-foreground">
                      Future-proof infrastructure designed to withstand emerging quantum computing threats through advanced cryptographic techniques.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Real-Time Protection</h3>
                    <p className="text-muted-foreground">
                      Millisecond validation speed enables instant threat detection and response across the entire security mesh network.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">DeFi Security Focus</h3>
                    <p className="text-muted-foreground">
                      Specialized security solutions designed for the decentralized finance ecosystem and digital asset protection.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Blockchain Integration</h3>
                    <p className="text-muted-foreground">
                      Seamless integration with existing blockchain infrastructure for transparent, immutable security records.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Scalable Architecture</h3>
                    <p className="text-muted-foreground">
                      Built to scale from individual devices to enterprise-level deployments without compromising security or performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Highlights */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Platform Highlights</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Naoris Protocol represents the future of cybersecurity through innovative blockchain-based distributed protection mechanisms.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <TrendingUp className="h-12 w-12 text-[#00FFB2] mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Live Trading</h3>
                <p className="text-muted-foreground text-sm">
                  $NAORIS token actively traded on major cryptocurrency exchanges
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Cpu className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Pioneering post-quantum decentralized infrastructure for modern security needs
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Recognition</h3>
                <p className="text-muted-foreground text-sm">
                  Award-winning platform recognized for innovation in cybersecurity
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Community</h3>
                <p className="text-muted-foreground text-sm">
                  Growing ecosystem of validators and security-focused participants
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 p-12 rounded-2xl bg-gradient-to-br from-[#00FFB2]/10 via-primary/5 to-transparent border border-border">
              <h2 className="text-4xl font-bold">
                Discover Decentralized Cybersecurity
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn how Naoris Protocol is transforming cybersecurity through blockchain technology and distributed validator networks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact">
                  <Button size="lg" className="bg-[#00FFB2] text-black hover:bg-[#00E5A0]">
                    Partner with AmplifiX
                  </Button>
                </a>
                <a href="https://www.naorisprotocol.com/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Explore Naoris Protocol
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default NaorisProtocolShowcase;
