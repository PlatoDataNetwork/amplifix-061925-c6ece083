import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Brain, Stethoscope, Pill, Beaker, Microscope, Home, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";

const Showcase = () => {
  const { data: showcaseData, isLoading } = useJsonData<any>('showcase.json');
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!showcaseData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <div className="text-center">Failed to load showcase data</div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>Client Showcase - AmplifiX AI-Powered Corporate Communications</title>
        <meta name="description" content="Explore successful case studies and showcases of companies using AmplifiX's AI-driven corporate communications and investor relations solutions. See how we help businesses amplify their message and accelerate growth." />
        <meta name="keywords" content="AmplifiX showcase, corporate communications case studies, investor relations success stories, AI-powered communications, client testimonials, business growth solutions" />
        <meta property="og:title" content="Client Showcase - AmplifiX Success Stories" />
        <meta property="og:description" content="Discover how leading companies leverage AmplifiX's AI-powered platform to enhance their corporate communications and investor relations strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AmplifiX Client Showcase - Success Stories" />
        <meta name="twitter:description" content="See how companies achieve exceptional results with AmplifiX's AI-driven corporate communications platform." />
        <link rel="canonical" href="https://amplifix.ai/showcase" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <MainHeader />

        {/* Hero Section */}
        <div className="pt-20 md:pt-24 container mx-auto py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 px-2">
                <span className="text-highlight-blue">{showcaseData.hero.title}</span><br />
                {showcaseData.hero.subtitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
                {showcaseData.hero.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {showcaseData.showcases.map((showcase: any, index: number) => (
                <div key={index} className={`relative bg-card p-8 rounded-xl border ${showcase.disabled ? 'border-dashed border-border opacity-60' : 'border-border hover:shadow-lg transition-shadow'}`}>
                  {/* Header with company info */}
                  <div className="flex items-center gap-4 mb-6">
                     <div className={`w-12 h-12 rounded-full ${showcase.disabled ? 'bg-muted' : 'bg-highlight-blue/10'} flex items-center justify-center flex-shrink-0`}>
                      {showcase.company_name === 'SILO Pharma Inc.' && <Pill className="h-6 w-6 text-highlight-blue" />}
                      {showcase.company_name === 'Int\'l Land Alliance' && <Home className="h-6 w-6 text-highlight-blue" />}
                      {showcase.company_name === 'Karbon-X' && <img src="/lovable-uploads/4fc4b91a-cd33-4009-ad3a-df4b3d33d179.png" alt="Karbon-X logo" className="h-6 w-6" />}
                      {showcase.company_name === 'FYNN AI' && <img src="/lovable-uploads/81a540f7-53d1-4835-a86f-983e8a85e38c.png" alt="FYNN AI logo" className="h-8 w-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-bold whitespace-nowrap ${showcase.disabled ? 'text-muted-foreground' : ''}`}>
                        {showcase.company_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {showcase.ticker || showcase.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {showcase.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    {/* Live Stock Price Button */}
                    {showcase.stock_url && (
                      <a 
                        href={showcase.stock_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full min-h-[44px]">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Live Stock Price</span>
                          <span className="sm:hidden">Stock</span>
                        </Button>
                      </a>
                    )}
                    
                    {/* Website Button */}
                    {showcase.website && (
                      <a 
                        href={showcase.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full min-h-[44px]">
                          <Globe className="h-4 w-4 mr-2" />
                          Web
                        </Button>
                      </a>
                    )}
                    
                    {/* AmplifiX Search Button */}
                    <a 
                      href={`https://www.bing.com/copilotsearch?q=${encodeURIComponent(showcase.company_name + (showcase.ticker ? ` ${showcase.ticker}` : ''))}&FORM=CSSCOP`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                      onClick={() => {
                        const searchUrl = `https://www.bing.com/copilotsearch?q=${encodeURIComponent(showcase.company_name + (showcase.ticker ? ` ${showcase.ticker}` : ''))}&FORM=CSSCOP`;
                        console.log('AmplifiX button clicked, opening:', searchUrl);
                      }}
                    >
                      <Button variant="outline" className="w-full min-h-[44px]">
                        <Search className="h-4 w-4 mr-2" />
                        AmplifiX
                      </Button>
                    </a>
                  </div>
                  {showcase.link ? (
                    <Link to={showcase.link}>
                      <Button className={`w-full ${showcase.disabled ? '' : 'bg-highlight-blue hover:bg-highlight-blue/90 text-white'}`} disabled={showcase.disabled}>
                        {showcase.button_text}
                        {!showcase.disabled && <ExternalLink className="ml-2 h-4 w-4" />}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled={showcase.disabled}>
                      {showcase.button_text}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose AmplifiX Section */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">{showcaseData.why_choose.title}</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {showcaseData.why_choose.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {showcaseData.why_choose.features.map((feature: any, index: number) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                  {feature.title === 'Growth Focus' && <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />}
                  {feature.title === 'AI Innovation' && <Lightbulb className="h-12 w-12 text-green-500 mx-auto mb-4" />}
                  {feature.title === 'Expert Team' && <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />}
                  {feature.title === 'Proven Results' && <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />}
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto py-16 px-4 bg-gradient-to-r from-highlight-blue/10 to-green-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{showcaseData.cta.title}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {showcaseData.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={showcaseData.cta.buttons.primary.link}>
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                  {showcaseData.cta.buttons.primary.text}
                </Button>
              </Link>
              <Link to={showcaseData.cta.buttons.secondary.link}>
                <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                  {showcaseData.cta.buttons.secondary.text}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Showcase;
