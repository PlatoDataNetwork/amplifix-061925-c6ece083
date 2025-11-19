import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Brain, Stethoscope, Shield, Cloud, Smartphone, Eye, Activity } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import thumbnailImage from "/lovable-uploads/facialdx-thumbnail.png";

const FacialDXShowcase = () => {
  return (
    <>
      <Helmet>
        <title>FacialDX - AI-Powered Health Screening Technology | AmplifiX Showcase</title>
        <meta name="description" content="Discover how FacialDX is revolutionizing global health and wellness with cutting-edge AI and machine learning to screen for head injury, PTSD, depression, and despair through non-invasive facial analysis." />
        <meta name="keywords" content="FacialDX, AI health diagnostics, head injury detection, PTSD screening, TBI detection, depression screening, AI facial analysis, mental health technology, veteran health" />
        <meta property="og:title" content="FacialDX - AI-Powered Health Screening Technology" />
        <meta property="og:description" content="Non-invasive AI screening for head injury, PTSD, depression, and despair through advanced facial analysis." />
        <meta property="og:image" content={thumbnailImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/facial-dx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FacialDX - Revolutionizing Health Diagnostics" />
        <meta name="twitter:description" content="AI-powered facial analysis for early detection of psychological and physiological conditions." />
        <meta name="twitter:image" content={thumbnailImage} />
        <link rel="canonical" href="https://amplifix.ai/showcase/facial-dx" />
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
                    Private AI Health Diagnostics Company
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-highlight-blue">FacialDX</span><br />
                  Revolutionizing Global Health & Wellness
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Advanced AI screening technology detecting early indicators of head injury, PTSD, depression, and despair through non-invasive facial analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://facialdx.com/" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://app.facialdx.com/" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      Try Free Analysis
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={thumbnailImage}
                  alt="FacialDX AI Screening Technology"
                  className="w-full rounded-lg shadow-2xl border border-border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About FacialDX</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Brain className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Advanced AI Technology</h3>
                  <p className="text-muted-foreground">
                    FacialDx leverages cutting-edge artificial intelligence and machine learning to analyze dynamic facial features, detecting early indicators of psychological and physiological conditions in seconds.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Shield className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Secure & Compliant</h3>
                  <p className="text-muted-foreground">
                    Hosted on AWS Cloud with robust security protocols, advanced encryption, and GDPR compliance. Your privacy is paramount with our privacy-by-design approach.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Eye className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Non-Invasive Screening</h3>
                  <p className="text-muted-foreground">
                    Our technology analyzes facial features to detect indicators associated with head injury, TBI, CTE, PTSD, depression, and despair—all without invasive procedures.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Activity className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Early Intervention</h3>
                  <p className="text-muted-foreground">
                    Empowering individuals and healthcare providers with rapid, reliable insights that facilitate earlier intervention and better outcomes for those affected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mobile & Web Access</h3>
                    <p className="text-muted-foreground">
                      Access FacialDX through our mobile or web-based application for convenient screening anywhere, anytime.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
                    <p className="text-muted-foreground">
                      Advanced machine learning algorithms analyze facial features to detect subtle indicators of conditions like TBI, PTSD, depression, and despair.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Instant Results</h3>
                    <p className="text-muted-foreground">
                      Receive precise insights in seconds, bridging the critical gap between symptom onset and clinical diagnosis.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Professional Support</h3>
                    <p className="text-muted-foreground">
                      Results facilitate connections to qualified healthcare professionals for proper medical evaluation and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Users */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Supporting Our Heroes</h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
                FacialDX is designed to support those who face the greatest challenges—veterans, first responders, firefighters, law enforcement, EMTs, and ambulance crews who carry invisible scars.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Users className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Veterans</h3>
                  <p className="text-muted-foreground">
                    Supporting those who served with early detection of combat-related conditions
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Shield className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">First Responders</h3>
                  <p className="text-muted-foreground">
                    Helping EMTs, firefighters, and police manage the toll of daily emergencies
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Activity className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">General Public</h3>
                  <p className="text-muted-foreground">
                    Accessible screening for anyone concerned about their mental and physical health
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience FacialDX Today</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Limited time: Try our free head injury analysis and discover how AI-powered facial screening can provide early insights into your health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://app.facialdx.com/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                    Start Free Analysis
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="https://facialdx.com/contact" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                    Contact Us
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">
                This evaluation is not a medical diagnosis and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Please consult a qualified healthcare professional for further evaluation.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Showcase */}
        <div className="py-12 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <LanguageAwareLink to="/showcase">
              <Button variant="outline" size="lg">
                ← Back to Showcase
              </Button>
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacialDXShowcase;
