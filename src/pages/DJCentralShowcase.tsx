import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Globe, Users, Music, Video, Tv, Play, Star, Radio, Mic2, 
  Search, CheckCircle, Award, Sparkles, Heart, Target
} from "lucide-react";

const DJCentralShowcase = () => {
  return (
    <>
      <Helmet>
        <title>DJ Central - Global EDM & Dance Music TV Network | AmplifiX Showcase</title>
        <meta name="description" content="DJ Central is an Australian Record Label and global Dance, House and Club music TV show syndicated to over 8 countries, featuring today's leading EDM artists." />
        <meta property="og:title" content="DJ Central - Global EDM & Dance Music TV Network" />
        <meta property="og:description" content="Listen. Watch. Dance. Enjoy. Global Dance, House and Club music TV show syndicated worldwide." />
        <link rel="canonical" href="https://amplifix.ai/showcase/dj-central" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-purple-500/5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <div className="h-28 w-28 relative z-10 ring-4 ring-blue-500/30 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <Music className="h-14 w-14 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-purple-500/15 text-purple-500 border border-purple-500/30 rounded-full text-sm font-medium">
                  Media
                </span>
                <span className="px-3 py-1 bg-blue-500/15 text-blue-500 border border-blue-500/30 rounded-full text-sm font-medium">
                  EDM
                </span>
                <span className="px-3 py-1 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded-full text-sm font-medium">
                  Record Label
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                DJ Central
              </h1>
              
              <p className="text-2xl text-blue-400 font-semibold mb-4">
                Listen. Watch. Dance. Enjoy.
              </p>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                A proud Australian Record Label and global Dance, House and Club music TV show, syndicated to over 8 countries and growing. Featuring today's artists leading the way in Electronic Dance Music (EDM).
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://djcentral.tv" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://www.bing.com/copilotsearch?q=DJ+Central+TV+EDM" target="_blank" rel="noopener noreferrer">
                    <Search className="mr-2 h-4 w-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Quick Navigation */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  asChild
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="#about">
                    <Users className="mr-2 h-4 w-4" />
                    About
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="#music">
                    <Music className="mr-2 h-4 w-4" />
                    Music
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="#video">
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="#tv-services">
                    <Tv className="mr-2 h-4 w-4" />
                    TV Show Services
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
                About DJ Central
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 text-center">
                DJ Central is Australia's premier Electronic Dance Music platform, combining a record label, TV network, and artist development services into one powerhouse brand. Our mission is to provide independent labels and artists from all over the world the opportunity to gain global exposure.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <Radio className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-blue-500">Global Syndication</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our TV show is syndicated to over 8 countries worldwide, bringing the best of EDM to audiences across the globe.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <Mic2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-blue-500">Artist Development</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We discover and nurture emerging talent, providing platforms for independent artists to reach international audiences.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
                <p className="text-xl italic text-white font-medium">
                  "Featuring today's artists leading the way in the world of Electronic Dance Music"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Music Section */}
        <section id="music" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Music
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                The heartbeat of the global dance music scene
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Music className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Record Label</h3>
                  <p className="text-muted-foreground mb-4">
                    Australian-based record label releasing Dance, House, and Club music from artists worldwide.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Original releases</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Remix competitions</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Global distribution</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Star className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Featured Artists</h3>
                  <p className="text-muted-foreground mb-4">
                    Home to talented artists like DL Down3r, Key Loch, Gabe Rizza, Avery May Parker, and many more.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Emerging talent</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Artist profiles</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Exclusive content</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Award className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Genre Focus</h3>
                  <p className="text-muted-foreground mb-4">
                    Specializing in Dance, House, Club, and Electronic Dance Music (EDM) genres.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> House music</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Dance/Club</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> EDM</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://djcentral.tv/artists/" target="_blank" rel="noopener noreferrer">
                    <Users className="mr-2 h-4 w-4" />
                    View All Artists
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section id="video" className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Video
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Stunning visual content from music videos to AI-powered animations
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-8 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/15 rounded-lg">
                      <Video className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-500">Music Videos</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Professional music video production featuring cutting-edge visuals and creative storytelling for our artists.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> High-quality production</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> YouTube channel (1.12K+ subscribers)</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Vimeo hosting</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-card to-purple-500/5 p-8 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/15 rounded-lg">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-purple-500">AI Avatar Content</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Innovative AI-powered animated content including Pixar-style art clips and the AI Avatar "Kira" for the Remix Network.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Pixar Art Clips</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> AI Avatar Kira</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Pop Art Clips</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <Play className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">Shorts</h4>
                  <p className="text-sm text-muted-foreground">Quick music clips and previews</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">Full Videos</h4>
                  <p className="text-sm text-muted-foreground">Complete music video releases</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">Featured Animations</h4>
                  <p className="text-sm text-muted-foreground">AI-powered visual experiences</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TV Show Services Section */}
        <section id="tv-services" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                TV Show Services
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Global television syndication bringing EDM to audiences worldwide
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Tv className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">DJ Central TV</h3>
                  <p className="text-muted-foreground mb-4">
                    Our flagship TV show featuring the best in Dance, House, and Club music from around the world.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Multiple seasons</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Regular episodes</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Promo feeds</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Global Reach</h3>
                  <p className="text-muted-foreground mb-4">
                    Syndicated to over 8 countries with continuous expansion into new markets.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> 8+ countries</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Growing network</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> International partners</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Artist Exposure</h3>
                  <p className="text-muted-foreground mb-4">
                    Providing independent labels and artists global exposure through our TV network.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Independent artists</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Label partnerships</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Global platform</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-xl border border-blue-500/20">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">Latest Episodes</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-card/50 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-white">Season 6 Episode 1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Part 1 - Latest release</p>
                  </div>
                  <div className="bg-card/50 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-white">Promo Feed 1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Promotional content</p>
                  </div>
                  <div className="bg-card/50 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-white">Episode 1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Promo Feed 1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Impact Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
                Platform Impact
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                  <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">8+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                  <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">6</div>
                  <div className="text-sm text-muted-foreground">TV Seasons</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                  <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">1.1K+</div>
                  <div className="text-sm text-muted-foreground">YouTube Subscribers</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                  <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">∞</div>
                  <div className="text-sm text-muted-foreground">Growing Artists</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Join the DJ Central Family
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're an artist looking for exposure or a fan discovering new music, DJ Central is your gateway to the global EDM scene.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://djcentral.tv" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-5 w-5" />
                    Visit DJ Central
                  </a>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://www.bing.com/copilotsearch?q=DJ+Central+TV+EDM" target="_blank" rel="noopener noreferrer">
                    <Search className="mr-2 h-5 w-5" />
                    AmplifiX Search
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

export default DJCentralShowcase;
