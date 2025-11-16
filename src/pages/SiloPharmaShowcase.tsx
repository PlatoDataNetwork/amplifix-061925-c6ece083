
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Brain, Stethoscope, Pill, Beaker, Microscope } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";

const SiloPharmaShowcase = () => {
  return (
    <>
      <Helmet>
        <title>SILO Pharma Inc. - Revolutionizing Neuropsychiatric Drug Development | AmplifiX Showcase</title>
        <meta name="description" content="Discover how SILO Pharma (NASDAQ: SILO) is pioneering next-generation neuropsychiatric treatments through AI-driven drug development and psychedelic medicine research. Learn about their innovative approach to mental health therapeutics." />
        <meta name="keywords" content="SILO Pharma, neuropsychiatric drugs, psychedelic medicine, mental health therapeutics, drug development, NASDAQ SILO, pharmaceutical innovation, AI drug discovery" />
        <meta property="og:title" content="SILO Pharma Inc. - Revolutionizing Neuropsychiatric Drug Development" />
        <meta property="og:description" content="Leading pharmaceutical company developing breakthrough neuropsychiatric treatments through innovative drug development and psychedelic medicine research." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/silo-pharma" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SILO Pharma - Next-Generation Neuropsychiatric Therapeutics" />
        <meta name="twitter:description" content="Pioneering mental health treatments through AI-driven drug development and psychedelic medicine research." />
        <link rel="canonical" href="https://amplifix.ai/showcase/silo-pharma" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-green-500/10 text-green-500 rounded-full px-4 py-2 border border-green-500/20 text-sm font-medium">
                    NASDAQ: SILO
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-highlight-blue">SILO Pharma</span><br />
                  Pioneering Mental Health Innovation
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  SILO Pharma Inc. is a developmental pharmaceutical company focused on developing next-generation 
                  therapeutics that target the pathophysiology of neuropsychiatric and neurological disorders.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://ir.silopharma.com/" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                      Investor Relations
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://ir.silopharma.com/assets/uploads/2024/09/SILO-FINAL-presentation_9.4.24.pdf" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      SILO Presentation
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://ir.silopharma.com/assets/uploads/2025/03/SILO_Fact-Sheet_3.13.25_V4.pdf" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      Investor Fact Sheet
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-highlight-blue/20 to-green-500/20 rounded-2xl p-8 border border-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Pill className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">5+</div>
                      <div className="text-sm text-muted-foreground">Drug Programs</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Beaker className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">Novel</div>
                      <div className="text-sm text-muted-foreground">Therapeutics</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">CNS</div>
                      <div className="text-sm text-muted-foreground">Focus</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Microscope className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">AI-Driven</div>
                      <div className="text-sm text-muted-foreground">Research</div>
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
                SILO Pharma is at the forefront of neuropsychiatric drug development, leveraging cutting-edge 
                research and innovative approaches to address unmet medical needs in mental health.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Building className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Founded</h3>
                <p className="text-muted-foreground">
                  Established as a leading pharmaceutical company dedicated to developing innovative 
                  neuropsychiatric therapeutics for patients worldwide.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  To develop next-generation therapeutics that target the pathophysiology of 
                  neuropsychiatric and neurological disorders.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <Globe className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Vision</h3>
                <p className="text-muted-foreground">
                  To transform mental healthcare through innovative drug development and 
                  breakthrough therapeutic solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Programs */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Key Development Programs</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                SILO Pharma's pipeline includes innovative approaches to treating depression, ADHD, 
                and other neuropsychiatric conditions through novel therapeutic mechanisms.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-highlight-blue/20 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-8 w-8 text-highlight-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">SP-26 (Ketamine)</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      An intranasal ketamine product being developed for treatment-resistant depression. 
                      This innovative delivery system aims to provide rapid-acting antidepressant effects 
                      with improved patient convenience and compliance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-highlight-blue/10 text-highlight-blue px-3 py-1 rounded-full text-sm">Treatment-Resistant Depression</span>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">Intranasal Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">SPC-15 (Psilocybin)</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      A targeted psilocybin-based therapeutic designed to treat various mental health conditions. 
                      This program leverages the growing body of research supporting psychedelic medicine 
                      for treatment-resistant psychiatric disorders.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm">Psychedelic Medicine</span>
                      <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm">Mental Health</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Microscope className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Additional Pipeline Programs</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      SILO Pharma continues to advance multiple programs targeting ADHD, anxiety disorders, 
                      and other neuropsychiatric conditions through innovative drug development approaches 
                      and strategic partnerships.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-sm">ADHD</span>
                      <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm">Anxiety Disorders</span>
                      <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-sm">CNS Therapeutics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Advantages */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Competitive Advantages</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                SILO Pharma's unique approach combines innovative drug development with cutting-edge 
                research methodologies to create breakthrough therapeutic solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-highlight-blue mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Novel Therapeutic Approaches</h3>
                    <p className="text-muted-foreground">
                      Pioneering innovative delivery systems and formulations for established compounds 
                      to improve efficacy and patient outcomes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Psychedelic Medicine Focus</h3>
                    <p className="text-muted-foreground">
                      Strategic focus on psychedelic-based therapeutics, positioning the company 
                      at the forefront of this emerging treatment paradigm.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Experienced Leadership</h3>
                    <p className="text-muted-foreground">
                      Led by industry veterans with extensive experience in pharmaceutical 
                      development and regulatory affairs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Strategic Partnerships</h3>
                    <p className="text-muted-foreground">
                      Collaborative approach with research institutions and industry partners 
                      to accelerate drug development timelines.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Regulatory Expertise</h3>
                    <p className="text-muted-foreground">
                      Deep understanding of regulatory pathways for neuropsychiatric therapeutics, 
                      including novel drug categories.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Market Opportunity</h3>
                    <p className="text-muted-foreground">
                      Addressing significant unmet medical needs in the multi-billion dollar 
                      neuropsychiatric therapeutics market.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Highlights */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Investment Highlights</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                SILO Pharma represents a compelling investment opportunity in the rapidly growing 
                neuropsychiatric therapeutics sector with multiple value creation catalysts.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Growth Market</h3>
                <p className="text-muted-foreground text-sm">
                  Positioned in the rapidly expanding neuropsychiatric therapeutics market
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Lightbulb className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Novel approaches to established compounds with improved delivery systems
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Leadership</h3>
                <p className="text-muted-foreground text-sm">
                  Experienced management team with proven track record in pharma
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Pipeline Value</h3>
                <p className="text-muted-foreground text-sm">
                  Multiple programs targeting high-value therapeutic areas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto py-16 px-4 bg-gradient-to-r from-highlight-blue/10 to-green-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Stay Connected with SILO Pharma</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Follow SILO Pharma's journey as they continue to advance breakthrough neuropsychiatric 
              therapeutics and create value for patients and shareholders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://ir.silopharma.com/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                  Visit Investor Relations
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <LanguageAwareLink to="/">
                <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                  Learn About AmplifiX
                </Button>
              </LanguageAwareLink>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto py-8 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">
                This showcase is powered by AmplifiX - AI-driven corporate communications platform
              </p>
              <p className="text-sm">
                Information sourced from public filings and company disclosures. 
                Visit <a href="https://ir.silopharma.com/" className="text-highlight-blue hover:underline" target="_blank" rel="noopener noreferrer">
                  ir.silopharma.com
                </a> for official company information.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SiloPharmaShowcase;
