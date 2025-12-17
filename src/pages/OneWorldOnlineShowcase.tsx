import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Users, MessageSquare, Award, Target, Zap, TrendingUp, Search, Building } from "lucide-react";

const OneWorldOnlineShowcase = () => {
  return (
    <>
      <Helmet>
        <title>1World Online - Interactive Engagement Platform | AmplifiX Showcase</title>
        <meta name="description" content="1World Online delivers AI-powered interactive engagement solutions for media companies, brands, and organizations to drive audience participation and monetization." />
        <meta property="og:title" content="1World Online - Interactive Engagement Platform" />
        <meta property="og:description" content="Transform passive audiences into active participants with gamified engagement solutions." />
        <link rel="canonical" href="https://amplifix.ai/showcase/1world-online" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <div className="h-24 w-24 relative z-10 ring-4 ring-blue-500/30 rounded-lg p-4 bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">1W</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-500/15 text-blue-500 border border-blue-500/30 rounded-full text-sm font-medium">
                  PRIVATE
                </span>
                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded-full text-sm font-medium">
                  Travel & Leisure
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-blue-500">1World</span> Online
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Transform passive audiences into active participants with interactive engagement solutions that drive participation, loyalty, and monetization.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://1worldonline.com/" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="https://www.bing.com/copilotsearch?q=1World+Online" target="_blank" rel="noopener noreferrer">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
                About 1World Online
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 text-center">
                1World Online is a leading interactive engagement platform that empowers media companies, brands, and organizations to transform their audiences into active, engaged communities through gamified experiences and AI-powered solutions.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-blue-500">Audience Engagement</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Turn passive viewers into active participants with interactive polls, quizzes, and gamified experiences.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/15 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-blue-500">Revenue Growth</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Monetize engagement through sponsored content, premium experiences, and data-driven insights.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
                <p className="text-xl italic text-white font-medium">
                  "Engaging audiences. Driving results. Building communities."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Platform Solutions
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Comprehensive engagement tools for every industry.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Interactive Polls</h3>
                  <p className="text-muted-foreground">
                    Real-time polling and surveys that capture audience sentiment and drive engagement across digital platforms.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Award className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Gamification</h3>
                  <p className="text-muted-foreground">
                    Reward-based experiences with leaderboards, badges, and prizes that keep audiences coming back.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Targeted Content</h3>
                  <p className="text-muted-foreground">
                    AI-powered content recommendations that deliver personalized experiences to each user.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Industries Served
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Trusted by leading organizations across multiple sectors.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Building className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Media & Publishing</h3>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Travel & Leisure</h3>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Sports & Entertainment</h3>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Brands & Agencies</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Why 1World Online
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Measurable results that transform audience engagement.
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">5x</div>
                  <p className="text-muted-foreground">Increase in user engagement</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">40%</div>
                  <p className="text-muted-foreground">Higher time on site</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">3x</div>
                  <p className="text-muted-foreground">Return visitor rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Engage Your Audience?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Discover how 1World Online can transform your audience engagement strategy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://1worldonline.com/" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Learn More
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-blue-500/30 hover:bg-blue-500/10"
                >
                  <a href="https://www.bing.com/copilotsearch?q=1World+Online" target="_blank" rel="noopener noreferrer">
                    <Search className="mr-2 h-4 w-4" />
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

export default OneWorldOnlineShowcase;
