import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ExternalLink, 
  Building2, 
  Globe, 
  Shield, 
  TrendingUp,
  Users,
  FileCheck,
  Lock,
  BarChart3,
  ChevronLeft,
  Zap,
  Network,
  CircuitBoard,
  ScanLine,
  Package,
  Fingerprint,
  Eye,
  QrCode,
  Truck,
  Pill,
  ShoppingBag,
  Landmark,
  Leaf,
  CheckCircle2,
  Cloud,
  Plug
} from "lucide-react";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useNavigate } from "react-router-dom";

const VerifyMeShowcase = () => {
  const navigate = useNavigate();
  useGTranslateRefresh(true);

  const coreSolutions = [
    {
      icon: Fingerprint,
      title: "Authentication Technologies",
      description: "Patented covert and overt authentication solutions to verify product genuineness at any point in the supply chain.",
      examples: ["Covert Features", "Overt Labels", "Digital Verification", "Multi-Layer Auth"],
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Truck,
      title: "Supply Chain Traceability",
      description: "End-to-end visibility into product movement from manufacturer to consumer with real-time tracking.",
      examples: ["Track & Trace", "Chain of Custody", "Location Tracking", "Event Logging"],
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/20"
    },
    {
      icon: Shield,
      title: "Brand Protection",
      description: "Comprehensive anti-counterfeiting and diversion prevention to safeguard brand integrity and revenue.",
      examples: ["Anti-Counterfeit", "Diversion Detection", "Grey Market Control", "Brand Integrity"],
      iconColor: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      icon: QrCode,
      title: "Serialization & Track-and-Trace",
      description: "Unique product identification with serialized codes enabling granular item-level tracking globally.",
      examples: ["Unique IDs", "Item-Level Tracking", "Batch Management", "Aggregation"],
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      icon: ScanLine,
      title: "Anti-Counterfeiting",
      description: "Advanced detection and prevention technologies to combat the $1.8T global counterfeit goods market.",
      examples: ["Forensic Markers", "Tamper Evidence", "Digital Twins", "AI Detection"],
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/20"
    },
    {
      icon: FileCheck,
      title: "Compliance Solutions",
      description: "Regulatory compliance tools for serialization mandates including DSCSA, EU FMD, and global requirements.",
      examples: ["DSCSA", "EU FMD", "FDA Compliance", "Global Mandates"],
      iconColor: "text-rose-400",
      bgColor: "bg-rose-500/20"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Multi-layered authentication technologies protect products from counterfeiting at every stage of the supply chain.",
      iconColor: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      icon: Globe,
      title: "Global Traceability",
      description: "Real-time product tracking across international supply chains with complete chain-of-custody documentation.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Built-in compliance with DSCSA, EU FMD, and other global serialization mandates to avoid costly penalties.",
      iconColor: "text-violet-400",
      bgColor: "bg-violet-500/20"
    },
    {
      icon: TrendingUp,
      title: "Cost Savings",
      description: "Reduce losses from counterfeiting, diversion, and recalls with proactive supply chain intelligence.",
      iconColor: "text-pink-400",
      bgColor: "bg-pink-500/20"
    },
    {
      icon: Lock,
      title: "Brand Protection",
      description: "Safeguard brand reputation and consumer trust through verifiable product authenticity at every touchpoint.",
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/20"
    },
    {
      icon: Eye,
      title: "Real-Time Visibility",
      description: "Instant access to product location, status, and authentication data across the entire distribution network.",
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Product Registration",
      description: "Each product is assigned a unique serialized identity with covert and overt authentication markers applied during manufacturing."
    },
    {
      step: "02",
      title: "Authentication Integration",
      description: "VerifyMe's patented authentication technologies are seamlessly integrated into packaging, labels, or product materials."
    },
    {
      step: "03",
      title: "Supply Chain Tracking",
      description: "Products are tracked in real-time as they move through the supply chain, recording every transaction and handoff."
    },
    {
      step: "04",
      title: "Verification & Reporting",
      description: "Stakeholders verify product authenticity instantly via scanning tools while comprehensive analytics dashboards provide actionable insights."
    }
  ];

  const marketStats = [
    { value: "$1.8T", label: "Global Counterfeit Market" },
    { value: "99.9%", label: "Authentication Accuracy" },
    { value: "100+", label: "Countries Covered" },
    { value: "24/7", label: "Real-Time Monitoring" }
  ];

  const useCases = [
    {
      icon: Pill,
      title: "Pharmaceuticals",
      description: "DSCSA-compliant serialization and authentication for prescription drugs, ensuring patient safety and regulatory compliance across the pharmaceutical supply chain.",
      tags: ["DSCSA Compliance", "Patient Safety", "Drug Authentication"],
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/20"
    },
    {
      icon: ShoppingBag,
      title: "Consumer Goods",
      description: "Protect premium brands from counterfeiting and grey market diversion with invisible authentication markers and consumer engagement tools.",
      tags: ["Brand Protection", "Consumer Engagement", "Anti-Diversion"],
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/20"
    },
    {
      icon: Landmark,
      title: "Government & Defense",
      description: "Secure authentication for government documents, defense components, and critical infrastructure with tamper-evident technologies.",
      tags: ["Document Security", "Component Auth", "Tamper Evidence"],
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Leaf,
      title: "Cannabis Compliance",
      description: "Seed-to-sale tracking and authentication solutions meeting state-level regulatory requirements for the legal cannabis industry.",
      tags: ["Seed-to-Sale", "State Compliance", "Track & Trace"],
      iconColor: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>VerifyMe - Logistics & Security Solutions | Nasdaq: VRME | AmplifiX</title>
        <meta name="description" content="VerifyMe (Nasdaq: VRME) provides patented authentication technologies and supply chain traceability solutions for brand protection and anti-counterfeiting." />
        <meta property="og:title" content="VerifyMe - Logistics & Security Solutions | Nasdaq: VRME" />
        <meta property="og:description" content="Patented authentication and traceability technologies protecting brands and consumers worldwide." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VerifyMe - Logistics & Security Solutions | Nasdaq: VRME" />
        <meta name="twitter:description" content="Authentication and supply chain traceability for brand protection." />
      </Helmet>

      <MainHeader />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Button
              variant="ghost"
              className="mb-8 gap-2 text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => navigate('/showcase')}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Showcase
            </Button>

            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10">
              Public Company • Nasdaq: VRME
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                VerifyMe
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 mb-4 font-light">
              Logistics & Security Solutions
            </p>
            
            <p className="text-lg text-white/40 mb-12 max-w-3xl mx-auto leading-relaxed">
              Patented authentication technologies and supply chain traceability solutions protecting 
              brands, consumers, and governments from counterfeiting, diversion, and fraud worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-black hover:bg-white/90 font-medium px-8"
                asChild
              >
                <a href="https://verifyme.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white font-medium px-8"
                asChild
              >
                <a href="https://www.bing.com/copilotsearch?q=VerifyMe+NASDAQ+VRME+authentication+brand+protection" target="_blank" rel="noopener noreferrer">
                  <Zap className="w-5 h-5" />
                  AmplifiX Research
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-28 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white/60">About VerifyMe</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                  Protecting Brands & Consumers Through Innovation
                </h2>
                <div className="space-y-6 text-white/60 leading-relaxed">
                  <p>
                    VerifyMe, Inc. (Nasdaq: VRME) is a technology solutions provider specializing in 
                    <span className="text-white font-semibold"> authentication and traceability technologies</span> that 
                    help brands, governments, and organizations protect their products and consumers from counterfeiting and fraud.
                  </p>
                  <p>
                    The company's <span className="text-white font-semibold">patented technologies</span> include 
                    covert luminescent pigments, smartphone-readable authentication markers, and cloud-based supply chain 
                    tracking platforms that provide end-to-end product visibility and verification capabilities.
                  </p>
                  <p>
                    VerifyMe serves critical industries including <span className="text-white font-semibold">pharmaceuticals, 
                    consumer goods, government, and cannabis</span>, where product authenticity and supply chain integrity 
                    are essential for public safety and regulatory compliance.
                  </p>
                  <p>
                    With the global counterfeit goods market estimated at over <span className="text-white font-semibold">$1.8 trillion annually</span>, 
                    VerifyMe's solutions address one of the most significant economic and public health challenges facing 
                    businesses and governments worldwide.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="border-white/20 bg-transparent backdrop-blur-sm sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-6 text-white">Company Details</h3>
                    <div className="space-y-5">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Website</div>
                        <a 
                          href="https://verifyme.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                        >
                          verifyme.com
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Industry</div>
                        <div className="text-white/80">Logistics & Security</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Ticker</div>
                        <div className="text-white/80">Nasdaq: VRME</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Founded</div>
                        <div className="text-white/80">2000</div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
                            Logistics
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                            Security
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30">
                            Authentication
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-20 border-y border-white/10 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {marketStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Solutions */}
      <section className="py-24 lg:py-32 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-white/20 mb-6">
              <Network className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/60">Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Core Solutions
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Comprehensive authentication and traceability technologies designed to protect 
              brands, secure supply chains, and ensure regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreSolutions.map((solution, index) => (
              <Card 
                key={index} 
                className="group border-white/20 bg-transparent hover:bg-white/5 hover:border-white/30 transition-all duration-500 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl ${solution.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <solution.icon className={`w-6 h-6 ${solution.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">{solution.title}</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">{solution.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {solution.examples.map((example, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/50 border border-white/5"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/[0.02] to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/60">Advantages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why VerifyMe
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Industry-leading authentication and traceability solutions delivering measurable 
              results for brands, governments, and supply chain stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-5 group">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-white/20 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/60">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              The VerifyMe Process
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              A seamless integration process from product registration to real-time 
              verification and actionable supply chain intelligence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {howItWorks.map((step, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xl text-white group-hover:from-white/20 group-hover:to-white/10 group-hover:border-white/20 transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-white/40 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <CircuitBoard className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">Technology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Built on Patented Technology
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              VerifyMe's proprietary authentication platform combines patented physical markers 
              with cloud-based intelligence for unmatched product verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-white/20 bg-transparent backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mx-auto mb-6">
                  <Fingerprint className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-3 text-white">Patented Authentication</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Proprietary covert and overt authentication markers with smartphone-readable verification capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-white/20 bg-transparent backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-6">
                  <Cloud className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-3 text-white">Cloud Platform</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Scalable cloud-based tracking and analytics platform with real-time dashboards and reporting.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-white/20 bg-transparent backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mx-auto mb-6">
                  <Plug className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-3 text-white">Enterprise Integration</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Seamless integration with existing ERP, WMS, and supply chain management systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 lg:py-32 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-white/20 mb-6">
              <Package className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/60">Applications</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Industry Applications
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              VerifyMe's solutions protect products and consumers across critical 
              industries where authenticity and traceability are essential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-white/20 bg-transparent backdrop-blur-sm hover:bg-white/5 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${useCase.bgColor} to-transparent flex items-center justify-center mb-6`}>
                    <useCase.icon className={`w-6 h-6 ${useCase.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{useCase.title}</h3>
                  <p className="text-white/40 mb-6 leading-relaxed">{useCase.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {useCase.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1 text-xs rounded-full ${useCase.bgColor.replace('/20', '/10')} ${useCase.iconColor} ${useCase.borderColor}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,20%,10%)] to-[hsl(220,15%,20%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Partner with VerifyMe
            </h2>
            <p className="text-lg text-white/50 mb-10 leading-relaxed">
              Protect your brand, secure your supply chain, and ensure regulatory compliance 
              with VerifyMe's patented authentication and traceability solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-black hover:bg-white/90 font-medium px-8"
                asChild
              >
                <a href="https://verifyme.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white font-medium px-8"
                asChild
              >
                <a href="https://www.bing.com/copilotsearch?q=VerifyMe+NASDAQ+VRME+authentication+brand+protection" target="_blank" rel="noopener noreferrer">
                  <Zap className="w-5 h-5" />
                  AmplifiX Research
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerifyMeShowcase;
