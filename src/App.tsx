
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/useTheme";
import { Analytics } from "@vercel/analytics/react";
import PrivacyPopup from "@/components/PrivacyPopup";
import GTranslateController from "@/components/GTranslateController";
import TranslationDebugWidget from "@/components/TranslationDebugWidget";
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
import DevvStreamShowcase from "./pages/DevvStreamShowcase";
import CutEcoShowcase from "./pages/CutEcoShowcase";
import FAIMShowcase from "./pages/FAIMShowcase";
import InternationalLandAllianceShowcase from "./pages/InternationalLandAllianceShowcase";
import SynbioShowcase from "./pages/SynbioShowcase";
import SynbioPresentation from "./pages/SynbioPresentation";
import SynbioInteractivePresentation from "./pages/SynbioInteractivePresentation";
import AbatisShowcase from "./pages/AbatisShowcase";
import FacialDXShowcase from "./pages/FacialDXShowcase";
import ForexGPTShowcase from "./pages/ForexGPTShowcase";
import BlockwellShowcase from "./pages/BlockwellShowcase";
import StorageBlueShowcase from "./pages/StorageBlueShowcase";
import VersaTVShowcase from "./pages/VersaTVShowcase";
import KedalionShowcase from "./pages/KedalionShowcase";
import Showcase from "./pages/Showcase";
import Solutions from "./pages/Solutions";
import PublicCompanies from "./pages/PublicCompanies";
import PrivateCompanies from "./pages/PrivateCompanies";
import IPOPreparation from "./pages/IPOPreparation";
import Fundraising from "./pages/Fundraising";
import Advisory from "./pages/Advisory";
import Research from "./pages/Research";
import AnalyticsSolutions from "./pages/AnalyticsSolutions";
import IRPR from "./pages/IRPR";
import Syndication from "./pages/Syndication";
import Development from "./pages/Development";
import Blockchain from "./pages/Blockchain";
import InfluencerMarketing from "./pages/InfluencerMarketing";
import VideoDistribution from "./pages/VideoDistribution";
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
import ExternalArticle from "./pages/ExternalArticle";
import VerticalPage from "./pages/VerticalPage";
import ImportAdminRefactored from "./pages/ImportAdminRefactored";
import PlatoImport from "./pages/PlatoImport";
import AviationImport from "./pages/AviationImport";
import AerospaceImport from "./pages/AerospaceImport";
import UserManagement from "./pages/UserManagement";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleEditor from "./pages/ArticleEditor";
import ArticleFormatter from "./pages/ArticleFormatter";
import ArticleBackups from "./pages/ArticleBackups";
import ArticleComparison from "./pages/ArticleComparison";
import TranslationManager from "./pages/TranslationManager";
import TranslationTest from "./pages/TranslationTest";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SitemapGenerator from "./pages/SitemapGenerator";
import FynnAIShowcase from "./pages/FynnAIShowcase";
import VseeHealthShowcase from "./pages/VseeHealthShowcase";
import FGNexusShowcase from "./pages/FGNexusShowcase";
import GridAIShowcase from "./pages/GridAIShowcase";
import LixteShowcase from "./pages/LixteShowcase";
import ShowcaseAdmin from "./pages/ShowcaseAdmin";
import SecurityDashboard from "./pages/SecurityDashboard";
import JsonTester from "./pages/JsonTester";
import AdminAnalytics from "./pages/AdminAnalytics";
import BackfillDashboard from "./pages/BackfillDashboard";
import PlatoSourceUpdate from "./pages/PlatoSourceUpdate";
import PlatoSourceStats from "./pages/PlatoSourceStats";
import BulkImportAdmin from "./pages/BulkImportAdmin";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PrivacyPopup />
          <Analytics />
          <BrowserRouter>
            <GTranslateController />
            <TranslationDebugWidget />
            <Routes>
              {/* English routes (no prefix) */}
              <Route path="/" element={<Index />} />
              <Route path="/api" element={<API />} />
              <Route path="/intel" element={<Blog />} />
              <Route path="/intel/amplifi-x-2-0-article" element={<AmplifiX2Article />} />
              <Route path="/intel/ai-intelligence-article" element={<AIIntelligenceArticle />} />
              <Route path="/intel/advanced-analytics-article" element={<AdvancedAnalyticsArticle />} />
              <Route path="/intel/investor-engagement-article" element={<InvestorEngagementArticle />} />
              <Route path="/intel/external/:slug/:id" element={<ExternalArticle />} />
              <Route path="/intel/external/:id" element={<ExternalArticle />} />
              <Route path="/intel/article/:id" element={<ExternalArticle />} />
              <Route path="/intel/:vertical/:id" element={<ExternalArticle />} />
              <Route path="/intel/:vertical" element={<VerticalPage />} />
              <Route path="/support" element={<Support />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/showcase/silo-pharma" element={<SiloPharmaShowcase />} />
              <Route path="/showcase/karbon-x" element={<KarbonXShowcase />} />
              <Route path="/showcase/facial-dx" element={<FacialDXShowcase />} />
              <Route path="/showcase/micropolis" element={<MicropolisShowcase />} />
              <Route path="/showcase/micropolis/presentation" element={<MicropolisPresentation />} />
              <Route path="/showcase/devvstream" element={<DevvStreamShowcase />} />
              <Route path="/showcase/cut-eco" element={<CutEcoShowcase />} />
              <Route path="/showcase/faim" element={<FAIMShowcase />} />
              <Route path="/showcase/international-land-alliance" element={<InternationalLandAllianceShowcase />} />
              <Route path="/showcase/synbio" element={<SynbioShowcase />} />
              <Route path="/showcase/synbio-presentation" element={<SynbioPresentation />} />
              <Route path="/showcase/synbio-interactive" element={<SynbioInteractivePresentation />} />
              <Route path="/showcase/abatis" element={<AbatisShowcase />} />
              <Route path="/showcase/forex-gpt" element={<ForexGPTShowcase />} />
              <Route path="/showcase/blockwell" element={<BlockwellShowcase />} />
              <Route path="/showcase/storageblue" element={<StorageBlueShowcase />} />
              <Route path="/showcase/versatv" element={<VersaTVShowcase />} />
              <Route path="/showcase/vsee-health" element={<VseeHealthShowcase />} />
              <Route path="/showcase/kedalion" element={<KedalionShowcase />} />
              <Route path="/showcase/fg-nexus" element={<FGNexusShowcase />} />
              <Route path="/showcase/gridai" element={<GridAIShowcase />} />
              <Route path="/showcase/lixte" element={<LixteShowcase />} />
              <Route path="/solutions/advisory" element={<Advisory />} />
              <Route path="/solutions/research" element={<Research />} />
              <Route path="/solutions/analytics" element={<AnalyticsSolutions />} />
              <Route path="/solutions/ir-pr" element={<IRPR />} />
              <Route path="/solutions/syndication" element={<Syndication />} />
              <Route path="/solutions/development" element={<Development />} />
              <Route path="/solutions/blockchain" element={<Blockchain />} />
              <Route path="/solutions/influencer-marketing" element={<InfluencerMarketing />} />
              <Route path="/solutions/video-distribution" element={<VideoDistribution />} />
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
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="/admin/security" element={<AdminRoute><SecurityDashboard /></AdminRoute>} />
          <Route path="/admin/backfill" element={<AdminRoute><BackfillDashboard /></AdminRoute>} />
          <Route path="/import_history" element={<AdminRoute><BackfillDashboard /></AdminRoute>} />
          <Route path="/admin/import" element={<AdminRoute><ImportAdminRefactored /></AdminRoute>} />
          <Route path="/admin/bulk-import" element={<AdminRoute><BulkImportAdmin /></AdminRoute>} />
          <Route path="/admin/plato-import" element={<AdminRoute><PlatoImport /></AdminRoute>} />
          <Route path="/admin/aviation-import" element={<AdminRoute><AviationImport /></AdminRoute>} />
          <Route path="/admin/aerospace-import" element={<AdminRoute><AerospaceImport /></AdminRoute>} />
          <Route path="/admin/plato-source-update" element={<AdminRoute><PlatoSourceUpdate /></AdminRoute>} />
          <Route path="/admin/plato-source-stats" element={<AdminRoute><PlatoSourceStats /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/articles" element={<AdminRoute><ArticleEditor /></AdminRoute>} />
          <Route path="/admin/articles/edit/:id" element={<AdminRoute><ArticleEditor /></AdminRoute>} />
          <Route path="/admin/articles/format" element={<AdminRoute><ArticleFormatter /></AdminRoute>} />
          <Route path="/admin/articles/backups" element={<AdminRoute><ArticleBackups /></AdminRoute>} />
          <Route path="/admin/articles/comparison" element={<AdminRoute><ArticleComparison /></AdminRoute>} />
          <Route path="/admin/sitemaps" element={<AdminRoute><SitemapGenerator /></AdminRoute>} />
          
          <Route path="/admin/translations/manager" element={<TranslationManager />} />
          <Route path="/admin/translations/test" element={<TranslationTest />} />
          <Route path="/admin/showcase" element={<AdminRoute><ShowcaseAdmin /></AdminRoute>} />
          <Route path="/admin/json-tester" element={<AdminRoute><JsonTester /></AdminRoute>} />
          <Route path="/showcase/fynn-ai" element={<FynnAIShowcase />} />

              {/* Language-prefixed routes (e.g., /ar/, /fr/) */}
              <Route path="/:lang" element={<Index />} />
              <Route path="/:lang/api" element={<API />} />
              <Route path="/:lang/intel" element={<Blog />} />
              <Route path="/:lang/intel/amplifi-x-2-0-article" element={<AmplifiX2Article />} />
              <Route path="/:lang/intel/ai-intelligence-article" element={<AIIntelligenceArticle />} />
              <Route path="/:lang/intel/advanced-analytics-article" element={<AdvancedAnalyticsArticle />} />
              <Route path="/:lang/intel/investor-engagement-article" element={<InvestorEngagementArticle />} />
              <Route path="/:lang/intel/external/:slug/:id" element={<ExternalArticle />} />
              <Route path="/:lang/intel/external/:id" element={<ExternalArticle />} />
              <Route path="/:lang/intel/article/:id" element={<ExternalArticle />} />
              <Route path="/:lang/intel/:vertical/:id" element={<ExternalArticle />} />
              <Route path="/:lang/intel/:vertical" element={<VerticalPage />} />
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
              <Route path="/:lang/showcase/devvstream" element={<DevvStreamShowcase />} />
              <Route path="/:lang/showcase/cut-eco" element={<CutEcoShowcase />} />
              <Route path="/:lang/showcase/faim" element={<FAIMShowcase />} />
              <Route path="/:lang/showcase/international-land-alliance" element={<InternationalLandAllianceShowcase />} />
              <Route path="/:lang/showcase/fynn-ai" element={<FynnAIShowcase />} />
              <Route path="/:lang/showcase/abatis" element={<AbatisShowcase />} />
              <Route path="/:lang/showcase/forex-gpt" element={<ForexGPTShowcase />} />
              <Route path="/:lang/showcase/blockwell" element={<BlockwellShowcase />} />
              <Route path="/:lang/showcase/storageblue" element={<StorageBlueShowcase />} />
              <Route path="/:lang/showcase/versatv" element={<VersaTVShowcase />} />
              <Route path="/:lang/showcase/vsee-health" element={<VseeHealthShowcase />} />
              <Route path="/:lang/showcase/kedalion" element={<KedalionShowcase />} />
              <Route path="/:lang/showcase/fg-nexus" element={<FGNexusShowcase />} />
              <Route path="/:lang/showcase/gridai" element={<GridAIShowcase />} />
              <Route path="/:lang/showcase/lixte" element={<LixteShowcase />} />
              <Route path="/:lang/solutions/advisory" element={<Advisory />} />
              <Route path="/:lang/solutions/research" element={<Research />} />
              <Route path="/:lang/solutions/analytics" element={<AnalyticsSolutions />} />
              <Route path="/:lang/solutions/ir-pr" element={<IRPR />} />
              <Route path="/:lang/solutions/syndication" element={<Syndication />} />
              <Route path="/:lang/solutions/development" element={<Development />} />
              <Route path="/:lang/solutions/blockchain" element={<Blockchain />} />
              <Route path="/:lang/solutions/influencer-marketing" element={<InfluencerMarketing />} />
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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
