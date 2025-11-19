import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ChevronLeft, ChevronRight, Home, Brain, Heart, Target, Microscope, Users, TrendingUp, Lightbulb, Shield, FileText, Calendar, CheckCircle, DollarSign, Activity } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";

const SynbioInteractivePresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      title: "Synbio International Inc",
      subtitle: "Supporting Wellness Through AI Innovation",
      content: (
        <div className="text-center space-y-8">
          <div className="inline-block bg-highlight-blue/10 text-highlight-blue rounded-full px-6 py-3 border border-highlight-blue/20 text-lg font-medium">
            OTC: SYIN
          </div>
          <h1 className="text-6xl font-bold">
            <span className="text-highlight-blue">Synbio</span> International
          </h1>
          <p className="text-2xl text-muted-foreground">Investor Presentation</p>
          <p className="text-xl text-muted-foreground">March 2025</p>
          <div className="pt-8">
            <p className="text-sm text-muted-foreground italic">Supporting Wellness</p>
          </div>
        </div>
      )
    },
    
    // Slide 2: Corporate Structure
    {
      title: "Corporate Structure",
      subtitle: "Dual-Division Strategy",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-card to-highlight-blue/5 border-highlight-blue/20">
              <CardContent className="p-8">
                <Brain className="w-16 h-16 text-highlight-blue mb-4" />
                <h3 className="text-2xl font-bold mb-4">Clinical Division</h3>
                <p className="text-lg mb-4">AI Medtech Development</p>
                <p className="text-muted-foreground mb-6">Mental Health Facial Analysis App</p>
                <div className="inline-block bg-highlight-blue/10 px-4 py-2 rounded-full text-sm font-medium text-highlight-blue">
                  Significant Blue Sky Potential
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-green-500/5 border-green-500/20">
              <CardContent className="p-8">
                <Heart className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Non-Clinical Division</h3>
                <p className="text-lg mb-4">Market Ready Nutraceuticals</p>
                <p className="text-muted-foreground mb-6">Natural wellness products</p>
                <div className="inline-block bg-green-500/10 px-4 py-2 rounded-full text-sm font-medium text-green-500">
                  Early Revenue Opportunity
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 3: Mission
    {
      title: "Our Mission",
      subtitle: "Transforming Healthcare Through AI",
      content: (
        <div className="space-y-8">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <Target className="w-16 h-16 text-highlight-blue mb-6 mx-auto" />
              <p className="text-2xl text-center mb-8 leading-relaxed">
                Our mission is to develop <span className="text-highlight-blue font-semibold">AI-based diagnostic technology</span> and products that will improve people's health & wellness.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <Activity className="w-12 h-12 text-highlight-blue mb-4 mx-auto" />
                <h4 className="font-bold mb-2">Earlier Diagnosis</h4>
                <p className="text-sm text-muted-foreground">AI processes enormous data amounts</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-12 h-12 text-highlight-blue mb-4 mx-auto" />
                <h4 className="font-bold mb-2">Increased Accuracy</h4>
                <p className="text-sm text-muted-foreground">Advanced algorithms improve precision</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-highlight-blue mb-4 mx-auto" />
                <h4 className="font-bold mb-2">Reduced Costs</h4>
                <p className="text-sm text-muted-foreground">More effective treatments, lower healthcare costs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 4: Mental Health Focus
    {
      title: "Mental Health",
      subtitle: "Screening Using Artificial Intelligence",
      content: (
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-card to-purple-500/10 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <Brain className="w-20 h-20 text-purple-500 mb-6 mx-auto" />
              <h3 className="text-3xl font-bold mb-6">AI-Powered Mental Health Screening</h3>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                The Company will initially focus heavily on using Artificial Intelligence-powered solutions to detect mental health conditions.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-card to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <CheckCircle className="w-10 h-10 text-purple-500 mb-4" />
                <h4 className="text-lg font-bold mb-2">Non-Invasive</h4>
                <p className="text-muted-foreground">Simple facial analysis using mobile devices</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <CheckCircle className="w-10 h-10 text-purple-500 mb-4" />
                <h4 className="text-lg font-bold mb-2">Immediate Results</h4>
                <p className="text-muted-foreground">Instant screening based on biological data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 5: The Problem
    {
      title: "The Problem",
      subtitle: "A Slippery Slope in Mental Health Diagnosis",
      content: (
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
            <CardContent className="p-8">
              <Shield className="w-16 h-16 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold mb-6 text-red-500">Current Challenges</h3>
              <div className="space-y-4 text-lg">
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Current methods are subjective, often leading to non-diagnosis or misdiagnosis</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>More than half of adults with mental illness in the US do not receive appropriate medication treatment</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Inadequate or lack of proper screening tools</span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">Source: Mental Health America, National Alliance on Mental Illness</p>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 6: The Solution - NIMS
    {
      title: "The Solution",
      subtitle: "NIMS - Non-Invasive Mental Health Screening",
      content: (
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-card to-green-500/5 border-green-500/20">
            <CardContent className="p-8">
              <Microscope className="w-16 h-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold mb-6">How NIMS Works</h3>
              <p className="text-lg mb-6 leading-relaxed">
                NIMS can detect depressive symptoms immediately using <span className="text-highlight-blue font-semibold">facial analysis</span>.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                It employs advanced AI and machine learning algorithms, integrated into an app, that analyzes facial features from high-definition images captured by mobile phones or desktop devices.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This technology provides instant results – based on the patient's own biological data - enabling clinicians to swiftly and cost-effectively identify signs of depression.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 7: How NIMS Works
    {
      title: "How NIMS Works",
      subtitle: "Simple 3-Step Process",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-highlight-blue/10 rounded-full flex items-center justify-center text-2xl font-bold text-highlight-blue mb-4 mx-auto">
                  1
                </div>
                <h4 className="text-lg font-bold mb-3">Download & Upload</h4>
                <p className="text-muted-foreground">Patient downloads app and uploads photo</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-highlight-blue/10 rounded-full flex items-center justify-center text-2xl font-bold text-highlight-blue mb-4 mx-auto">
                  2
                </div>
                <h4 className="text-lg font-bold mb-3">AI Analysis</h4>
                <p className="text-muted-foreground">Facial photo analyzed by NIMS. Repeat periodically to monitor treatment effectiveness</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-highlight-blue/10 rounded-full flex items-center justify-center text-2xl font-bold text-highlight-blue mb-4 mx-auto">
                  3
                </div>
                <h4 className="text-lg font-bold mb-3">Results Delivered</h4>
                <p className="text-muted-foreground">Result reported to patient and/or clinician</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 8: The Benefits
    {
      title: "The Benefits",
      subtitle: "Why NIMS Stands Out",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="text-xl font-bold mb-3">Easy to Use</h4>
              <p className="text-muted-foreground">Simple mobile app interface requiring only a selfie</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="text-xl font-bold mb-3">Non-Invasive</h4>
              <p className="text-muted-foreground">No needles, no labs, no uncomfortable procedures</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="text-xl font-bold mb-3">Cost-Effective</h4>
              <p className="text-muted-foreground">Significantly lower cost than traditional screening methods</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="text-xl font-bold mb-3">Immediate Result</h4>
              <p className="text-muted-foreground">Real-time analysis and instant feedback</p>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 9: FDA Path
    {
      title: "Path to FDA Regulation",
      subtitle: "Strategic Commercialization Timeline",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-card to-highlight-blue/5 border-highlight-blue/20">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-highlight-blue mb-4" />
                <h4 className="text-lg font-bold mb-4">Feasibility Trial</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 50 Participants</li>
                  <li>• Retrospective</li>
                  <li>• Single site</li>
                  <li>• Complete 2025</li>
                </ul>
                <p className="mt-4 text-sm font-semibold text-highlight-blue">Cost: $200K-$250K</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-purple-500 mb-4" />
                <h4 className="text-lg font-bold mb-4">Validation Trial</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 100-150 Participants</li>
                  <li>• Prospective</li>
                  <li>• Multiple sites</li>
                  <li>• Complete 2027</li>
                </ul>
                <p className="mt-4 text-sm font-semibold text-purple-500">Cost: $1.0M-$1.5M</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h4 className="text-lg font-bold mb-4">FDA & Launch</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• FDA Submission</li>
                  <li>• 2027/28 Timeline</li>
                  <li>• Commercial Roll-out</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 10: Nutraceuticals
    {
      title: "Nutraceutical Division",
      subtitle: "Market Ready Products for Early Revenue",
      content: (
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-card to-green-500/5 border-green-500/20">
            <CardContent className="p-8">
              <Heart className="w-16 h-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold mb-6">Nature's Recipe</h3>
              <p className="text-lg mb-6 leading-relaxed">
                Natural wellness products designed to support the body's inherent ability to heal.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm font-medium">Natural</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm font-medium">Safe</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm font-medium">Effective</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm font-medium">Market Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 11: Thank You
    {
      title: "Thank You",
      subtitle: "Supporting Wellness Through Innovation",
      content: (
        <div className="text-center space-y-8">
          <div className="inline-block bg-highlight-blue/10 text-highlight-blue rounded-full px-6 py-3 border border-highlight-blue/20 text-lg font-medium">
            OTC: SYIN
          </div>
          <h2 className="text-5xl font-bold">
            <span className="text-highlight-blue">Synbio</span> International
          </h2>
          <p className="text-xl text-muted-foreground">Supporting Wellness</p>
          
          <div className="pt-8 space-y-4">
            <Card className="bg-card border-border max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Contact Information</h3>
                <p className="text-sm text-muted-foreground mb-2">Claudio Solitario</p>
                <p className="text-sm text-muted-foreground">claudesolitario58@gmail.com</p>
                <p className="text-sm text-muted-foreground mt-4">USA: +1 (646) 359-4854</p>
                <p className="text-sm text-muted-foreground">Australia: +61 416 096 856</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <LanguageAwareLink to="/showcase/synbio">
              <Button size="lg" variant="outline">View Showcase</Button>
            </LanguageAwareLink>
            <a href="https://www.synbiointl.com/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-highlight-blue">Visit Website</Button>
            </a>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Synbio International - Interactive Presentation | AmplifiX</title>
        <meta name="description" content="Interactive investor presentation for Synbio International Inc (OTC: SYIN) - AI-powered mental health diagnostics and natural wellness solutions." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <MainHeader />
        
        {/* Synbio Presentation Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-highlight-blue to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  <span className="text-highlight-blue">Synbio</span> International
                </h2>
                <p className="text-xs text-muted-foreground">Investor Presentation</p>
              </div>
              <div className="ml-auto">
                <div className="inline-block bg-highlight-blue/10 text-highlight-blue rounded-full px-3 py-1 border border-highlight-blue/20 text-sm font-medium">
                  OTC: SYIN
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <LanguageAwareLink to="/showcase/synbio">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Back to Showcase
              </Button>
            </LanguageAwareLink>
            <div className="w-32" />
          </div>

          {/* Slide Content */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">{slides[currentSlide].title}</h1>
              <p className="text-lg text-muted-foreground">{slides[currentSlide].subtitle}</p>
            </div>
            
            <div className="min-h-[500px] flex items-center justify-center">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </p>
            
            <div className="flex gap-2 mb-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-highlight-blue w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 w-full max-w-2xl">
              <Button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              <Button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SynbioInteractivePresentation;
