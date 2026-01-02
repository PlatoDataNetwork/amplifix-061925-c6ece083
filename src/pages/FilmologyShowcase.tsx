import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Film, Tv, Video, Play, Award, Star, Clapperboard, Camera } from "lucide-react";
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
        <title>Filmology Showcase - Entertainment & Media Innovation | AmplifiX</title>
        <meta name="description" content="Discover Filmology - a leading entertainment and media company innovating in film, television, and digital content production." />
        <meta name="keywords" content="Filmology, entertainment, media, film production, television, digital content, Alan Vruvka, VerzaTV, FilmologyLabs" />
        <meta property="og:title" content="Filmology Showcase - Entertainment & Media Innovation" />
        <meta property="og:description" content="Leading entertainment and media company transforming content creation and distribution." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/filmology" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Filmology Entertainment Showcase" />
        <meta name="twitter:description" content="Innovative entertainment and media solutions for the digital age." />
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
                <span className="text-muted-foreground">Entertainment & Media</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Filmology
                  <span className="text-highlight-blue block">Entertainment & Media Innovation</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                Filmology is a pioneering entertainment and media company at the forefront of content creation, 
                production, and distribution. With innovative approaches to film, television, and digital media, 
                Filmology is shaping the future of entertainment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://filmology.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Filmology
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=alan+vruvka+filmologylabs+verzatv&FORM=CSSCOP" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Clapperboard className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Film Production</h3>
                  <p className="text-muted-foreground text-sm mt-2">Professional film production and post-production services</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Tv className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Television</h3>
                  <p className="text-muted-foreground text-sm mt-2">Original TV content creation and broadcasting</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Video className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Digital Media</h3>
                  <p className="text-muted-foreground text-sm mt-2">Cutting-edge digital content and streaming solutions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Entertainment Services</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive entertainment solutions from concept to distribution
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Camera className="h-8 w-8 text-highlight-blue" />
                    <h3 className="text-2xl font-semibold">Content Production</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    State-of-the-art production facilities and creative teams delivering 
                    high-quality content across film, television, and digital platforms.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <span>Full-service film production</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <span>Television series development</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <span>Commercial and branded content</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-8 w-8 text-highlight-blue" />
                    <h3 className="text-2xl font-semibold">Distribution & Licensing</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Global distribution networks and strategic partnerships ensuring 
                    content reaches audiences worldwide across multiple platforms.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <span>Global distribution partnerships</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <span>Streaming platform integration</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <span>Content licensing and syndication</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Filmology</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  A legacy of creative excellence and innovation in entertainment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Film className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Creative Vision</h3>
                  <p className="text-muted-foreground">
                    Innovative storytelling that captivates audiences worldwide
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality Content</h3>
                  <p className="text-muted-foreground">
                    Premium production values across all projects
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Industry veterans with decades of experience
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Tv className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Multi-Platform</h3>
                  <p className="text-muted-foreground">
                    Content optimized for every viewing experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-variant text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Partner with Entertainment Leaders
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Connect with Filmology to explore collaboration opportunities in film, 
                television, and digital media production.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <a href="https://filmology.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Explore Filmology
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
