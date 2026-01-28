import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Beaker, FlaskConical, Activity, Brain, Heart, Syringe, Microscope, Dna, Shield, Pill, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const BioxytranShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>Bioxytran Inc - Glycovirology & Oxygen Therapeutics | AmplifiX</title>
        <meta name="description" content="Bioxytran is a clinical stage pharmaceutical company developing platform technologies in Glycovirology, Hypoxia and Degenerative Diseases using carbohydrate drug design." />
        <meta name="keywords" content="Bioxytran, BIXT, Glycovirology, ProLectin, BXT-25, oxygen therapeutics, galectin inhibitor, carbohydrate drug, David Platt PhD" />
        <meta property="og:title" content="Bioxytran Inc - Glycovirology & Oxygen Therapeutics" />
        <meta property="og:description" content="Clinical stage pharmaceutical company developing platform technologies to eliminate viruses and prolong lifespan using carbohydrate drug design." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/bioxytran" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bioxytran Inc - OTCMKTS:BIXT" />
        <meta name="twitter:description" content="Developing breakthrough treatments in Glycovirology and Oxygen Therapeutics." />
        <link rel="canonical" href="https://amplifix.ai/showcase/bioxytran" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <FlaskConical className="h-6 w-6 text-highlight-blue" />
                <span className="text-highlight-blue font-semibold">OTCMKTS:BIXT</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Biotech & Pharmaceuticals</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Bioxytran Inc
                  <span className="text-highlight-blue block">Glycovirology & Oxygen Therapeutics</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                A clinical stage pharmaceutical company developing platform technologies in Glycovirology, 
                Hypoxia and Degenerative Diseases to eliminate viruses and prolong lifespan using carbohydrate drug design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://www.bioxytraninc.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=BIOXYTRAN+BIXT=DAVID+PRATT+PHD" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Beaker className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Glycovirology</h3>
                  <p className="text-muted-foreground text-sm mt-2">Novel glycan-based antiviral platform</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Activity className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Oxygen Therapeutics</h3>
                  <p className="text-muted-foreground text-sm mt-2">Nanoscale oxygen carriers for hypoxia</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Dna className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Carbohydrate Drug Design</h3>
                  <p className="text-muted-foreground text-sm mt-2">Pioneering Galectin inhibitor technology</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Company Overview</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Building on decades of research in carbohydrate chemistry and Galectin science
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-lg p-8">
                  <Microscope className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Scientific Foundation</h3>
                  <p className="text-muted-foreground">
                    Bioxytran uses Galectin inhibitors to combat viruses including SARS-CoV-2. The technology is built 
                    on the lifetime work of founder David Platt, PhD, who first expressed and named the Human Galectin-3 
                    protein coded by the LGALS3 gene on chromosome 14.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Shield className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Galectin Antagonists</h3>
                  <p className="text-muted-foreground">
                    Galectin inhibitors block the binding of galectins to carbohydrate structures present in numerous 
                    diseases, reducing their capability to replicate. Dr. Platt has used this knowledge to create 
                    significant sustainable therapeutic solutions.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Heart className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Hypoxia Treatment</h3>
                  <p className="text-muted-foreground">
                    Developing treatments for hypoxic conditions, necrosis, and degenerative diseases utilizing 
                    oxygen delivery to affected areas for stroke, wound, and brain damage treatment with issued 
                    patents and proprietary technology.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Syringe className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Immune Modulation</h3>
                  <p className="text-muted-foreground">
                    Evidence shows carbohydrate drugs are capable of modulating the immune system. The Galectin 
                    antagonist reduces trafficking of macrophages, helping to modulate the cytokine storm and 
                    restore immune homeostasis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ProLectin Pipeline Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">ProLectin Pipeline</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Glycovirology platform targeting viral infections at multiple stages
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Pill className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg text-highlight-blue">ProLectin-M</h3>
                  <p className="text-muted-foreground text-sm mt-2">Chewable polysaccharide tablet for early stage COVID-19</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Syringe className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg text-highlight-blue">ProLectin-I</h3>
                  <p className="text-muted-foreground text-sm mt-2">IV treatment for more severe cases of COVID-19</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Activity className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg text-highlight-blue">ProLectin-A</h3>
                  <p className="text-muted-foreground text-sm mt-2">Treatment of ARDS as a result of COVID-19</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Heart className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg text-highlight-blue">ProLectin-F</h3>
                  <p className="text-muted-foreground text-sm mt-2">IV treatment of lung-fibrosis from ventilator use</p>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">Mechanism of Action</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Galectin Antagonist molecule is designed to stay in the blood and attach to viral protein spikes. 
                  When the inhibitor binds to the spike, it effectively tags the virus for elimination through the liver. 
                  Galectins participate in antiviral defense from initial virus recognition through activation and 
                  amplification of both innate and adaptive immune responses. This first-in-class inhibitor covers a 
                  range of Galectins associated with viral replication, adhesion, and immune system modulation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BXT-25 Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">BXT-25 - Oxygen Therapeutics</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Next-generation treatment for stroke, wound healing, and trauma
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Stroke Treatment</h3>
                  <p className="text-muted-foreground">
                    Delivering nanoscale oxygen carriers to affected brain tissues
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Wound Healing</h3>
                  <p className="text-muted-foreground">
                    Oxygen delivery to accelerate tissue repair and regeneration
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Trauma Care</h3>
                  <p className="text-muted-foreground">
                    Anti-necrosis drugs preventing hypoxic tissue damage
                  </p>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-8 max-w-4xl mx-auto mt-12">
                <h3 className="text-xl font-semibold mb-4 text-center">Proprietary Technology</h3>
                <p className="text-muted-foreground leading-relaxed">
                  BXT-25 oxygen therapeutics are a new class of pharmaceuticals administered intravenously to transport 
                  oxygen to the body's tissues. The platform includes an issued patent related to co-polymer technology 
                  (expiring February 2029) and an exclusive license for OxySense FDA-approved technology monitoring NADH, 
                  the control marker in the body's conversion of oxygen to energy, providing clinical endpoints for 
                  measuring oxygen supply to the brain in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  World-class expertise in carbohydrate chemistry and clinical development
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-highlight-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-highlight-blue" />
                  </div>
                  <h3 className="text-lg font-semibold">David Platt, PhD</h3>
                  <p className="text-highlight-blue text-sm mb-3">CEO & Chairman</p>
                  <p className="text-muted-foreground text-sm">
                    World-renowned expert in carbohydrate chemistry. Founded three publicly traded companies, 
                    creating nearly $1B for investors. Led development of two drug candidates through Phase II clinical trials.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-highlight-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-highlight-blue" />
                  </div>
                  <h3 className="text-lg font-semibold">Dr. Leslie Ajayi, MD, PhD</h3>
                  <p className="text-highlight-blue text-sm mb-3">CMO & Medical Advisory Board Chief</p>
                  <p className="text-muted-foreground text-sm">
                    20+ years clinical development experience. Fully trained physician with specialty training in 
                    internal medicine, cardiovascular medicine, and clinical pharmacology.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-highlight-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-highlight-blue" />
                  </div>
                  <h3 className="text-lg font-semibold">Ola Soderquist</h3>
                  <p className="text-highlight-blue text-sm mb-3">CFO (CPA, CMA, CM&AA)</p>
                  <p className="text-muted-foreground text-sm">
                    30+ years of senior international entrepreneurial management experience. Former roles at 
                    Electrolux, Ericsson, Swedish Match, SKF AB, and Belden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Thesis Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Considerations</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Bioxytran is positioned at the intersection of antiviral innovation and oxygen therapeutics, 
                with proprietary technology built on decades of research. The company's dual-platform approach 
                addresses both viral diseases and hypoxic conditions with first-in-class drug candidates.
              </p>
              <div className="flex justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">2</div>
                  <p className="text-sm text-muted-foreground">Platform Technologies</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">4+</div>
                  <p className="text-sm text-muted-foreground">Drug Candidates</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">28</div>
                  <p className="text-sm text-muted-foreground">Years Galectin Research</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">$1B+</div>
                  <p className="text-sm text-muted-foreground">Founder Track Record</p>
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
                Pioneering Carbohydrate Drug Design
              </h2>
              <p className="text-xl mb-8 text-muted-foreground">
                Bioxytran is developing breakthrough therapies to eliminate viruses and treat hypoxic conditions, 
                building on decades of scientific innovation in Galectin research and oxygen therapeutics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[hsl(220,20%,15%)] hover:bg-[hsl(220,20%,20%)] text-white border border-white/20">
                  <a href="https://www.bioxytraninc.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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

export default BioxytranShowcase;
