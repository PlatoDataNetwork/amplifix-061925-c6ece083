import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Shield, Lock, Cpu, Car, Factory, Zap, Globe, Server, Printer } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const SecureTechShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>SecureTech Innovations - Advanced Security Technologies | AmplifiX</title>
        <meta name="description" content="SecureTech Innovations develops cutting-edge security and safety technologies including Top Kontrol anti-theft system. Operating across Cybersecurity, Web3, AI, and Industrial 3D Printing." />
        <meta name="keywords" content="SecureTech Innovations, SCTH, cybersecurity, anti-theft, anti-carjacking, Top Kontrol, Web3, 3D printing" />
        <meta property="og:title" content="SecureTech Innovations - Advanced Security Technologies" />
        <meta property="og:description" content="Cutting-edge security solutions including Top Kontrol anti-theft and anti-carjacking system." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/securetech" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SecureTech Innovations - SCTH" />
        <meta name="twitter:description" content="Advanced security technologies for cybersecurity, Web3, and industrial applications." />
        <link rel="canonical" href="https://amplifix.ai/showcase/securetech" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <Shield className="h-6 w-6 text-highlight-blue" />
                <span className="text-highlight-blue font-semibold">OTC:SCTH</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Cybersecurity & Technology</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  SecureTech Innovations
                  <span className="text-highlight-blue block">Advanced Security & Safety Technologies</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                Developing cutting-edge security solutions including Top Kontrol, an advanced anti-theft and 
                anti-carjacking system. Operating at the intersection of Cybersecurity, Web3, AI, and Industrial 3D Printing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://securetechinnovations.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=SCTH+Securetech+Innovations" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">4</div>
                  <p className="text-muted-foreground text-sm">Business Verticals</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">AI</div>
                  <p className="text-muted-foreground text-sm">Powered Systems</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">Web3</div>
                  <p className="text-muted-foreground text-sm">Integration</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">3D</div>
                  <p className="text-muted-foreground text-sm">Industrial Printing</p>
                </div>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Car className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Top Kontrol</h3>
                  <p className="text-muted-foreground text-sm mt-2">Advanced anti-theft and anti-carjacking system</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Lock className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Cybersecurity</h3>
                  <p className="text-muted-foreground text-sm mt-2">Enterprise-grade digital security solutions</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Printer className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Industrial 3D</h3>
                  <p className="text-muted-foreground text-sm mt-2">Next-gen additive manufacturing technology</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Verticals Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Four Strategic Business Verticals</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Diversified technology portfolio spanning security, blockchain, AI, and manufacturing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <Shield className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Cybersecurity</h3>
                  <p className="text-muted-foreground">
                    Comprehensive digital security solutions protecting enterprises from evolving cyber threats. 
                    Advanced threat detection, incident response, and security infrastructure for modern businesses.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Globe className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Web3 Technologies</h3>
                  <p className="text-muted-foreground">
                    Blockchain-based solutions enabling decentralized applications, smart contracts, and 
                    secure digital asset management for the next generation of internet infrastructure.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Cpu className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Artificial Intelligence</h3>
                  <p className="text-muted-foreground">
                    AI-powered systems enhancing security, automation, and decision-making across all 
                    business verticals. Machine learning algorithms for predictive threat analysis.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Factory className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Industrial 3D Printing</h3>
                  <p className="text-muted-foreground">
                    Advanced additive manufacturing technologies for industrial applications. Custom 
                    components, rapid prototyping, and production-grade 3D printing solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Kontrol Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Kontrol Anti-Theft System</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Advanced vehicle security technology protecting against theft and carjacking
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Car className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Anti-Theft</h3>
                  <p className="text-muted-foreground">
                    Sophisticated theft prevention with real-time monitoring and alerts
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Anti-Carjacking</h3>
                  <p className="text-muted-foreground">
                    Immediate response systems to protect drivers during carjacking attempts
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Server className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Remote Control</h3>
                  <p className="text-muted-foreground">
                    Secure remote access for vehicle management and emergency response
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Cpu className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Integration</h3>
                  <p className="text-muted-foreground">
                    Machine learning for behavior analysis and threat prediction
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
                Securing the Future
              </h2>
              <p className="text-xl mb-8 text-muted-foreground">
                SecureTech Innovations is at the forefront of security technology, protecting businesses 
                and individuals with cutting-edge solutions across multiple sectors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[hsl(220,20%,15%)] hover:bg-[hsl(220,20%,20%)] text-white border border-white/20">
                  <a href="https://securetechinnovations.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-foreground hover:bg-white/10">
                  <LanguageAwareLink to="/contact" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Contact Us
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

export default SecureTechShowcase;
