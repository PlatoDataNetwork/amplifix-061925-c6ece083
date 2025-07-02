
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import API from "./pages/API";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import SiloPharmaShowcase from "./pages/SiloPharmaShowcase";
import Showcase from "./pages/Showcase";
import Features from "./pages/Features";
import Solutions from "./pages/Solutions";
import PublicCompanies from "./pages/PublicCompanies";
import PrivateCompanies from "./pages/PrivateCompanies";
import IPOPreparation from "./pages/IPOPreparation";
import Fundraising from "./pages/Fundraising";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/api" element={<API />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/support" element={<Support />} />
              <Route path="/features" element={<Features />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/showcase/silo-pharma" element={<SiloPharmaShowcase />} />
              <Route path="/solutions/public-companies" element={<PublicCompanies />} />
              <Route path="/solutions/private-companies" element={<PrivateCompanies />} />
              <Route path="/solutions/ipo-preparation" element={<IPOPreparation />} />
              <Route path="/solutions/fundraising" element={<Fundraising />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
