import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Video, HeartPulse, Smartphone, Shield, Zap, Network } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const VseeHealthShowcase = () => {
  useGTranslateRefresh(true);
  return (
    <>
      <Helmet>
        <title>VSee Health Inc. - Global Leader in Telehealth Solutions | AmplifiX Showcase</title>
        <meta name="description" content="Discover how VSee Health (NASDAQ: VSEE) is transforming healthcare delivery through innovative telehealth technology, remote patient monitoring, and AI-powered diagnostic tools. Learn about their global telemedicine platform." />
        <meta name="keywords" content="VSee Health, telehealth, telemedicine, remote patient monitoring, healthcare technology, NASDAQ VSEE, digital health, virtual care, RPM solutions" />
        <meta property="og:title" content="VSee Health Inc. - Revolutionizing Telehealth Worldwide" />
        <meta property="og:description" content="Leading telehealth platform provider delivering secure video consultations, remote monitoring, and integrated healthcare solutions across 100+ countries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/vsee-health" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VSee Health - Global Telehealth Innovation" />
        <meta name="twitter:description" content="Transforming healthcare delivery through cutting-edge telemedicine technology and remote patient monitoring solutions." />
        <link rel="canonical" href="https://amplifix.ai/showcase/vsee-health" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-4 py-2 border border-highlight-blue/20 text-sm font-medium">
                    NASDAQ: VSEE
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-highlight-blue">VSee Health</span><br />
                  Transforming Healthcare Delivery
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  VSee Health is a global leader in telehealth solutions, providing secure video consultation platforms, 
                  remote patient monitoring, and integrated care management systems used by healthcare providers in over 100 countries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://vseehealth.com/about" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://www.tradingview.com/symbols/NASDAQ-VSEE/" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      Stock Price (VSEE)
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-highlight-blue/20 to-highlight-blue/10 rounded-2xl p-8 border border-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Globe className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">100+</div>
                      <div className="text-sm text-muted-foreground">Countries</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Users className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">10M+</div>
                      <div className="text-sm text-muted-foreground">Consultations</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <HeartPulse className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">RPM</div>
                      <div className="text-sm text-muted-foreground">Solutions</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Shield className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">HIPAA</div>
                      <div className="text-sm text-muted-foreground">Compliant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Company Overview</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                VSee Health has been pioneering telehealth innovation since 2008, delivering enterprise-grade 
                video consultation and remote care solutions to healthcare organizations worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Building className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Founded 2008</h3>
                <p className="text-muted-foreground">
                  Established in Silicon Valley with a mission to make quality healthcare accessible to everyone, 
                  everywhere through innovative technology solutions.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Target className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  To democratize healthcare access globally by providing reliable, secure, and easy-to-use 
                  telehealth technology that connects patients with providers.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Globe className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Global Reach</h3>
                <p className="text-muted-foreground">
                  Operating across 6 continents with clients ranging from small clinics to large hospital 
                  systems, government health agencies, and international NGOs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Solutions */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Telehealth Solutions Portfolio</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                VSee Health offers a comprehensive suite of telehealth products designed for healthcare providers, 
                payers, and patients seeking high-quality virtual care experiences.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-highlight-blue/20 flex items-center justify-center flex-shrink-0">
                    <Video className="h-8 w-8 text-highlight-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">VSee Clinic - Virtual Consultation Platform</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Enterprise-grade video consultation platform featuring HD video/audio, secure messaging, 
                      e-prescribing, digital intake forms, and integrated EHR connectivity. Designed for seamless 
                      virtual visits with HIPAA-compliant security and multi-device support.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-highlight-blue/10 text-highlight-blue px-3 py-1 rounded-full text-sm">Video Consultations</span>
                      <span className="bg-highlight-blue/10 text-highlight-blue px-3 py-1 rounded-full text-sm">EHR Integration</span>
                      <span className="bg-highlight-blue/10 text-highlight-blue px-3 py-1 rounded-full text-sm">E-Prescribing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-highlight-blue/20 flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="h-8 w-8 text-highlight-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">VSee Remote Patient Monitoring (RPM)</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Comprehensive remote patient monitoring solution with connected medical devices (blood pressure, 
                      glucose, pulse oximetry, weight scales), automated data collection, real-time alerts, and 
                      care coordination tools. Enables proactive chronic disease management and post-discharge monitoring.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm">Chronic Care Management</span>
                      <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm">Connected Devices</span>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">Real-Time Alerts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">VSee Messenger - Secure Healthcare Communication</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      HIPAA-compliant messaging and collaboration platform for healthcare teams featuring secure chat, 
                      file sharing, group conversations, patient messaging, and integration with clinical workflows. 
                      Enables efficient care coordination and team communication.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-sm">Secure Messaging</span>
                      <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm">Team Collaboration</span>
                      <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-sm">Care Coordination</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Network className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Enterprise Telehealth Infrastructure</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      White-label telehealth platform for health systems and enterprises including custom branding, 
                      advanced analytics, multi-location support, provider scheduling, billing integration, and 
                      API access for custom workflows. Scalable architecture supporting thousands of concurrent sessions.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full text-sm">White-Label</span>
                      <span className="bg-teal-500/10 text-teal-500 px-3 py-1 rounded-full text-sm">API Integration</span>
                      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm">Enterprise Scale</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Position & Analysis */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Market Position & Competitive Analysis</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                VSee Health is strategically positioned in the rapidly expanding $250B+ global telehealth market, 
                with strong differentiation in enterprise healthcare and international markets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card p-8 rounded-xl border border-border">
                <BarChart3 className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold mb-4">Market Opportunity</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mt-0.5 flex-shrink-0" />
                    <span>Global telehealth market projected to reach $636B by 2028 (38.2% CAGR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mt-0.5 flex-shrink-0" />
                    <span>Remote patient monitoring market growing at 26.7% annually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mt-0.5 flex-shrink-0" />
                    <span>Increasing adoption driven by physician shortages and rural healthcare gaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mt-0.5 flex-shrink-0" />
                    <span>Post-pandemic acceleration of virtual care adoption and reimbursement</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <Target className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">Competitive Advantages</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Proven platform used by NASA, UN, DOD, and major health systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Low-bandwidth technology optimized for remote and underserved areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive end-to-end platform reducing implementation complexity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Strong international presence with multi-language support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-highlight-blue/10 to-purple-500/10 p-8 rounded-xl border border-border">
              <h3 className="text-2xl font-bold mb-6 text-center">Key Differentiators vs. Competition</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Zap className="h-10 w-10 text-highlight-blue mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Low-Bandwidth Excellence</h4>
                  <p className="text-sm text-muted-foreground">Works reliably on 3G/satellite connections, enabling care in remote regions where competitors fail</p>
                </div>
                <div className="text-center">
                  <Shield className="h-10 w-10 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Enterprise Security</h4>
                  <p className="text-sm text-muted-foreground">Military-grade encryption, HIPAA/GDPR compliance, and trusted by defense/government agencies</p>
                </div>
                <div className="text-center">
                  <Globe className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Global Infrastructure</h4>
                  <p className="text-sm text-muted-foreground">Deployed across 100+ countries with localized support and regulatory compliance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial & Stock Analysis */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Investment & Stock Analysis</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                VSee Health (NASDAQ: VSEE) represents a compelling investment opportunity in the high-growth 
                telehealth sector with multiple revenue streams and expansion catalysts.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-card p-8 rounded-xl border border-border">
                <DollarSign className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-2xl font-bold mb-6">Revenue Model & Growth Drivers</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2 text-highlight-blue">Subscription Revenue (SaaS)</h4>
                    <p className="text-sm text-muted-foreground">Recurring monthly/annual platform fees from healthcare organizations with high retention rates and expanding seat counts</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-purple-500">Transaction-Based Revenue</h4>
                    <p className="text-sm text-muted-foreground">Per-consultation fees and RPM reimbursement capture, benefiting from increasing virtual care utilization</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-blue-500">Enterprise Licensing</h4>
                    <p className="text-sm text-muted-foreground">Large-scale deployments with health systems, government agencies, and international organizations</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-green-500">Professional Services</h4>
                    <p className="text-sm text-muted-foreground">Implementation, customization, training, and ongoing technical support contracts</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <TrendingUp className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-2xl font-bold mb-6">Growth Catalysts & Opportunities</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-highlight-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">RPM Reimbursement Expansion:</span>
                      <span className="text-sm text-muted-foreground block">Medicare and private payers increasing coverage for remote monitoring services</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">International Market Penetration:</span>
                      <span className="text-sm text-muted-foreground block">Expanding in emerging markets with telehealth infrastructure development</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Strategic Partnerships:</span>
                      <span className="text-sm text-muted-foreground block">Collaborations with device manufacturers, EHR vendors, and health plans</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">AI/ML Enhancement:</span>
                      <span className="text-sm text-muted-foreground block">Integration of diagnostic AI and predictive analytics capabilities</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-highlight-blue/20 to-purple-500/20 p-8 rounded-xl border border-border text-center">
              <h3 className="text-2xl font-bold mb-4">Stock Performance & Trading Information</h3>
              <p className="text-muted-foreground mb-6">
                Monitor VSee Health's real-time stock performance, technical analysis, and market sentiment on TradingView
              </p>
              <a href="https://www.tradingview.com/symbols/NASDAQ-VSEE/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
                  View Live Stock Chart & Analysis
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Investment Highlights */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Invest in VSee Health?</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Multiple value creation opportunities position VSEE as an attractive investment in the digital health transformation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3">Market Leadership</h3>
                <p className="text-sm text-muted-foreground">
                  Established player with proven technology and blue-chip client base in high-growth telehealth sector
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <DollarSign className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3">Recurring Revenue</h3>
                <p className="text-sm text-muted-foreground">
                  SaaS business model with predictable revenue streams and strong customer retention metrics
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3">Global Expansion</h3>
                <p className="text-sm text-muted-foreground">
                  Significant international growth potential in underpenetrated emerging healthcare markets
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3">Proven Track Record</h3>
                <p className="text-sm text-muted-foreground">
                  Trusted by NASA, UN, military, and major health systems demonstrates enterprise credibility
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Amplify Your Healthcare Technology Story</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Learn how AmplifiX can help you communicate your company's innovation and growth story to investors, 
              partners, and stakeholders in the rapidly evolving digital health landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LanguageAwareLink to="/#contact">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                  Contact Us Today
                </Button>
              </LanguageAwareLink>
              <LanguageAwareLink to="/showcase">
                <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                  View More Showcases
                </Button>
              </LanguageAwareLink>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VseeHealthShowcase;
