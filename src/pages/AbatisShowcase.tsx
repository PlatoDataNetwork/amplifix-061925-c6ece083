import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Shield, Lock, Zap, Globe, Check, FileText, ShoppingCart, TrendingUp, Users, Target, AlertCircle, Award, CheckCircle, Cpu } from "lucide-react";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const AbatisShowcase = () => {
  useGTranslateRefresh(true);
  return (
    <>
      <Helmet>
        <title>Abatis - Military-Grade Cybersecurity for Web3 | AmplifiX Showcase</title>
        <meta name="description" content="Discover Abatis ABTU - The first autonomous cybersecurity solution for Web3, delivering sovereignty & immutability at pre-foundational level with 20+ years of proven military deployment." />
        <meta name="keywords" content="Abatis, ABTU token, Web3 cybersecurity, military-grade security, autonomous defense, digital sovereignty, blockchain security" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="mb-6">
                  <div className="inline-block mb-4">
                    <div className="bg-green-500/10 text-green-500 rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-green-500/20 text-xs md:text-sm font-medium">
                      PRIVATE PLACEMENT NOW LIVE
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                    Introducing <span className="text-green-500">ABTU</span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-3">The Utility Token Powering ABATIS®</p>
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    The first autonomous cybersecurity solution for Web3 products and users, delivering sovereignty & immutability at pre-foundational level.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                    <a href="https://share.hsforms.com/1VJUfYGy9RF2luYxkn3JGVg4piku" target="_blank" rel="noopener noreferrer">
                      <TrendingUp className="w-4 h-4" />
                      Buy Now
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <a href="https://4piku.share.hsforms.com/2sJ62PDchRQWuB_NgDJQ5Gw" target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4" />
                      Whitepaper
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <a href="https://abatisabtu.com/" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <img src="/lovable-uploads/abtu-coin.png" alt="ABTU Utility Token" className="w-full max-w-md mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="bg-muted/30 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8">Trusted, tested and endorsed by…</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 justify-items-center">
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/Quranium-Logo-Secondary-Black-SMALLER.2.png" alt="Quranium" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/Coop.svg-SMALLER.png" alt="Coop" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/cropped-MTR-SMALLER.png" alt="MTR" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/Cox-Logo-SAMLLER.png" alt="Cox" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/Epson_logo.svg-SMALLER.png" alt="Epson" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/glaxosmithkline-logo-SMALLER.2.png" alt="GlaxoSmithKline" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/eurotunnel-logo-png-transparent-SMALLER.2.png" alt="Eurotunnel" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/toppng.com-lockheed-martin-logo-2480x674-1.png" alt="Lockheed Martin" className="h-8 grayscale opacity-70 hover:opacity-100" />
              <img src="https://abatisabtu.com/wp-content/uploads/2025/08/Armasuisse.001.max-600x480-1-SMALLER.2.png" alt="Armasuisse" className="h-8 grayscale opacity-70 hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* ABTU Overview Section */}
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Buy ABTU. Use it. Hold it. Earn from it.</h2>
            <img src="https://abatisabtu.com/wp-content/uploads/2025/08/b8bfc6f6-ba60-4de3-bf15-07d73d93b5a2.3.4.png" alt="ABTU Ecosystem" className="w-full max-w-lg mx-auto mb-6" />
            <p className="text-base md:text-lg text-muted-foreground mb-4">
              Redeem 20% of ABTU instantly for Abatis licenses; protect yourself or your whole Web3 project. Stake, HODL, and ride with us to our CEX listing. Actually, why not do both?
            </p>
          </div>
        </div>

        {/* Military Grade Cybersecurity Section */}
        <div className="bg-secondary py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Military Grade Cybersecurity, Now for the Web3 Ecosystem</h2>
            <p className="text-lg md:text-xl text-secondary-foreground mb-6 md:mb-8">Autonomous Defence. Digital Sovereignty Secured.</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Abatis</h3>
            <p className="text-base md:text-lg text-secondary-foreground">Cybersecurity for Web3</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
              <Card className="bg-secondary-foreground text-secondary">
                <CardContent className="p-6">
                  <Shield className="w-6 h-6 mb-4 text-green-500" />
                  <h4 className="text-xl font-semibold mb-2">Proactive protection</h4>
                  <p className="text-sm">Blocks threats before they begin (stopping attacks before impact).</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary-foreground text-secondary">
                <CardContent className="p-6">
                  <Lock className="w-6 h-6 mb-4 text-green-500" />
                  <h4 className="text-xl font-semibold mb-2">Proven technology</h4>
                  <p className="text-sm">Trusted by militaries, governments, and enterprises for 20+ years, zero breaches.</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary-foreground text-secondary">
                <CardContent className="p-6">
                  <Zap className="w-6 h-6 mb-4 text-green-500" />
                  <h4 className="text-xl font-semibold mb-2">Privacy by default</h4>
                  <p className="text-sm">No data collection, no oversight, no compromise.</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary-foreground text-secondary">
                <CardContent className="p-6">
                  <Users className="w-6 h-6 mb-4 text-green-500" />
                  <h4 className="text-xl font-semibold mb-2">Autonomous & immutable</h4>
                  <p className="text-sm">Sovereignty, speed, and resilience unmatched since 2005.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Web3 Challenges Section */}
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-4">Why it matters for Web3</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              Web3 security challenges cannot be solved with old tools. The following highlights explain why a new, pre‑foundational approach is essential:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Target className="w-6 h-6 mb-4 text-blue-500" />
                  <h4 className="text-xl font-semibold mb-2">Pre-foundational exposure</h4>
                  <p className="text-sm">
                    Web3 still depends on vulnerable Web2 endpoints (devices, RPCs, APIs), exploited through open kernels, misconfigured nodes, and unsigned calls.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <AlertCircle className="w-6 h-6 mb-4 text-red-500" />
                  <h4 className="text-xl font-semibold mb-2">User blind spot</h4>
                  <p className="text-sm">
                    Wallets and dApps rely on poorly defended user devices, where billions have been lost to unsecured access points and Web2 vulnerabilities.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <p className="text-lg text-muted-foreground mb-2">Abatis shields the entire digital universe: users, businesses, and chains.</p>
              <p className="text-lg text-muted-foreground">Joining the Abatis Movement = becoming a guardian of Web3.</p>
            </div>
          </div>
        </div>

        {/* ABTU Utility Token Section */}
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Powered by ABTU Utility Token</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              ABTU is more than a token, it is the fuel of a movement to make sovereign cybersecurity accessible to all.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <Award className="w-6 h-6 mb-4 text-yellow-500" />
                  <h4 className="text-xl font-semibold mb-2">Unmatchable Security</h4>
                  <p className="text-sm">ABTU gives Web3 developers & users access to unmatchable security at the pre-foundational level.</p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <CheckCircle className="w-6 h-6 mb-4 text-green-500" />
                  <h4 className="text-xl font-semibold mb-2">Military-Grade Access</h4>
                  <p className="text-sm">For the first time, military-grade cybersecurity is available to all, at a fraction of the normal price.</p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <Cpu className="w-6 h-6 mb-4 text-purple-500" />
                  <h4 className="text-xl font-semibold mb-2">Fuels Adoption</h4>
                  <p className="text-sm">ABTU fuels Abatis adoption across wallets, devices, and networks.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Roadmap</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              From hardware innovation to AI‑driven defence, ABTU’s roadmap sets out a clear path from today’s proven platform to tomorrow’s secure digital universe.
            </p>
            <h3 className="text-3xl font-semibold mb-4">Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">2025–26</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Abatis smartphone with built-in privacy and security.</li>
                    <li>Abatis crypto wallet + world’s first smartphone with warm/cold wallet.</li>
                    <li>OEM manufacturing of triple-hardened devices: firewalls, servers, routers.</li>
                    <li>Application for licence and launch of Platinum Digital Custodian Service Company</li>
                    <li>Application for licencing and launch of Abatis Cyber Insurance Company</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">2027</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Licensing programme: establish Abatis as the gold standard for Web3 security.</li>
                    <li>Launch of Abatis 3.0 + AI: deterministic, predictive defence for every user, business, and chain.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Abatis’ Timeline for Cyber Sovereignty</h2>
            <p className="text-lg text-secondary-foreground mb-6">Roadmap to Resilience</p>
            <img src="https://abatisabtu.com/wp-content/uploads/2025/09/Stages-timeline-mobile.png" alt="Abatis Timeline" className="w-full max-w-3xl mx-auto" />
          </div>
        </div>

        {/* Open to All Section */}
        <div className="container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Protect Yourself. Protect Web3. Stand with Digital Sovereignty.</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              The ABTU Stage 1 “Private Placement” is your chance to secure tokens at the start, along with the privileges, protection, and rewards that come with them.
            </p>
            <Button asChild size="lg" className="gap-2 bg-green-500 text-white hover:bg-green-600">
              <a href="https://share.hsforms.com/1VJUfYGy9RF2luYxkn3JGVg4piku" target="_blank" rel="noopener noreferrer">
                <TrendingUp className="w-4 h-4" />
                Buy Now
              </a>
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AbatisShowcase;
