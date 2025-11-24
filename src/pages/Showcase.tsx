import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Brain, Stethoscope, Pill, Beaker, Microscope, Home, Search, ScanFace, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { useJsonData } from "@/hooks/useJsonData";
import { DirectShowcaseUpdate } from "@/components/DirectShowcaseUpdate";

interface ShowcaseData {
  showcase: {
    hero: { title: string; subtitle: string; description: string };
    showcases: Array<{
      company_name: string;
      ticker?: string;
      subtitle?: string;
      description: string;
      button_text: string;
      link: string;
      stock_url?: string;
      website?: string;
      search_url?: string | null;
      type: string;
      disabled: boolean;
      thumbnail?: string;
      tags?: string[];
      main_sector?: string;
    }>;
    why_choose: {
      title: string;
      description: string;
      features: Record<string, { title: string; description: string }>;
    };
    cta: {
      title: string;
      description: string;
      stock_button_labels: Record<string, string>;
    };
  };
}

const Showcase = () => {
  const { data: showcaseData } = useJsonData<ShowcaseData>('showcase.json');
  const [dbShowcases, setDbShowcases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private' | 'token'>('all');
  const [filterSector, setFilterSector] = useState<string>('all');
  useLanguage();

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        const { data, error } = await supabase
          .from("showcase_companies")
          .select("*")
          .eq("disabled", false)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        console.log("Fetched showcases from DB:", data);
        setDbShowcases(data || []);
      } catch (error) {
        console.error("Error fetching showcases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcases();
  }, []);

  // Merge database data with JSON data, adding any JSON items not in database
  const allShowcases = useMemo(() => {
    const jsonShowcases = showcaseData?.showcase.showcases || [];
    let mergedShowcases: any[];
    
    if (!loading && dbShowcases.length > 0) {
      const dbCompanyNames = new Set(dbShowcases.map((s) => s.company_name));
      const jsonOnlyShowcases = jsonShowcases.filter((s) => !dbCompanyNames.has(s.company_name));
      mergedShowcases = [...dbShowcases, ...jsonOnlyShowcases];
    } else {
      mergedShowcases = jsonShowcases;
    }

    // Hard-code certain companies as private and ensure Naoris subtitle + Blockwell entry
    const privateNames = new Set([
      'FAIM',
      'ForexGPT',
      'CUT',
      'Naoris Protocol',
      'FacialDX',
      'Abatis',
      'Blockwell',
      'StorageBlue',
      'Versa TV',
      'Kedalion',
    ]);

    const normalized = mergedShowcases.map((showcase) => {
      const updated = { ...showcase };

      if (privateNames.has(updated.company_name)) {
        updated.type = 'private';
      }

      // Prefer descriptive subtitle for Naoris
      if (updated.company_name === 'Naoris Protocol') {
        updated.subtitle = updated.subtitle || 'Quantum Resistant Cybersecurity';
      }

      // Add Token tag to specific companies
      const tokenCompanies = new Set(['FAIM', 'CUT', 'Naoris Protocol', 'Abatis', 'Kedalion']);
      if (tokenCompanies.has(updated.company_name)) {
        if (!Array.isArray(updated.tags)) {
          updated.tags = [];
        }
        if (!updated.tags.includes('Token')) {
          updated.tags.push('Token');
        }
      }

      // Remove token-classifying tags from other private companies (but not the token ones)
      if (privateNames.has(updated.company_name) && !tokenCompanies.has(updated.company_name) && Array.isArray(updated.tags)) {
        updated.tags = updated.tags.filter(
          (tag: string) => tag !== 'Token' && tag !== 'Cryptocurrency'
        );
      }

      return updated;
    });

    // Ensure Blockwell appears in the showcase even if not in DB/JSON
    if (!normalized.some((s) => s.company_name === 'Blockwell')) {
      normalized.push({
        company_name: 'Blockwell',
        ticker: 'Private',
        subtitle: 'AI-Powered Blockchain Security',
        description:
          'Pioneering blockchain technology company specializing in AI-powered cybersecurity solutions and decentralized systems for the next generation of digital infrastructure.',
        tags: ['AI', 'Blockchain', 'Cyber'],
        button_text: 'View Showcase',
        link: '/showcase/blockwell',
        website: 'https://blockwell.ai',
        search_url:
          'https://www.bing.com/copilotsearch?q=Blockwell%20Blockchain%20Crypto&FORM=CSSCOP',
        thumbnail: '/lovable-uploads/blockwell-thumbnail.png',
        type: 'private',
        disabled: false,
        main_sector: 'CYBERSECURITY',
      });
    }

    // Ensure StorageBlue appears in the showcase even if not in DB/JSON
    if (!normalized.some((s) => s.company_name === 'StorageBlue')) {
      normalized.push({
        company_name: 'StorageBlue',
        ticker: 'Private',
        subtitle: 'Real Estate Investment & Management',
        description:
          'Leading real estate investment and management company specializing in storage facilities and commercial properties across strategic locations.',
        tags: ['Real Estate', 'Investment'],
        button_text: 'View Showcase',
        link: '/showcase/storageblue',
        website: 'https://storagebluecapital.com',
        search_url:
          'https://www.bing.com/search?q=StorageBlue+Real+Estate',
        thumbnail: '/lovable-uploads/storageblue-thumbnail.png',
        type: 'private',
        disabled: false,
        main_sector: 'REAL ESTATE',
      });
    }

    // Ensure Versa TV appears in the showcase even if not in DB/JSON
    if (!normalized.some((s) => s.company_name === 'Versa TV')) {
      normalized.push({
        company_name: 'Versa TV',
        ticker: 'Private',
        subtitle: 'Next-Generation Streaming Platform',
        description:
          'Next-generation media and streaming platform delivering innovative content and entertainment experiences through cutting-edge technology.',
        tags: ['Media', 'Streaming', 'Entertainment'],
        button_text: 'View Showcase',
        link: '/showcase/versatv',
        website: 'https://VersaTV.io',
        search_url:
          'https://www.bing.com/copilotsearch?q=VerzaTV%20Alan%20Mruvka&FORM=CSSCOP',
        thumbnail: '/lovable-uploads/versatv-thumbnail.png',
        type: 'private',
        disabled: false,
        main_sector: 'MEDIA',
      });
    }

    // Ensure Kedalion appears in the showcase even if not in DB/JSON
    if (!normalized.some((s) => s.company_name === 'Kedalion')) {
      normalized.push({
        company_name: 'Kedalion',
        ticker: 'Token',
        subtitle: 'Tokenized In-Ground Precious Metals',
        description:
          'Revolutionary platform providing tokenized access to verified in-ground gold and silver before mining begins. 43-101 regulated resources with direct asset ownership.',
        tags: ['Token', 'Blockchain', 'Precious Metals'],
        button_text: 'View Showcase',
        link: '/showcase/kedalion',
        website: 'https://dev.kedalion.io/',
        search_url:
          'https://www.bing.com/search?q=Kedalion+tokenized+gold+silver',
        thumbnail: '/lovable-uploads/kedalion-icon.png',
        type: 'private',
        disabled: false,
        main_sector: 'FINTECH',
      });
    }

    return normalized;
  }, [loading, dbShowcases, showcaseData]);

  // Determine color theme based on tags and company name
  const getColorClasses = (showcase: any) => {
    // Special case: ForexGPT gets hot pink
    if (showcase.company_name === 'ForexGPT') {
      return {
        gradient: 'from-card via-card to-pink-500/5 border-pink-500/20 hover:border-pink-500/40',
        badge: 'bg-pink-500/15 text-pink-500 border border-pink-500/30',
        icon: 'bg-gradient-to-br from-pink-500/10 to-pink-500/30 border-pink-500/50',
        text: 'text-pink-500',
        button: 'bg-pink-500 hover:bg-pink-500/90 text-white'
      };
    }
    
    // Special case: StorageBlue gets blue theme
    if (showcase.company_name === 'StorageBlue') {
      return {
        gradient: 'from-card via-card to-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
        badge: 'bg-blue-500/15 text-blue-500 border border-blue-500/30',
        icon: 'bg-gradient-to-br from-blue-500/10 to-blue-500/30 border-blue-500/50',
        text: 'text-blue-500',
        button: 'bg-blue-500 hover:bg-blue-500/90 text-white'
      };
    }
    
    // Special case: Kedalion gets amber/gold theme
    if (showcase.company_name === 'Kedalion') {
      return {
        gradient: 'from-card via-card to-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
        badge: 'bg-amber-500/15 text-amber-500 border border-amber-500/30',
        icon: 'bg-gradient-to-br from-amber-500/10 to-amber-500/30 border-amber-500/50',
        text: 'text-amber-500',
        button: 'bg-amber-500 hover:bg-amber-600 text-black'
      };
    }
    
    // Priority: Carbon > AI > default
    if (showcase.tags && Array.isArray(showcase.tags)) {
      if (showcase.tags.includes('Carbon')) {
        return {
          gradient: 'from-card via-card to-green-500/5 border-green-500/20 hover:border-green-500/40',
          badge: 'bg-green-500/15 text-green-500 border border-green-500/30',
          icon: 'bg-gradient-to-br from-green-500/10 to-green-500/30 border-green-500/50',
          text: 'text-green-500',
          button: 'bg-green-500 hover:bg-green-600 text-white'
        };
      }
      if (showcase.tags.includes('AI')) {
        return {
          gradient: 'from-card via-card to-highlight-blue/5 border-highlight-blue/20 hover:border-highlight-blue/40',
          badge: 'bg-highlight-blue/15 text-highlight-blue border border-highlight-blue/30',
          icon: 'bg-gradient-to-br from-highlight-blue/10 to-highlight-blue/30 border-highlight-blue/50',
          text: 'text-highlight-blue',
          button: 'bg-highlight-blue hover:bg-highlight-blue/90 text-white'
        };
      }
    }
    
    // Default colors for non-AI, non-Carbon companies
    return {
      gradient: 'from-card via-card to-purple-500/5 border-purple-500/20 hover:border-purple-500/40',
      badge: 'bg-purple-500/15 text-purple-500 border border-purple-500/30',
      icon: 'bg-gradient-to-br from-purple-500/10 to-purple-500/30 border-purple-500/50',
      text: 'text-purple-500',
      button: 'bg-purple-500 hover:bg-purple-600 text-white'
    };
  };


  // Dynamically get all unique tags from showcases for the filter dropdown
  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    allShowcases.forEach(showcase => {
      if (showcase.tags && Array.isArray(showcase.tags)) {
        showcase.tags.forEach(tag => sectors.add(tag));
      }
    });
    return Array.from(sectors).sort();
  }, [allShowcases]);

  // Filter showcases based on selected filters
  const filteredShowcases = useMemo(() => {
    let filtered = [...allShowcases];

    // Filter by type (public/private/token)
    if (filterType === 'public') {
      filtered = filtered.filter(s => s.type === 'stock');
    } else if (filterType === 'private') {
      filtered = filtered.filter(s => s.type === 'private');
    } else if (filterType === 'token') {
      filtered = filtered.filter(s => 
        s.type === 'token' ||
        (s.tags && Array.isArray(s.tags) && (s.tags.includes('Token') || s.tags.includes('Cryptocurrency')))
      );
    }

    // Filter by sector (companies can have multiple tags)
    if (filterSector !== 'all') {
      filtered = filtered.filter(s => 
        s.tags && Array.isArray(s.tags) && s.tags.some(tag => tag === filterSector)
      );
    }

    return filtered;
  }, [allShowcases, filterType, filterSector]);

  console.log("Rendering with showcases:", filteredShowcases.length, "items");

  const whyChooseFeatures = Object.values(showcaseData?.showcase.why_choose.features || {});


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
                <span className="text-highlight-blue">{showcaseData?.showcase.hero.title || 'Client Success Stories'}</span><br />
                {showcaseData?.showcase.hero.subtitle || 'Powered by AmplifiX'}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
                {showcaseData?.showcase.hero.description || 'Explore how companies leverage AmplifiX to amplify their message and accelerate growth.'}
              </p>
            </div>
            
            {/* Filter Controls */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Filter by Type:</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-highlight-blue hover:bg-highlight-blue/90' : ''}
                >
                  All ({allShowcases.length})
                </Button>
                
                {/* Sector Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={filterSector !== 'all' ? 'default' : 'outline'}
                      size="sm"
                      className={filterSector !== 'all' ? 'bg-highlight-blue hover:bg-highlight-blue/90' : ''}
                    >
                      {filterSector !== 'all' ? filterSector : 'Sector'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 max-h-[300px] overflow-y-auto bg-popover">
                    <DropdownMenuItem
                      onClick={() => setFilterSector('all')}
                      className={filterSector === 'all' ? 'bg-accent' : ''}
                    >
                      All Sectors
                    </DropdownMenuItem>
                    {availableSectors.map((sector) => (
                      <DropdownMenuItem
                        key={sector}
                        onClick={() => setFilterSector(sector)}
                        className={filterSector === sector ? 'bg-accent' : ''}
                      >
                        {sector}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant={filterType === 'public' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('public')}
                  className={filterType === 'public' ? 'bg-highlight-blue hover:bg-highlight-blue/90' : ''}
                >
                  Public ({allShowcases.filter(s => s.type === 'stock').length})
                </Button>
                <Button
                  variant={filterType === 'private' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('private')}
                  className={filterType === 'private' ? 'bg-highlight-blue hover:bg-highlight-blue/90' : ''}
                >
                  Private ({allShowcases.filter(s => s.type === 'private').length})
                </Button>
                <Button
                  variant={filterType === 'token' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('token')}
                  className={filterType === 'token' ? 'bg-highlight-blue hover:bg-highlight-blue/90' : ''}
                >
                  Token ({allShowcases.filter(s => 
                    s.type === 'token' ||
                    (s.tags && Array.isArray(s.tags) && (s.tags.includes('Token') || s.tags.includes('Cryptocurrency')))
                  ).length})
                </Button>
              </div>

              {/* Results Count and Update Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredShowcases.length} of {allShowcases.length} companies
                </div>
                <DirectShowcaseUpdate />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredShowcases.map((showcase, index) => {
                const colors = getColorClasses(showcase);
                return (
                <div key={index} className={`relative bg-gradient-to-br ${
                  showcase.disabled 
                    ? 'from-card to-muted/50 border-dashed border-border opacity-60' 
                    : colors.gradient
                } p-8 rounded-xl border hover:shadow-xl transition-all duration-300`}>
                  {/* Main Sector Badge */}
                  {showcase.main_sector && (
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide shadow-sm ${
                        showcase.disabled 
                          ? 'bg-muted text-muted-foreground border border-border' 
                          : colors.badge
                      }`}>
                        {showcase.main_sector}
                      </div>
                    </div>
                  )}
                  
                   {/* Header with company info */}
                   <div className="flex items-center gap-4 mb-6">
                     <div className={`w-12 h-12 rounded-full ${
                       showcase.disabled 
                         ? 'bg-muted' 
                         : colors.icon
                     } flex items-center justify-center flex-shrink-0 shadow-sm border overflow-hidden`}>
                       {showcase.company_name === 'Naoris Protocol' && showcase.thumbnail ? (
                         <img 
                           src={showcase.thumbnail} 
                           alt={showcase.company_name} 
                           className="w-full h-full object-contain p-1"
                         />
                       ) : showcase.company_name === 'SILO Pharma Inc.' ? (
                         <Pill className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : colors.text}`} />
                       ) : showcase.company_name === 'Int\'l Land Alliance' ? (
                         <Home className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : colors.text}`} />
                       ) : showcase.company_name === 'Karbon-X' ? (
                         <span className={`${showcase.disabled ? 'text-muted-foreground' : colors.text} text-2xl font-bold`}>K</span>
                       ) : showcase.company_name === 'Micropolis' ? (
                         <span className={`${showcase.disabled ? 'text-muted-foreground' : colors.text} text-2xl font-bold`}>M</span>
                       ) : showcase.company_name === 'Synbio Int\'l' ? (
                         <ScanFace className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : colors.text}`} />
                       ) : showcase.company_name === 'Abatis' ? (
                         <span className={`${showcase.disabled ? 'text-muted-foreground' : colors.text} text-2xl font-bold`}>A</span>
                       ) : showcase.company_name === 'FacialDX' ? (
                         <ScanFace className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : colors.text}`} />
                       ) : (
                         <Building className={`h-6 w-6 ${showcase.disabled ? 'text-muted-foreground' : colors.text}`} />
                       )}
                     </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-xl font-bold whitespace-nowrap ${showcase.disabled ? 'text-muted-foreground' : ''}`}>
                          {showcase.company_name}
                        </h3>
                        <p className={`text-sm font-semibold mt-1 ${
                          showcase.disabled 
                            ? 'text-muted-foreground'
                            : colors.text
                        }`}>
                          {showcase.company_name === 'FAIM'
                            ? 'AI Powered Fan Engagement'
                            : (showcase.subtitle || showcase.ticker)}
                        </p>
                       {showcase.tags && showcase.tags.length > 0 && (
                         <div className="flex flex-wrap gap-1.5 mt-2">
                           {showcase.tags.map((tag: string, tagIndex: number) => (
                             <span 
                               key={tagIndex}
                               className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted/50 text-muted-foreground border border-border/50"
                             >
                               {tag}
                             </span>
                           ))}
                         </div>
                       )}
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
                          <span className="hidden sm:inline">{showcase.type === 'token' ? (showcaseData?.showcase.cta.stock_button_labels.live_token_price || 'Live Token Price') : (showcaseData?.showcase.cta.stock_button_labels.live_stock_price || 'Live Stock Price')}</span>
                          <span className="sm:hidden">{showcase.type === 'token' ? (showcaseData?.showcase.cta.stock_button_labels.token_short || 'Token') : (showcaseData?.showcase.cta.stock_button_labels.stock_short || 'Stock')}</span>
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
                          {showcaseData?.showcase.cta.stock_button_labels.website || 'Web'}
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
                        {showcaseData?.showcase.cta.stock_button_labels.amplifix_search || 'AmplifiX'}
                      </Button>
                    </a>
                  </div>
                  {showcase.link ? (
                    showcase.link.startsWith('http') ? (
                      <a href={showcase.link} target="_blank" rel="noopener noreferrer">
                        <Button className={`w-full ${
                          showcase.disabled 
                            ? '' 
                            : colors.button
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
                            : colors.button
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
                );
              })}
            </div>
          </div>
        </div>

        {/* Why Choose AmplifiX Section */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">{showcaseData?.showcase.why_choose.title || 'Why Choose AmplifiX'}</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {showcaseData?.showcase.why_choose.description || 'Discover how we help companies achieve exceptional growth'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {whyChooseFeatures.map((feature: any, index: number) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                  {index === 0 && <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />}
                  {index === 1 && <Lightbulb className="h-12 w-12 text-green-500 mx-auto mb-4" />}
                  {index === 2 && <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />}
                  {index === 3 && <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />}
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
            <h2 className="text-4xl font-bold mb-6">{showcaseData?.showcase.cta?.title || 'Ready to Amplify Your Message?'}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {showcaseData?.showcase.cta?.description || 'Join leading companies using AmplifiX to drive growth'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LanguageAwareLink to="/contact">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                  Get Started
                </Button>
              </LanguageAwareLink>
              <LanguageAwareLink to="/showcase/silo-pharma">
                <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                  View Showcase
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
