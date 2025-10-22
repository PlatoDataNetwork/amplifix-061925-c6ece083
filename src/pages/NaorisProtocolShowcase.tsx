import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Shield, Network, Globe, Zap, FileText, ArrowLeftRight, Code, Award, CheckCircle, Lock, Cpu, Users, Building, Target, Sparkles, Activity, Server, AlertCircle } from "lucide-react";

const NaorisProtocolShowcase = () => {
  return (
    <>
      <Helmet>
        <title>Naoris Protocol - Decentralized Post-Quantum Infrastructure | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="Discover Naoris Protocol's revolutionary post-quantum blockchain infrastructure securing Web3 and Web2 with decentralized validator-based security mesh network." 
        />
        <meta 
          name="keywords" 
          content="Naoris Protocol, post-quantum blockchain, decentralized cybersecurity, validator network, DeFi security, distributed security mesh, DePIN" 
        />
        <meta property="og:title" content="Naoris Protocol - First In-Production Post-Quantum Blockchain" />
        <meta 
          property="og:description" 
          content="World's first post-quantum DePIN testnet with 105M+ transactions, 3.3M+ wallets, and 583M+ threats mitigated." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Naoris Protocol - Post-Quantum Infrastructure" />
        <meta 
          name="twitter:description" 
          content="Revolutionary blockchain technology for post-quantum distributed cybersecurity protection." 
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
                    className="mb-6"
                    style={{ width: '120%', height: 'auto', maxWidth: 'none' }}
                  />
                  <p className="text-xl text-muted-foreground mb-2">
                    Decentralized Post-Quantum Infrastructure
                  </p>
                  <p className="text-lg text-[#00FFB2] font-semibold mb-8">
                    Trust & Security for Web3 & Web2
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
                    <a href="https://www.naorisprotocol.com/" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                      Website
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
                    <a href="https://www.naorisprotocol.com/join-the-network#use-cases" target="_blank" rel="noopener noreferrer">
                      <Sparkles className="w-4 h-4" />
                      Use Cases
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <div className="bg-gradient-to-br from-[#00FFB2]/20 to-primary/20 rounded-2xl p-3 border border-border max-w-xs">
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

        {/* Network Growth Statistics */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Incredible Network Growth
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                First In-Production Post-Quantum Blockchain - Testnet Launched January 31st, 2025
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-[#00FFB2]/20 hover:border-[#00FFB2]/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-lg bg-[#00FFB2]/10 flex items-center justify-center mb-4 mx-auto">
                    <Activity className="w-8 h-8 text-[#00FFB2]" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-[#00FFB2]">105M+</h3>
                  <p className="text-sm text-muted-foreground mb-2">Post-Quantum Transactions</p>
                  <p className="text-xs text-muted-foreground">410K daily transactions</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-primary">3.3M+</h3>
                  <p className="text-sm text-muted-foreground mb-2">Naoris Wallets</p>
                  <p className="text-xs text-muted-foreground">13.1K daily new wallets</p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                    <Server className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-purple-500">1M+</h3>
                  <p className="text-sm text-muted-foreground mb-2">Security Nodes</p>
                  <p className="text-xs text-muted-foreground">4.1K daily new nodes</p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20 hover:border-orange-500/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-orange-500">583M+</h3>
                  <p className="text-sm text-muted-foreground mb-2">Threats Mitigated</p>
                  <p className="text-xs text-muted-foreground">2.3M daily threats blocked</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" className="gap-2 bg-[#00FFB2] text-black hover:bg-[#00E5A0]">
                <a href="https://naorisprotocol.network/testnet" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Go To Testnet
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Naoris Protocol is at the forefront of revolutionizing digital security with its pioneering Decentralized Trust Mesh Architecture, specifically designed to restore cyber-trust between organizations, operations, and digital systems.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border hover:border-[#00FFB2]/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Building className="h-12 w-12 text-[#00FFB2] mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-4">Innovation Leadership</h3>
                  <p className="text-muted-foreground">
                    Led by industry experts with decades of experience and guided by cyber pioneers committed to advancing the frontiers of cybersecurity.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-4">Mission</h3>
                  <p className="text-muted-foreground">
                    Deliver Decentralized Zero Trust for data and assets, powering the transition from isolated systems to incentivized community computing models.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-purple-500/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-4">Global Impact</h3>
                  <p className="text-muted-foreground">
                    The trusted backbone for mainstream adoption of DePINs across defense, government, banking, healthcare, and enterprise sectors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Post-Quantum Technology */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Post-Quantum Infrastructure</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                The world needs a Post-Quantum solution to secure $Trillions in vulnerable assets. Naoris Protocol secures Web3 without hard forks.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-[#00FFB2]/10 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-[#00FFB2]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Quantum-Secure Blockchain Transactions</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#00FFB2] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">EVM compatible & easy to adopt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#00FFB2] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">NIST-approved PQC algorithms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#00FFB2] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Post-Quantum ensured security for transactions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Network className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Trust & Security For Web3 Infrastructure</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Operating at the Sub-Zero Layer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Quantum security for the Web3 stack</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Chains, Nodes, Validators, DEXs & Bridges</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* $NAORIS Token Economy */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">$NAORIS Proof of Trust Economy</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                The native utility token powering the Naoris Protocol network through decentralized Proof of Security (dPoSec) consensus mechanism.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border hover:border-[#00FFB2]/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-12 w-12 text-[#00FFB2] mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-3">Network Utility</h3>
                  <p className="text-muted-foreground text-sm">
                    Validates security across ecosystems, transferring value between devices in real-time as the backbone of decentralized validation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-3">Trusted Validations</h3>
                  <p className="text-muted-foreground text-sm">
                    Devices earn tokens for secure validations with millisecond validation speed through the dPoSec consensus mechanism.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-purple-500/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Network className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-3">Security Mesh</h3>
                  <p className="text-muted-foreground text-sm">
                    Transforms devices into cyber-secure validator nodes creating an always-on record immutably secured on-chain.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href="https://knowledgebase.naorisprotocol.com/naoris-protocol/introduction/what-is-the-usdnaoris-token-used-for" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Learn More About $NAORIS
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Recognition & Media */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Industry Recognition</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Featured in leading global publications and recognized by major tech accelerators across banking, telecommunications, and industrial sectors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <Award className="h-8 w-8 text-[#00FFB2] mb-3" />
                  <h4 className="font-semibold mb-2">Cointelegraph</h4>
                  <p className="text-sm text-muted-foreground">World's First Post-Quantum DePIN Testnet Launch</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Forbes</h4>
                  <p className="text-sm text-muted-foreground">$10 Trillion Case for Decentralized Cybersecurity</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <Award className="h-8 w-8 text-purple-500 mb-3" />
                  <h4 className="font-semibold mb-2">NASDAQ</h4>
                  <p className="text-sm text-muted-foreground">Tim Draper Investment in Blockchain Cybersecurity</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <Award className="h-8 w-8 text-blue-500 mb-3" />
                  <h4 className="font-semibold mb-2">Coindesk</h4>
                  <p className="text-sm text-muted-foreground">$11.5M Raised for Decentralized Proof of Security</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <Award className="h-8 w-8 text-green-500 mb-3" />
                  <h4 className="font-semibold mb-2">Financial Times</h4>
                  <p className="text-sm text-muted-foreground">Featured in FT Coverage of Blockchain Innovation</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <Award className="h-8 w-8 text-orange-500 mb-3" />
                  <h4 className="font-semibold mb-2">AssureDeFi Verified</h4>
                  <p className="text-sm text-muted-foreground">Proudly Verified By AssureDeFi™ Platform</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 p-12 rounded-2xl bg-gradient-to-br from-[#00FFB2]/10 via-primary/5 to-transparent border border-border">
              <h2 className="text-4xl font-bold">
                Secure The Future with Post-Quantum Infrastructure
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the revolution in decentralized cybersecurity. Protect your digital assets with the world's first post-quantum blockchain platform.
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
