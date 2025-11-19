import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
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
              <h1 className="text-5xl font-bold mb-6">
                <span className="text-highlight-blue">{showcaseData.showcase.hero.title}</span><br />
                {showcaseData.showcase.hero.subtitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
                {showcaseData.showcase.hero.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {showcaseData.showcase.showcases.map((showcase: any, index: number) => (
                <div key={index} className={`relative bg-gradient-to-br ${
                  showcase.disabled 
                    ? 'from-card to-muted/50 border-dashed border-border opacity-60' 
                    : index % 4 === 0 
                      ? 'from-card via-card to-highlight-blue/5 border-highlight-blue/20 hover:border-highlight-blue/40' 
                      : index % 4 === 1 
                        ? 'from-card via-card to-purple-500/5 border-purple-500/20 hover:border-purple-500/40'
                        : index % 4 === 2
                          ? 'from-card via-card to-green-500/5 border-green-500/20 hover:border-green-500/40'
                          : 'from-card via-card to-orange-500/5 border-orange-500/20 hover:border-orange-500/40'
                } p-8 rounded-xl border hover:shadow-xl transition-all duration-300`}>
                  {/* Header with company info */}
                  <div className="flex items-center gap-4 mb-6">
                     <div className={`w-12 h-12 rounded-full ${
                       showcase.disabled 
                         ? 'bg-muted' 
                         : index % 4 === 0 
                           ? 'bg-gradient-to-br from-highlight-blue/10 to-highlight-blue/30 border-highlight-blue/50' 
                           : index % 4 === 1 
                             ? 'bg-gradient-to-br from-purple-500/10 to-purple-500/30 border-purple-500/50'
                             : index % 4 === 2
                               ? 'bg-gradient-to-br from-green-500/10 to-green-500/30 border-green-500/50'
                               : 'bg-gradient-to-br from-orange-500/10 to-orange-500/30 border-orange-500/50'
                     } flex items-center justify-center flex-shrink-0 shadow-sm border`}>
                      {showcase.company_name === 'SILO Pharma Inc.' && <Pill className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : 'text-highlight-blue'}`} />}
                      {showcase.company_name === 'Int\'l Land Alliance' && <Home className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : 'text-purple-500'}`} />}
                      {showcase.company_name === 'Karbon-X' && (
                        <span className="text-green-500 text-2xl font-bold">K</span>
                      )}
                     {showcase.company_name === 'Micropolis' && (
                        <img src="/lovable-uploads/micropolis-icon.png" alt="Micropolis" className="w-full h-full object-cover rounded-full" />
                      )}
                      {showcase.company_name === 'Synbio International' && <Microscope className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : 'text-highlight-blue'}`} />}
                      {showcase.company_name === 'FYNN AI' && (
                        <div className="w-8 h-8 rounded-sm bg-background p-1 border border-border/50">
                          <img src="/lovable-uploads/81a540f7-53d1-4835-a86f-983e8a85e38c.png" alt="FYNN AI logo" className="h-full w-full object-contain" />
                        </div>
                      )}
                      {showcase.company_name === 'Naoris Protocol' && (
                        <img src="/lovable-uploads/naoris-icon.png" alt="Naoris Protocol" className="w-8 h-8 object-contain" />
                      )}
                      {showcase.company_name === 'Abatis' && (
                        <span className="text-green-500 text-2xl font-bold">A</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-bold whitespace-nowrap ${showcase.disabled ? 'text-muted-foreground' : ''}`}>
                        {showcase.company_name}
                      </h3>
                      <p className={`text-sm font-semibold mt-1 ${
                        showcase.disabled 
                          ? 'text-muted-foreground'
                          : index % 4 === 0 
                            ? 'text-highlight-blue' 
                            : index % 4 === 1 
                              ? 'text-purple-500'
                              : index % 4 === 2
                                ? 'text-green-500'
                                : 'text-orange-500'
                      }`}>
                        {showcase.ticker || showcase.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {showcase.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    {/* Live Stock/Token Price Button */}
                    {showcase.stock_url && (
                      <a 
                        href={showcase.stock_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full min-h-[44px]">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">{showcase.type === 'token' ? (showcaseData.showcase.cta.stock_button_labels?.live_token_price || 'Live Token Price') : (showcaseData.showcase.cta.stock_button_labels?.live_stock_price || 'Live Stock Price')}</span>
                          <span className="sm:hidden">{showcase.type === 'token' ? (showcaseData.showcase.cta.stock_button_labels?.token_short || 'Token') : (showcaseData.showcase.cta.stock_button_labels?.stock_short || 'Stock')}</span>
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
                          {showcaseData.showcase.cta.stock_button_labels?.website || 'Web'}
                        </Button>
                      </a>
                    )}
                    
                    {/* AmplifiX Search Button */}
                    <a 
                      href={showcase.search_url || `https://www.bing.com/copilotsearch?q=${encodeURIComponent(showcase.company_name + (showcase.ticker ? ` ${showcase.ticker}` : ''))}&FORM=CSSCOP`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full min-h-[44px]">
                        <Search className="h-4 w-4 mr-2" />
                        {showcaseData.showcase.cta.stock_button_labels?.amplifix_search || 'AmplifiX'}
                      </Button>
                    </a>
                  </div>
                  {showcase.link ? (
                    showcase.link.startsWith('http') ? (
                      <a href={showcase.link} target="_blank" rel="noopener noreferrer">
                        <Button className={`w-full ${
                          showcase.disabled 
                            ? '' 
                            : index % 4 === 0 
                              ? 'bg-highlight-blue hover:bg-highlight-blue/90 text-white' 
                              : index % 4 === 1 
                                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                : index % 4 === 2
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`} disabled={showcase.disabled}>
                          {showcase.button_text}
                          {!showcase.disabled && <ExternalLink className="ml-2 h-4 w-4" />}
                        </Button>
                      </a>
                    ) : (
                      <LanguageAwareLink to={showcase.link}>
                        <Button className={`w-full ${
                          showcase.disabled 
                            ? '' 
                            : index % 4 === 0 
                              ? 'bg-highlight-blue hover:bg-highlight-blue/90 text-white' 
                              : index % 4 === 1 
                                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                : index % 4 === 2
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`} disabled={showcase.disabled}>
                          {showcase.button_text}
                          {!showcase.disabled && <ExternalLink className="ml-2 h-4 w-4" />}
                        </Button>
                      </LanguageAwareLink>
                    )
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
              <h2 className="text-4xl font-bold mb-6">{showcaseData.showcase.why_choose.title}</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {showcaseData.showcase.why_choose.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {showcaseData.showcase.why_choose.features.map((feature: any, index: number) => (
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
        <section className="container mx-auto py-16 px-4 bg-card">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{showcaseData.showcase.cta.title}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {showcaseData.showcase.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LanguageAwareLink to={showcaseData.showcase.cta.buttons.primary.link}>
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                  {showcaseData.showcase.cta.buttons.primary.text}
                </Button>
              </LanguageAwareLink>
              <LanguageAwareLink to={showcaseData.showcase.cta.buttons.secondary.link}>
                <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                  {showcaseData.showcase.cta.buttons.secondary.text}
                </Button>
              </LanguageAwareLink>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Showcase;
