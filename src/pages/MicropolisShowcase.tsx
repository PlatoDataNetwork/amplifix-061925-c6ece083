import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Shield, Cpu, Zap, Target, Globe, Play, X } from "lucide-react";
import { useState } from "react";

const MicropolisShowcase = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <>
      <Helmet>
        <title>Micropolis Robotics - AI-Powered Autonomous Robotics | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="Micropolis leverages breakthrough AI to deliver exquisite custom design bespoke robotic solutions, pioneering the future of autonomous mobile robotics." 
        />
        <meta 
          name="keywords" 
          content="Micropolis Robotics, autonomous robots, AI robotics, security patrol, M-Platform, NYSE-AMEX MCRP, mobile robotics" 
        />
        <meta property="og:title" content="Micropolis Robotics - AI-Powered Autonomous Robotics | AmplifiX" />
        <meta 
          property="og:description" 
          content="Micropolis leverages breakthrough AI to deliver exquisite custom design bespoke robotic solutions, pioneering the future of autonomous mobile robotics." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Micropolis Robotics - AI-Powered Autonomous Robotics" />
        <meta 
          name="twitter:description" 
          content="Leveraging breakthrough AI for exquisite custom design bespoke robotic solutions." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <MainHeader />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-12 md:py-20 px-4 overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-block">
                    <img 
                      src="/lovable-uploads/micropolis-logo.svg" 
                      alt="Micropolis Robotics Logo" 
                      className="h-16 md:h-24 w-auto"
                    />
                  </div>
                  <div>
                    <p className="text-primary font-semibold mb-2 text-sm md:text-base">NYSE-AMEX: MCRP</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 pb-2 md:pb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Leveraging Breakthrough AI
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground">
                      Micropolis leverages breakthrough AI to<br />
                      deliver exquisite custom design bespoke<br />
                      robotic solutions, pioneering the future<br />
                      of autonomous mobile robotics.
                    </p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
                    <img 
                      src="/lovable-uploads/micropolis-hero.png" 
                      alt="Micropolis Robotics Exhibition Booth"
                      className="relative rounded-2xl shadow-2xl w-full scale-110 md:scale-125"
                    />
                  </div>
                  
                  <div className="flex flex-row gap-3 pt-4 -ml-8">
                    <Button asChild size="default" className="gap-2 bg-teal-400 text-black hover:bg-teal-500">
                      <a href="https://finance.yahoo.com/quote/MCRP/" target="_blank" rel="noopener noreferrer">
                        <TrendingUp className="w-4 h-4" />
                        Live Stock Price
                      </a>
                    </Button>
                    <Button asChild size="default" className="gap-2 bg-teal-400 text-black hover:bg-teal-500">
                      <a href="https://www.micropolis.ai/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                    <Button size="default" className="gap-2 bg-teal-400 text-black hover:bg-teal-500" onClick={() => setIsVideoPlaying(true)}>
                      <Play className="w-4 h-4" />
                      Watch Video
                    </Button>
                    <Button asChild size="default" className="gap-2 bg-teal-400 text-black hover:bg-teal-500">
                      <a href="https://www.micropolis.ai/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Research
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Pioneering the Future of Mobility
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Autonomous mobile robotics platforms tailored to deliver exclusive operational efficiency
                </p>
              </div>
              
              <div className="mb-8 md:mb-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl blur-2xl" />
                <img 
                  src="/lovable-uploads/micropolis-robots-duo.png" 
                  alt="Micropolis Autonomous Mobile Patrol Robots"
                  className="relative rounded-2xl shadow-2xl w-full max-h-[300px] md:max-h-[400px] object-cover object-center"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Cpu className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">AI-Powered Intelligence</h3>
                    <p className="text-muted-foreground">
                      Advanced AI systems that prevent and predict suspicious behavior applying sophisticated suspect matrix and criminal logic algorithms.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Security Solutions</h3>
                    <p className="text-muted-foreground">
                      Autonomous robotic security patrol vehicles representing the future of robotic autonomy for security and law enforcement worldwide.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                    <p className="text-muted-foreground">
                      Base technology customized for customer solutions, enhancing production efficiency across multiple industries.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* M-Platform Section */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <img 
                    src="/lovable-uploads/micropolis-platform.webp" 
                    alt="M-Platform Mobile Robotic Vehicle"
                    className="rounded-2xl shadow-2xl w-full"
                  />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    M-Platform
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    The mobile robotic vehicle to revolutionize operational intelligence
                  </p>
                  <p className="text-muted-foreground">
                    One platform, two sizes developed as base technology. The M-Platform represents cutting-edge autonomous mobile robotics designed to transform how organizations approach security, surveillance, and operational efficiency.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">M01-P & M02-P Patrol Vehicles</h4>
                        <p className="text-sm text-muted-foreground">
                          Autonomous robotic security patrol vehicles for comprehensive perimeter protection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Microspot AI Brain</h4>
                        <p className="text-sm text-muted-foreground">
                          The intelligent core behind M01-P and M02-P, powered by advanced predictive algorithms
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Micropolis */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Why Choose Micropolis
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leading the autonomous robotics revolution with cutting-edge AI technology
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Breakthrough AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Proprietary AI systems for predictive security and autonomous navigation
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Custom Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Bespoke solutions tailored to specific operational requirements
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Proven Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Trusted solutions for law enforcement and security worldwide
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Global Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Leading the future of autonomous mobile robotics platforms
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Research Presentation Section */}
          <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
                  <span className="text-primary font-semibold text-sm">AmplifiX Research</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Investment Research & Analysis
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Independent research report on Micropolis Robotics.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-2">
                  Early innings for a vertically-integrated UGV/AMR player.
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">Date: October 20, 2025</p>
              </div>

              {/* Executive Summary */}
              <div className="mb-12 p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-primary">Executive Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Micropolis is a Dubai-based robotics company designing and manufacturing unmanned ground vehicles (UGVs) and autonomous mobile robots (AMRs) for public-safety, industrial and "smart city" applications. Products include the M-Platform base vehicles, M-Patrol autonomous security patrol vehicles (developed with Dubai Police), and Microspot AI software powered by NVIDIA Orin and proprietary control electronics.
                </p>
              </div>

              {/* Investment Thesis */}
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Investment Thesis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Category Growth + Focused Use-Cases</h4>
                          <p className="text-sm text-muted-foreground">
                            AMR market estimated at ~$4.1bn in 2024, rising to ~$9.6bn by 2030 (≈15% CAGR). Professional service-robot shipments rose ~30% in 2023.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Cpu className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Full-Stack Vertical Integration</h4>
                          <p className="text-sm text-muted-foreground">
                            Designs and builds mechatronics, control boards, and autonomy stack in-house, compressing iteration cycles and improving margin capture.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Building Commercial Proof</h4>
                          <p className="text-sm text-muted-foreground">
                            Dubai Police deployment, Sustainable City 2.0 agreement, and Swedish port cleaning pilot broaden reference base across geographies.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Risks Real but Manageable</h4>
                          <p className="text-sm text-muted-foreground">
                            Pathways exist through $5m financing with Streeterville Capital, extending runway to pursue commercialization and fleet orders.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Developments */}
              <div className="mb-12 p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Recent Developments (2025 YTD)</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Dubai Police Deployment</h4>
                      <p className="text-sm text-muted-foreground">
                        Official deployment of Autonomous Police Patrol at Dubai Global Village - strong validation for public safety applications.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Sustainable City 2.0 Agreement</h4>
                      <p className="text-sm text-muted-foreground">
                        Agreement to deliver AI & robotics infrastructure for SEE Holding's Sustainable City 2.0 project in the UAE.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Swedish Port Cleaning Pilot</h4>
                      <p className="text-sm text-muted-foreground">
                        Partnership with Helsingborgs Hamn AB and MCS Robotics to develop "Box Cleaner" based on M2 platform - expanding into industrial applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Scenarios */}
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Revenue Scenarios (2025E-2029E)</h3>
                <p className="text-center text-sm text-muted-foreground mb-8">Scenario-based projections - all figures are assumptions, not company guidance</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-2">
                          <span className="text-red-500 font-semibold text-sm">Bear Case</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2025E</span>
                          <span className="font-semibold">$2-3M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2026E</span>
                          <span className="font-semibold">$6-8M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2027E</span>
                          <span className="font-semibold">$12-18M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">2028E</span>
                          <span className="font-semibold">$25-35M</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Slow conversion & financing constraints</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full mb-2">
                          <span className="text-primary font-semibold text-sm">Base Case</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2025E</span>
                          <span className="font-semibold">$4-6M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2026E</span>
                          <span className="font-semibold">$10-15M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2027E</span>
                          <span className="font-semibold">$22-30M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">2028E</span>
                          <span className="font-semibold">$60-80M</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Dubai Police scales, City 2.0 phases yield fleet purchases</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-2">
                          <span className="text-green-500 font-semibold text-sm">Bull Case</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2025E</span>
                          <span className="font-semibold">$8-10M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2026E</span>
                          <span className="font-semibold">$18-25M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2027E</span>
                          <span className="font-semibold">$35-50M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">2028E</span>
                          <span className="font-semibold">$110-150M</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Two+ scaled programs & international replication</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Valuation Framework */}
              <div className="mb-12 p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Valuation Framework (12-Month View)</h3>
                <p className="text-muted-foreground mb-6">
                  EV/Sales framework applied to 2027E revenue scenarios using micro-cap robotics/security comps (2.0-5.0× multiples)
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Bear Case</div>
                    <div className="text-2xl font-bold mb-1">$0.50 - $1.10</div>
                    <div className="text-xs text-muted-foreground">per share (illustrative)</div>
                  </div>
                  <div className="p-4 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-lg">
                    <div className="text-sm text-primary mb-2">Base Case</div>
                    <div className="text-2xl font-bold mb-1">$1.85 - $3.60</div>
                    <div className="text-xs text-muted-foreground">per share (illustrative)</div>
                  </div>
                  <div className="p-4 bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Bull Case</div>
                    <div className="text-2xl font-bold mb-1">$3.90 - $7.00</div>
                    <div className="text-xs text-muted-foreground">per share (illustrative)</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-6 italic">
                  Important: These ranges are not company guidance and hinge on contract conversion, production ramp, and financing.
                </p>
              </div>

              {/* Catalysts & Risks */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    Key Catalysts (6-18 Months)
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Follow-on orders from Dubai Police / UAE agencies",
                      "Sustainable City 2.0 milestones & deployments",
                      "Industrial pilot → production conversions",
                      "Additional capital on improved terms",
                      "Trade-show traction (GITEX 2025 demos)",
                      "International partnerships & market expansion"
                    ].map((catalyst, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <p className="text-sm">{catalyst}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-red-500" />
                    Key Risks
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: "Going Concern / Liquidity", desc: "FY2024 audit carried going-concern paragraph; financing adds potential dilution" },
                      { title: "Commercialization Risk", desc: "FY2024 revenue $35k; order conversion unproven at volume" },
                      { title: "Financing/Dilution", desc: "Warrants and convertible notes introduce overhang" },
                      { title: "Competition", desc: "Well-funded incumbents with head starts in certain markets" },
                      { title: "Regulatory/Acceptance", desc: "Public space deployments require community buy-in" }
                    ].map((risk, idx) => (
                      <div key={idx} className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">{risk.title}</h4>
                        <p className="text-xs text-muted-foreground">{risk.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-6 bg-muted/50 border border-border/50 rounded-xl">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> This research is an informational, independent research report prepared by AmplifiX. It is not produced by, affiliated with, or endorsed by any broker-dealer, and it does not constitute investment advice, a recommendation, an offer, or a solicitation to buy or sell any security. Opinions and estimates are subject to change without notice. This report contains forward-looking statements which are inherently uncertain and involve significant risks. Micro-cap equities can be illiquid and volatile, and investors may lose all or a substantial portion of their investment. Please consult your own professional advisers for tax, legal, accounting, or personalized investment advice.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="space-y-4 md:space-y-6 p-6 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Discover the Future of Autonomous Robotics
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Learn how Micropolis Robotics is transforming security, surveillance, and operational efficiency through breakthrough AI technology.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                    <a href="/contact">
                      Partner with AmplifiX
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <a href="https://www.micropolis.ai/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Explore Micropolis
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Video Overlay */}
        {isVideoPlaying && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white hover:bg-white/10"
                onClick={() => setIsVideoPlaying(false)}
              >
                <X className="w-6 h-6" />
              </Button>
              <video
                className="w-full rounded-lg shadow-2xl"
                controls
                autoPlay
                src="/lovable-uploads/micropolis-video.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MicropolisShowcase;
