import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Film, Tv, Video, Play, Award, Star, Building2, MapPin, Clapperboard } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const FilmologyShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>Filmology Labs - World's Largest Content Creation Studio | AmplifiX</title>
        <meta name="description" content="Filmology Labs is a state-of-the-art film and television production campus in Paterson's historic mill district with 21 sound stages and 250,000 sq ft of production space." />
        <meta name="keywords" content="Filmology Labs, content creation studio, film production, television production, Alan Mruvka, E! Entertainment, Paterson Film District, VERZA TV, sound stages" />
        <meta property="og:title" content="Filmology Labs - World's Largest Content Creation Studio" />
        <meta property="og:description" content="State-of-the-art film and television production campus with 21 sound stages in Paterson's historic mill district." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/filmology" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Filmology Labs Content Creation Studios" />
        <meta name="twitter:description" content="21 sound stages, 250,000 sq ft - the future of content creation." />
        <link rel="canonical" href="https://amplifix.ai/showcase/filmology" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <Film className="h-6 w-6 text-highlight-blue" />
                <span className="text-highlight-blue font-semibold">PRIVATE</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Content Creation & Production</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Filmology Labs
                  <span className="text-highlight-blue block">The World's Largest Content Creation Studio</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                A state-of-the-art film and television production campus in Paterson's historic mill district—designed 
                for the creators of tomorrow. 21 sound stages, 250,000 sq ft of production space, just 13.5 miles from Manhattan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://filmologylabs.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Filmology Labs
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=alan+vruvka+filmologylabs+verzatv&FORM=CSSCOP" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">21</div>
                  <p className="text-muted-foreground text-sm">Sound Stages</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">250K</div>
                  <p className="text-muted-foreground text-sm">Square Feet</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">13.5</div>
                  <p className="text-muted-foreground text-sm">Miles to NYC</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">$15B+</div>
                  <p className="text-muted-foreground text-sm">E! Entertainment Value</p>
                </div>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Clapperboard className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Sound Stages</h3>
                  <p className="text-muted-foreground text-sm mt-2">21 pre-lit stages with high ceilings, soundproofing, green screens & cyc walls</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Video className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Production Suites</h3>
                  <p className="text-muted-foreground text-sm mt-2">Editing bays, post-production facilities & technology-rich amenities</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Building2 className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Flexible Spaces</h3>
                  <p className="text-muted-foreground text-sm mt-2">Collaborative workspaces, green rooms & support facilities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">A Bold New Chapter in American Storytelling</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Transforming Paterson's historic mill district into the future of content creation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Adaptive Reuse</h3>
                  <p className="text-muted-foreground">
                    Transforming historic mill structures into vibrant creative spaces—preserving character 
                    while embracing modern production demands. Breathing new life into architectural treasures 
                    that tell the story of American industry.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Creative Future</h3>
                  <p className="text-muted-foreground">
                    Sound stages, production suites, and collaborative workspaces equipped for filmmakers 
                    and digital creators of all scales. Purpose-built facilities designed for the next 
                    generation of storytellers.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Cultural Impact</h3>
                  <p className="text-muted-foreground">
                    Positioning Paterson as a hub for film, media, and innovation while honoring its 
                    extraordinary architectural legacy. Creating economic opportunities for generations to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Creators Come Together</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  A thriving ecosystem where production companies, independent filmmakers, content creators, and artists converge
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Film className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Production Companies</h3>
                  <p className="text-muted-foreground">
                    From major studios to boutique production houses with world-class infrastructure
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Independent Filmmakers</h3>
                  <p className="text-muted-foreground">
                    Professional-grade stages and equipment for visionary independent storytellers
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Video className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Content Creators</h3>
                  <p className="text-muted-foreground">
                    Purpose-built spaces for digital creators pushing short-form and streaming content
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Artists & Musicians</h3>
                  <p className="text-muted-foreground">
                    Music video production, live performance capture, and immersive visual experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership</h2>
              <h3 className="text-2xl font-semibold text-highlight-blue mb-6">Alan Mruvka</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The visionary who revolutionized entertainment and celebrity-based television as the 
                Co-Founder of E! Entertainment Television—now an NBC/Comcast company valued at over $15 billion.
              </p>
              <p className="text-muted-foreground mb-8">
                He recently announced VERZA TV, the first U.S.-based mobile app dedicated primarily to 
                vertical micro-dramas. The platform debuted with an unprecedented 80 original titles, 
                immediately positioning VERZA TV as the new leader in short-form, premium storytelling.
              </p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">$15B+</div>
                  <p className="text-sm text-muted-foreground">E! Entertainment valuation</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">80+</div>
                  <p className="text-sm text-muted-foreground">VERZA TV original titles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">The Heart of the Paterson Film District</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Positioned at the crossroads of history and opportunity, with unmatched access to NYC and the nation's largest media market
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card border rounded-lg p-8 text-center">
                  <MapPin className="h-10 w-10 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">13.5 Miles to Central Park</h3>
                  <p className="text-muted-foreground">Direct access to Manhattan and the broader tri-state media market</p>
                </div>

                <div className="bg-card border rounded-lg p-8 text-center">
                  <Building2 className="h-10 w-10 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Strategic Access</h3>
                  <p className="text-muted-foreground">Proximity to Route 80, I-95, and Newark Liberty International Airport</p>
                </div>

                <div className="bg-card border rounded-lg p-8 text-center">
                  <Tv className="h-10 w-10 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">250,000 SQ FT Campus</h3>
                  <p className="text-muted-foreground">Multi-story interconnected mill structures on approximately 3 acres</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-muted-foreground">
                  <strong>Address:</strong> 61 State Street, Paterson, New Jersey 07514
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-variant text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let's Make Content
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Filmology Labs is more than an adaptive reuse—it's an opportunity to ignite a new industry 
                in Paterson and build a destination where imagination, history, and future potential converge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <a href="https://filmologylabs.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Inquire Now
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <LanguageAwareLink to="/contact" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Discuss Partnership
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

export default FilmologyShowcase;