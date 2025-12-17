import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Globe, Users, MessageSquare, Award, Target, Zap, TrendingUp, Search, Building, 
  BarChart3, Shield, Sparkles, Play, CheckCircle, Star, Quote, Utensils, Plane,
  Clock, DollarSign, Heart, Lightbulb, Layers, PieChart
} from "lucide-react";
import oneWorldLogo from "@/assets/1world-online-logo.png";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const OneWorldOnlineShowcase = () => {
  useGTranslateRefresh(true);
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-amber-500/5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <div className="h-28 w-auto relative z-10 ring-4 ring-blue-500/30 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={oneWorldLogo} alt="1World Online" className="h-full w-auto object-contain" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded-full text-sm font-medium">
                  Travel & Leisure
                </span>
                <span className="px-3 py-1 bg-purple-500/15 text-purple-500 border border-purple-500/30 rounded-full text-sm font-medium">
                  Media
                </span>
                <span className="px-3 py-1 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded-full text-sm font-medium">
                  Engagement
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                1World Online
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Engagement tools for Media and Travel. Transform passive audiences into active participants with interactive solutions that drive participation, loyalty, and monetization.
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
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://1worldonline.com/#contact" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact 1World
                  </a>
                </Button>
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
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

        {/* Core Product Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Core Product Features
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                A comprehensive suite of engagement tools designed for maximum impact.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Smart Polling Engine</h3>
                  <p className="text-muted-foreground mb-4">
                    Real-time polls with instant results, sentiment analysis, and demographic breakdowns.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Multi-format poll types</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Real-time visualization</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Export & analytics</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Award className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Gamification Suite</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete gamification toolkit with points, badges, leaderboards, and rewards.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Custom reward systems</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Global leaderboards</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Achievement badges</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">AI Content Engine</h3>
                  <p className="text-muted-foreground mb-4">
                    Machine learning-powered content recommendations and personalization.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Behavioral targeting</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Dynamic content</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> A/B testing</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive insights into audience behavior, engagement patterns, and ROI.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Real-time metrics</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Custom reports</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> ROI tracking</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <Layers className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Widget Library</h3>
                  <p className="text-muted-foreground mb-4">
                    Embeddable widgets that integrate seamlessly with any website or app.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> No-code embed</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Custom branding</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Mobile responsive</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border hover:border-blue-500/40 transition-colors group">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mb-4 group-hover:bg-blue-500/25 transition-colors">
                    <DollarSign className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Monetization Tools</h3>
                  <p className="text-muted-foreground mb-4">
                    Revenue generation through sponsored content, premium features, and partnerships.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Sponsored polls</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Premium content</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Revenue sharing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Success Stories
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Real results from organizations transforming their audience engagement.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Case Study 1 */}
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-8 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/15 rounded-lg">
                      <Utensils className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-xs text-blue-500 font-medium uppercase tracking-wide">Case Study</span>
                      <h3 className="text-xl font-semibold text-white">Culinary Heritage Media</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    A leading food and lifestyle media company partnered with 1World Online to increase audience engagement across their digital properties.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">312%</div>
                      <div className="text-xs text-muted-foreground">Engagement Increase</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">4.2x</div>
                      <div className="text-xs text-muted-foreground">Time on Site</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">89%</div>
                      <div className="text-xs text-muted-foreground">Return Rate</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "1World Online transformed how we connect with our food-loving community. The interactive polls and recipe voting features have become essential to our reader experience."
                  </p>
                </div>

                {/* Case Study 2 */}
                <div className="bg-gradient-to-br from-card to-blue-500/5 p-8 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/15 rounded-lg">
                      <Plane className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-xs text-blue-500 font-medium uppercase tracking-wide">Case Study</span>
                      <h3 className="text-xl font-semibold text-white">Global Travel Network</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    An international travel media group leveraged 1World Online to create interactive destination guides and traveler community engagement.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">156%</div>
                      <div className="text-xs text-muted-foreground">Ad Revenue</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">2.8M</div>
                      <div className="text-xs text-muted-foreground">Poll Responses</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">67%</div>
                      <div className="text-xs text-muted-foreground">Social Shares</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "The gamification features helped us build a loyal community of travelers who actively participate in destination rankings and travel tips."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                What Our Partners Say
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Trusted by industry leaders across media, travel, and entertainment.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border relative">
                  <Quote className="h-8 w-8 text-blue-500/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "The engagement metrics we've seen since implementing 1World Online have exceeded all expectations. Our audience is more active than ever."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-500">MK</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Marketing Director</div>
                      <div className="text-xs text-muted-foreground">Media Publishing Co.</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border relative">
                  <Quote className="h-8 w-8 text-blue-500/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "We've tried many engagement platforms, but 1World Online is the only one that delivered real, measurable ROI for our travel content."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-500">JR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Head of Digital</div>
                      <div className="text-xs text-muted-foreground">Travel Media Group</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border relative">
                  <Quote className="h-8 w-8 text-blue-500/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "The gamification suite helped us build a community, not just an audience. Our readers are now active contributors to our content."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-500">ST</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">CEO</div>
                      <div className="text-xs text-muted-foreground">Lifestyle Network</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Get started in minutes with our simple implementation process.
              </p>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/15 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">1</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Connect</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrate with your existing website or app in minutes with our simple embed code.
                  </p>
                </div>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/15 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">2</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Customize</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure engagement features and branding to match your audience and goals.
                  </p>
                </div>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/15 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">3</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Engage</h3>
                  <p className="text-sm text-muted-foreground">
                    Launch interactive polls, quizzes, and gamified experiences to your audience.
                  </p>
                </div>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/15 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">4</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Grow</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze results, optimize strategies, and scale your engagement impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20">
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
                  <p className="text-xs text-muted-foreground mt-2">News, magazines, blogs</p>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Travel & Leisure</h3>
                  <p className="text-xs text-muted-foreground mt-2">Tourism, hospitality, destinations</p>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Sports & Entertainment</h3>
                  <p className="text-xs text-muted-foreground mt-2">Teams, leagues, events</p>
                </div>

                <div className="bg-gradient-to-br from-card to-blue-500/5 p-6 rounded-xl border border-blue-500/20 text-center">
                  <div className="p-3 bg-blue-500/15 rounded-lg w-fit mx-auto mb-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-blue-500">Brands & Agencies</h3>
                  <p className="text-xs text-muted-foreground mt-2">Marketing, advertising, PR</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                Platform Impact
              </h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                Measurable results that transform audience engagement.
              </p>

              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">500M+</div>
                  <p className="text-muted-foreground">Interactions Processed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">5x</div>
                  <p className="text-muted-foreground">Average Engagement Lift</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">40%</div>
                  <p className="text-muted-foreground">Higher Time on Site</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">3x</div>
                  <p className="text-muted-foreground">Return Visitor Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-500/10 via-background to-amber-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Engage Your Audience?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Discover how 1World Online can transform your audience engagement strategy and drive measurable results.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <a href="https://1worldonline.com/" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Get Started
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
