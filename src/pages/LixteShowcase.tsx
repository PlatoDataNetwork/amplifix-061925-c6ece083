import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Globe, FileText, Pill, FlaskConical, Users, Microscope, TestTube, Shield, Target, Activity, Dna, Beaker, CheckCircle, Search } from "lucide-react";

const LixteShowcase = () => {
  return (
    <>
      <Helmet>
        <title>Lixte Biotechnology (LIXT) - PP2A Inhibitors for Cancer Treatment | AmplifiX Showcase</title>
        <meta name="description" content="Lixte Biotechnology Holdings is a clinical-stage pharmaceutical company developing first-in-class PP2A inhibitors to enhance chemotherapy and immunotherapy efficacy." />
        <meta property="og:title" content="Lixte Biotechnology - Transforming Cancer Treatment" />
        <meta property="og:description" content="Pioneering PP2A inhibitors to enhance chemotherapy and immunotherapy for cancer patients." />
        <link rel="canonical" href="https://amplifix.ai/showcase/lixte" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-cyan-500/5" />
          <div className="absolute inset-0 bg-[url('https://lixte.com/wp-content/uploads/2023/10/bg-1-2.jpg')] bg-cover bg-center opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full" />
                  <div className="relative z-10 ring-4 ring-teal-500/30 rounded-lg p-4 bg-white">
                    <span className="text-3xl font-bold text-teal-600">LIXTE</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-teal-500/15 text-teal-500 border border-teal-500/30 rounded-full text-sm font-medium">
                  Nasdaq: LIXT
                </span>
                <a 
                  href="https://finance.yahoo.com/quote/LIXT/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-teal-500 hover:text-teal-400 text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  Stock Price
                </a>
                <a 
                  href="https://d1io3yog0oux5.cloudfront.net/_c61ea0cac8a91a7d71e057f25bc5e9c6/lixte/db/1285/10976/file/2024_08_19_Lixte_Fact+sheet.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-teal-500 hover:text-teal-400 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Fact Sheet
                </a>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-teal-500">Transforming</span> Cancer<br />
                Treatment with PP2A Inhibitors
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Unveiling the first of a novel class of therapeutic agents that enhance both chemotherapy and immunotherapy efficacy
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <a href="https://lixte.com" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-teal-500/30 hover:bg-teal-500/10"
                >
                  <a href="https://d1io3yog0oux5.cloudfront.net/_c61ea0cac8a91a7d71e057f25bc5e9c6/lixte/db/1285/10976/file/2024_08_19_Lixte_Fact+sheet.pdf" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    View Fact Sheet
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-teal-500/30 hover:bg-teal-500/10"
                >
                  <a href="https://finance.yahoo.com/quote/LIXT/" target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Stock
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-teal-500/30 hover:bg-teal-500/10"
                >
                  <a href="https://www.bing.com/copilotsearch?q=Lixte+Biotechnology+LIXT&FORM=CSSCOP" target="_blank" rel="noopener noreferrer">
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
                About <span className="text-teal-500">Lixte Biotechnology</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 text-center">
                LIXTE Biotechnology Holdings, Inc. is a clinical-stage pharmaceutical company developing a new class of oncology treatments and cancer therapies called PP2A inhibitors. Our innovative approach enhances the efficacy of both chemotherapy and immunotherapy.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-card to-teal-500/5 p-6 rounded-xl border border-teal-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-teal-500/15 rounded-lg">
                      <FlaskConical className="h-5 w-5 text-teal-500" />
                    </div>
                    <h3 className="font-semibold text-lg">First-in-Class</h3>
                  </div>
                  <p className="text-muted-foreground">
                    LB-100 is a first-in-class PP2A inhibitor with a promising safety profile, demonstrated in Phase 1 clinical trials.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-card to-teal-500/5 p-6 rounded-xl border border-teal-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-teal-500/15 rounded-lg">
                      <Shield className="h-5 w-5 text-teal-500" />
                    </div>
                    <h3 className="font-semibold text-lg">No Known Competitors</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Unique approach covered by a comprehensive patent portfolio with no known competitors in the PP2A inhibitor space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LB-100 Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                <span className="text-teal-500">LB-100</span> - Lead Compound
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                A first-in-class PP2A inhibitor with demonstrated safety and anti-cancer activity
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-teal-500/40 transition-colors text-center">
                  <CheckCircle className="h-8 w-8 text-teal-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">FDA IND Status</h3>
                  <p className="text-sm text-muted-foreground">Investigational New Drug status approved</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-teal-500/40 transition-colors text-center">
                  <CheckCircle className="h-8 w-8 text-teal-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">EMA Approval</h3>
                  <p className="text-sm text-muted-foreground">Investigational Medicinal Product Dossier approved in Europe (2022)</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-teal-500/40 transition-colors text-center">
                  <CheckCircle className="h-8 w-8 text-teal-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">25+ Publications</h3>
                  <p className="text-sm text-muted-foreground">Demonstrated anti-cancer activity in peer-reviewed research</p>
                </div>
              </div>

              <div className="bg-teal-500/10 p-8 rounded-xl border border-teal-500/20">
                <h3 className="text-xl font-semibold mb-6 text-center">How LB-100 Works</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-teal-500 mb-3 flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Enhanced Chemotherapy
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        Stimulates cell cycle progression
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        Inhibits DNA repair mechanisms in cancer cells
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        Potentiates effectiveness without enhancing toxicity
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-500 mb-3 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Enhanced Immunotherapy
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        Enhances T cell proliferation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        Increases release of cytokines
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        Promotes production of neoantigens
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Clinical <span className="text-teal-500">Pipeline</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Multiple clinical trials targeting solid tumors with unmet medical needs
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-card to-purple-500/5 p-6 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-purple-500/15 text-purple-500 text-xs rounded font-medium">LB-100 + Immunotherapy</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ovarian Clear Cell Cancer</h3>
                  <p className="text-sm text-muted-foreground mb-4">Phase 1b/2 trial in collaboration with GSK at MD Anderson Cancer Center</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">NCT06065462</span>
                    <span className="text-green-500 font-medium">Recruiting</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-500/15 text-blue-500 text-xs rounded font-medium">LB-100 + Immunotherapy</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Metastatic MSS Colon Cancer</h3>
                  <p className="text-sm text-muted-foreground mb-4">Phase 1b trial targeting microsatellite stable colorectal cancer</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">NCT06012734</span>
                    <span className="text-green-500 font-medium">Recruiting</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-teal-500/5 p-6 rounded-xl border border-teal-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-teal-500/15 text-teal-500 text-xs rounded font-medium">LB-100 + Chemotherapy</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Advanced Soft Tissue Sarcoma</h3>
                  <p className="text-sm text-muted-foreground mb-4">Phase 1b/2 trial for advanced soft tissue sarcoma patients</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">NCT05809830</span>
                    <span className="text-amber-500 font-medium">Data Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Experienced <span className="text-teal-500">Leadership</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Decades of collective expertise in clinical and drug development
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="p-3 bg-teal-500/15 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Bas van der Baan</h3>
                  <p className="text-teal-500 text-sm mb-2">CEO & President</p>
                  <p className="text-xs text-muted-foreground">20+ years biotech experience, Former CCO of Agendia</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="p-3 bg-teal-500/15 rounded-full w-fit mx-auto mb-4">
                    <Microscope className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Jan Schellens, MD PhD</h3>
                  <p className="text-teal-500 text-sm mb-2">CMO</p>
                  <p className="text-xs text-muted-foreground">25+ years clinical oncology, pharmacologist</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="p-3 bg-teal-500/15 rounded-full w-fit mx-auto mb-4">
                    <Shield className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Eric Forman, Esq</h3>
                  <p className="text-teal-500 text-sm mb-2">COO & VP</p>
                  <p className="text-xs text-muted-foreground">IP, licensing, corporate transactions expert</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="p-3 bg-teal-500/15 rounded-full w-fit mx-auto mb-4">
                    <Target className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Robert Weingarten</h3>
                  <p className="text-teal-500 text-sm mb-2">CFO & VP</p>
                  <p className="text-xs text-muted-foreground">30+ years finance and SEC compliance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Investment Considerations */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Key Investment <span className="text-teal-500">Considerations</span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-colors">
                  <FlaskConical className="h-8 w-8 text-teal-500 mb-4" />
                  <h3 className="font-semibold mb-2">Clinical-Stage</h3>
                  <p className="text-sm text-muted-foreground">Developing a new class of cancer therapy called PP2A inhibitors</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-colors">
                  <Dna className="h-8 w-8 text-teal-500 mb-4" />
                  <h3 className="font-semibold mb-2">Innovative Approach</h3>
                  <p className="text-sm text-muted-foreground">Enhancing chemo- and immunotherapy efficacy with new treatment options</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-colors">
                  <Beaker className="h-8 w-8 text-teal-500 mb-4" />
                  <h3 className="font-semibold mb-2">Unique Mechanism</h3>
                  <p className="text-sm text-muted-foreground">Proprietary LB-100 compound as a safe and potent PP2A inhibitor</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-colors">
                  <Target className="h-8 w-8 text-teal-500 mb-4" />
                  <h3 className="font-semibold mb-2">Broad Impact</h3>
                  <p className="text-sm text-muted-foreground">Multiple clinical trials for solid tumors including sarcoma, ovarian, and colon cancer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent News */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Recent <span className="text-teal-500">Developments</span>
              </h2>

              <div className="space-y-4">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-teal-500/40 transition-colors">
                  <span className="text-xs text-muted-foreground">November 2025</span>
                  <h3 className="font-semibold mt-1 mb-2">Acquires Liora Technologies' Proton Therapy Platform</h3>
                  <p className="text-sm text-muted-foreground">Acquisition of proprietary proton therapy platform for cancer treatment</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-teal-500/40 transition-colors">
                  <span className="text-xs text-muted-foreground">September 2025</span>
                  <h3 className="font-semibold mt-1 mb-2">$2.6M Digital Currency Treasury Purchase</h3>
                  <p className="text-sm text-muted-foreground">Diversifying treasury and positioning for potential acquisitions</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-teal-500/40 transition-colors">
                  <span className="text-xs text-muted-foreground">Ongoing</span>
                  <h3 className="font-semibold mt-1 mb-2">DOSTAR LB-100 Study at MD Anderson</h3>
                  <p className="text-sm text-muted-foreground">Ovarian clear cell carcinoma trial supported by GSK</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-teal-500/10 via-background to-cyan-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pioneering the Future of <span className="text-teal-500">Cancer Treatment</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Learn more about how Lixte is transforming cancer care with first-in-class PP2A inhibitors.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <a href="https://lixte.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Lixte
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className="border-teal-500/30 hover:bg-teal-500/10"
                >
                  <a href="https://d1io3yog0oux5.cloudfront.net/_c61ea0cac8a91a7d71e057f25bc5e9c6/lixte/db/1285/10976/file/2024_08_19_Lixte_Fact+sheet.pdf" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Fact Sheet
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className="border-teal-500/30 hover:bg-teal-500/10"
                >
                  <a href="https://ir.lixte.com" target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Investor Relations
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

export default LixteShowcase;
