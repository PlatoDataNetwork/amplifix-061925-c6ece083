
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "@/hooks/useTheme";
import PrivacyPopup from "@/components/PrivacyPopup";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";

import API from "./pages/API";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import SiloPharmaShowcase from "./pages/SiloPharmaShowcase";
import KarbonXShowcase from "./pages/KarbonXShowcase";
import MicropolisShowcase from "./pages/MicropolisShowcase";
import MicropolisPresentation from "./pages/MicropolisPresentation";
import InternationalLandAllianceShowcase from "./pages/InternationalLandAllianceShowcase";
import AbatisShowcase from "./pages/AbatisShowcase";
import Showcase from "./pages/Showcase";
import Solutions from "./pages/Solutions";
import PublicCompanies from "./pages/PublicCompanies";
import PrivateCompanies from "./pages/PrivateCompanies";
import IPOPreparation from "./pages/IPOPreparation";
import Fundraising from "./pages/Fundraising";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataProcessing from "./pages/DataProcessing";
import Compliance from "./pages/Compliance";
import AmplifiX2Article from "./pages/AmplifiX2Article";
import AIIntelligenceArticle from "./pages/AIIntelligenceArticle";
import AdvancedAnalyticsArticle from "./pages/AdvancedAnalyticsArticle";
import InvestorEngagementArticle from "./pages/InvestorEngagementArticle";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

/**
 * Route configuration with support for optional language prefix
 * Supports both /about and /ar/about, /fr/contact, etc.
 */
const AppRoutes = () => (
  <Routes>
    {/* Routes without language prefix (English) */}
    <Route path="/" element={<Index />} />
    <Route path="/api" element={<API />} />
    <Route path="/intel" element={<Blog />} />
    <Route path="/intel/amplifi-x-2-0-article" element={<AmplifiX2Article />} />
    <Route path="/intel/ai-intelligence-article" element={<AIIntelligenceArticle />} />
    <Route path="/intel/advanced-analytics-article" element={<AdvancedAnalyticsArticle />} />
    <Route path="/intel/investor-engagement-article" element={<InvestorEngagementArticle />} />
    <Route path="/support" element={<Support />} />
    <Route path="/solutions" element={<Solutions />} />
    <Route path="/about" element={<About />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/showcase" element={<Showcase />} />
    <Route path="/showcase/silo-pharma" element={<SiloPharmaShowcase />} />
    <Route path="/showcase/karbon-x" element={<KarbonXShowcase />} />
    <Route path="/showcase/micropolis" element={<MicropolisShowcase />} />
    <Route path="/showcase/micropolis/presentation" element={<MicropolisPresentation />} />
    <Route path="/showcase/international-land-alliance" element={<InternationalLandAllianceShowcase />} />
    <Route path="/showcase/abatis" element={<AbatisShowcase />} />
    <Route path="/solutions/public-companies" element={<PublicCompanies />} />
    <Route path="/solutions/private-companies" element={<PrivateCompanies />} />
    <Route path="/solutions/ipo-preparation" element={<IPOPreparation />} />
    <Route path="/solutions/fundraising" element={<Fundraising />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/compliance" element={<Compliance />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/data-processing" element={<DataProcessing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Routes with language prefix (all other languages) */}
    <Route path="/:lang" element={<Index />} />
    <Route path="/:lang/api" element={<API />} />
    <Route path="/:lang/intel" element={<Blog />} />
    <Route path="/:lang/intel/amplifi-x-2-0-article" element={<AmplifiX2Article />} />
    <Route path="/:lang/intel/ai-intelligence-article" element={<AIIntelligenceArticle />} />
    <Route path="/:lang/intel/advanced-analytics-article" element={<AdvancedAnalyticsArticle />} />
    <Route path="/:lang/intel/investor-engagement-article" element={<InvestorEngagementArticle />} />
    <Route path="/:lang/support" element={<Support />} />
    <Route path="/:lang/solutions" element={<Solutions />} />
    <Route path="/:lang/about" element={<About />} />
    <Route path="/:lang/faq" element={<FAQ />} />
    <Route path="/:lang/contact" element={<Contact />} />
    <Route path="/:lang/pricing" element={<Pricing />} />
    <Route path="/:lang/showcase" element={<Showcase />} />
    <Route path="/:lang/showcase/silo-pharma" element={<SiloPharmaShowcase />} />
    <Route path="/:lang/showcase/karbon-x" element={<KarbonXShowcase />} />
    <Route path="/:lang/showcase/micropolis" element={<MicropolisShowcase />} />
    <Route path="/:lang/showcase/micropolis/presentation" element={<MicropolisPresentation />} />
    <Route path="/:lang/showcase/international-land-alliance" element={<InternationalLandAllianceShowcase />} />
    <Route path="/:lang/showcase/abatis" element={<AbatisShowcase />} />
    <Route path="/:lang/solutions/public-companies" element={<PublicCompanies />} />
    <Route path="/:lang/solutions/private-companies" element={<PrivateCompanies />} />
    <Route path="/:lang/solutions/ipo-preparation" element={<IPOPreparation />} />
    <Route path="/:lang/solutions/fundraising" element={<Fundraising />} />
    <Route path="/:lang/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/:lang/compliance" element={<Compliance />} />
    <Route path="/:lang/terms-of-service" element={<TermsOfService />} />
    <Route path="/:lang/data-processing" element={<DataProcessing />} />
    <Route path="/:lang/login" element={<Login />} />
    <Route path="/:lang/signup" element={<Signup />} />
    <Route path="/:lang/dashboard" element={<Dashboard />} />

    {/* 404 catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PrivacyPopup />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
    <Analytics />
    <SpeedInsights />
  </QueryClientProvider>
);

export default App;
