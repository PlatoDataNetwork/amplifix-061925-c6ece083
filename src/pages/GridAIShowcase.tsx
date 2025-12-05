import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Zap, Building, Globe, Cpu, Leaf, Shield, DollarSign, Home, Factory, Server, Battery, Car, Sun, Search } from "lucide-react";

const GridAIShowcase = () => {
  return (
    <>
      <Helmet>
        <title>Grid AI Corp (GRDX) - End-to-End Energy Orchestration | AmplifiX Showcase</title>
        <meta name="description" content="Grid AI Corp delivers AI-powered energy orchestration across every scale - from homes to hyperscale data centers. Dynamic Load Shaping, VPP solutions, and multi-GW resilience." />
        <meta property="og:title" content="Grid AI Corp - End-to-End Energy Orchestration" />
        <meta property="og:description" content="AI-native orchestration for flexible, reliable, and sustainable energy solutions." />
        <link rel="canonical" href="https://amplifix.ai/showcase/gridai" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/5" />
          <div className="absolute inset-0 bg-[url('https://grid-ai.com/images/header/main-banner-home.jpg')] bg-cover bg-center opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <img 
                    src="/lovable-uploads/gridai-logo.svg" 
                    alt="Grid AI Corp Logo" 
                    className="h-24 w-auto relative z-10 ring-4 ring-blue-500/30 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-500/15 text-blue-500 border border-blue-500/30 rounded-full text-sm font-medium">
                  Nasdaq: GRDX
                </span>
                <a 
                  href="https://stockanalysis.com/stocks/grdx/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  Stock Price
                </a>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-blue-500">End-to-End</span><br />
                Energy Orchestration
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Dynamic Load Shaping for homes, AI-native orchestration for fleets, and multi-GW resilience for hyperscale campuses.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://grid-ai.com" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="https://stockanalysis.com/stocks/grdx/" target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Stock
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="https://www.bing.com/copilotsearch?q=Grid+AI+Corp+GRDX+energy&FORM=CSSCOP" target="_blank" rel="noopener noreferrer">
                    <Search className="mr-2 h-4 w-4" />
                    AmplifiX
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                About <span className="text-blue-500">Grid AI Corp</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 text-center">
                Grid AI Corp. brings together the best of both worlds — powerful infrastructure and intelligent digital orchestration — to deliver flexibility across every layer of the energy system.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <Server className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Controlling Infrastructure</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Large-scale AI data center power campuses and grid-ready assets designed for resilience and growth.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <Home className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Delivering Intelligence</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Orchestrating behind-the-meter devices, renewable assets, and providing consumer energy management at scale.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
                <p className="text-xl italic text-blue-500 font-medium">
                  "One platform. All scales. Orchestration across the grid."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                The <span className="text-blue-500">Challenge</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Today's grid is under unprecedented pressure
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Growing Demand</h3>
                  <p className="text-muted-foreground">
                    AI data centers, electric vehicles, and electrification are driving massive new loads - with global capacity needs projected to increase by over 50 GW by 2028.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Building className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Ageing Infrastructure</h3>
                  <p className="text-muted-foreground">
                    Grid upgrades require billions in investment, yet supply chain delays and slow deployment are creating bottlenecks.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Rising Risks</h3>
                  <p className="text-muted-foreground">
                    More variable demand and supply increase the risk of instability, outages, and blackouts.
                  </p>
                </div>
              </div>

              <p className="text-center text-muted-foreground mt-8 max-w-3xl mx-auto">
                To meet these challenges, the grid needs flexibility and intelligent orchestration across every scale, from households and businesses to utilities and hyperscale campuses.
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Our <span className="text-blue-500">Solutions</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Grid AI Corp. at every scale
              </p>

              <div className="space-y-8">
                {/* VPP for Residential */}
                <div className="bg-gradient-to-br from-card to-green-500/5 p-8 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500/15 rounded-lg">
                      <Home className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <span className="text-xs text-green-500 font-medium uppercase tracking-wide">VPP Solution</span>
                      <h3 className="text-xl font-semibold">Residential & Small Business</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A consumer energy manager that makes flexibility effortless. The Alice product lowers bills, reduces carbon footprints, and simplifies participation in demand response programs.
                  </p>
                  <div className="bg-green-500/10 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold text-green-500">Key benefits:</span> Grid AI Corp. helps households and small businesses save money while living more sustainably. With Alice managing energy devices in the background, consumers enjoy cheaper energy, a greener lifestyle, and seamless automation.
                    </p>
                  </div>
                </div>

                {/* Commercial & Utility */}
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-8 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/15 rounded-lg">
                      <Factory className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-xs text-blue-500 font-medium uppercase tracking-wide">Commercial Solution</span>
                      <h3 className="text-xl font-semibold">Commercial & Utility</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    AI-native orchestration for distributed energy resources (DERs), fleets, and grid-scale assets. Grid AI enables real-time scheduling, optimisation, and market participation.
                  </p>
                  <div className="bg-blue-500/10 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold text-blue-500">Key benefits:</span> Creates opportunities for new revenue streams through demand response, dynamic tariffs, and value-added services. Utilities and retailers benefit from better customer engagement and data-driven insights.
                    </p>
                  </div>
                </div>

                {/* Hyperscale & Industrial */}
                <div className="bg-gradient-to-br from-card to-purple-500/5 p-8 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/15 rounded-lg">
                      <Server className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <span className="text-xs text-purple-500 font-medium uppercase tracking-wide">Enterprise Solution</span>
                      <h3 className="text-xl font-semibold">Hyperscale & Industrial</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Orchestration of multi-GW campuses with integrated generation, storage, and dispatch. Grid AI provides orchestration, scheduling and optimisation for energy-intensive industries and AI data centers.
                  </p>
                  <div className="bg-purple-500/10 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold text-purple-500">Key benefits:</span> Ensures reliability and cost-optimized uptime for AI data centers and industrial campuses. Integrated orchestration provides future-proof flexibility to meet rising demand without compromising performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Technology & <span className="text-blue-500">Innovation</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Built on a foundation of advanced technology that brings intelligence and infrastructure together
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Cpu className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">AI-Native Orchestration</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time AI scheduling and optimisation to orchestrate devices, fleets, and grid-scale assets. Ensures reliable, flexible performance even under volatile demand.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Dynamic Load Shaping</h3>
                  <p className="text-muted-foreground text-sm">
                    Alice manages behind-the-meter devices such as EVs, batteries, HVAC, and appliances. Delivers seamless load shaping and demand response without disrupting daily life.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Battery className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Future-Proof Design</h3>
                  <p className="text-muted-foreground text-sm">
                    Scalable, modular architecture capable of evolving with new technologies, emerging energy markets, and the growing complexity of global power needs.
                  </p>
                </div>
              </div>

              {/* Device Icons */}
              <div className="mt-12 flex flex-wrap justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Car className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">EVs</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Battery className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Batteries</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Sun className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Solar</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Home className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">HVAC</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Server className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Data Centers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Our <span className="text-blue-500">Impact</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-4 bg-green-500/15 rounded-full w-fit mx-auto mb-4">
                    <Leaf className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-green-500">Sustainability</h3>
                  <p className="text-muted-foreground text-sm">
                    Lowers CO₂ footprint across the energy system by enabling smarter use of renewables and efficient demand response. Supports electrification-as-a-service (EaaS) for EVs and batteries.
                  </p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-blue-500/15 rounded-full w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Reliability</h3>
                  <p className="text-muted-foreground text-sm">
                    Combines intelligent orchestration with resilient infrastructure to enhance grid stability under pressure. Ensures energy systems can handle growing demand without compromising uptime.
                  </p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-amber-500/15 rounded-full w-fit mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-amber-500">Economics</h3>
                  <p className="text-muted-foreground text-sm">
                    Flexibility unlocks measurable economic value. Reduces costs for consumers, improves efficiency for utilities, and creates new revenue opportunities by monetising flexibility at every scale.
                  </p>
                </div>
              </div>

              <p className="text-center text-lg font-medium text-blue-500 mt-12">
                Grid AI Corp. delivers impact you can measure: greener, more reliable, and more cost-effective energy.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Shape the Future of <span className="text-blue-500">Energy</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Partner with us to build the future of flexible, reliable, and sustainable energy.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://grid-ai.com/contact.html" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Contact Grid AI
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="https://stockanalysis.com/stocks/grdx/" target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View GRDX Stock
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default GridAIShowcase;
