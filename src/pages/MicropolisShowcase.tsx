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
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
                    <img 
                      src="/lovable-uploads/micropolis-hero.png" 
                      alt="Micropolis Robotics Exhibition Booth"
                      className="relative rounded-2xl shadow-2xl w-full scale-110 md:scale-125"
                    />
                  </div>
                  
                  <div className="flex flex-row gap-3 justify-center">
                    <Button asChild size="lg" className="gap-2 bg-teal-400 text-black hover:bg-teal-500">
                      <a href="https://finance.yahoo.com/quote/MCRP/" target="_blank" rel="noopener noreferrer">
                        <TrendingUp className="w-4 h-4" />
                        Live Stock Price
                      </a>
                    </Button>
                    <Button asChild size="lg" className="gap-2 bg-teal-400 text-black hover:bg-teal-500">
                      <a href="https://www.micropolis.ai/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                    <Button size="lg" className="gap-2 bg-teal-400 text-black hover:bg-teal-500" onClick={() => setIsVideoPlaying(true)}>
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
